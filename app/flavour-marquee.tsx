"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { products, type Product } from "./products";
import { ArrowUpRight, ProductImage } from "./product-image";

// Four identical copies keep the row filled on any screen width; the second
// copy is the real, focusable one and the others are visual repeats.
const COPIES = 4, REAL = 1;
const CRUISE = .05, CRAWL = .012; // px per ms: normal drift, and under the pointer

/**
 * The full range, numbered 01–05, drifting right to left in a seamless loop.
 * It slows to a crawl under the pointer so a jar is easy to pick, holds still
 * for keyboard focus, and can be dragged or swiped either way.
 */
export function FlavourMarquee({current, onOpen, reduced}: {current: string; onOpen: (product: Product) => void; reduced: boolean}) {
 const viewport = useRef<HTMLDivElement>(null), track = useRef<HTMLDivElement>(null);
 const offset = useRef<number | null>(null), slow = useRef(false), held = useRef(false), stopped = useRef(false);
 const drag = useRef<{x: number; from: number; moved: boolean} | null>(null);
 const [playing, setPlaying] = useState(true);
 useEffect(() => {
  const view = viewport.current, row = track.current; if (!view || !row) return;
  let raf = 0, previous = 0, speed = 0, visible = false, loop = 0, inset = 0;
  const measure = () => {
   // Fractional positions: whole-pixel offsets would make the wrap twitch.
   loop = row.children[REAL * products.length].getBoundingClientRect().left - row.children[0].getBoundingClientRect().left;
   inset = view.clientWidth * .05;
  };
  const tick = (now: number) => {
   const dt = previous ? Math.min(now - previous, 50) : 16; previous = now;
   const goal = reduced || stopped.current || held.current || drag.current ? 0 : slow.current ? CRAWL : CRUISE;
   speed += (goal - speed) * (1 - Math.exp(-dt / 280));
   offset.current ??= inset - REAL * loop;
   if (!drag.current) offset.current -= speed * dt;
   // Wrap by exactly one copy so the jump is invisible.
   const base = inset - REAL * loop;
   let rel = loop ? (offset.current - base) % loop : 0; if (rel > 0) rel -= loop;
   offset.current = base + rel;
   row.style.transform = `translate3d(${offset.current.toFixed(2)}px,0,0)`;
   raf = visible ? requestAnimationFrame(tick) : 0;
  };
  // Only animate while the row is on screen.
  const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible && !raf) { previous = 0; raf = requestAnimationFrame(tick); } });
  const ro = new ResizeObserver(measure);
  // Start on the real copy, aligned with the page margin, before the first paint.
  measure(); offset.current ??= inset - REAL * loop; row.style.transform = `translate3d(${offset.current}px,0,0)`;
  ro.observe(view); io.observe(view);
  return () => { io.disconnect(); ro.disconnect(); cancelAnimationFrame(raf); };
 }, [reduced]);
 const release = () => { if (drag.current) setTimeout(() => { drag.current = null; }, 0); };
 const toggle = () => { stopped.current = playing; setPlaying(!playing); };
 return <>
  <div ref={viewport} className="flavour-marquee"
   onPointerEnter={e => { if (e.pointerType === "mouse") slow.current = true; }}
   onPointerLeave={() => { slow.current = false; release(); }}
   onPointerDown={e => { drag.current = {x: e.clientX, from: offset.current ?? 0, moved: false}; }}
   onPointerMove={e => { const d = drag.current; if (!d) return; if (Math.abs(e.clientX - d.x) > 6) d.moved = true; if (d.moved) offset.current = d.from + e.clientX - d.x; }}
   onPointerUp={release} onPointerCancel={() => { drag.current = null; }}
   onFocus={() => { held.current = true; }} onBlur={() => { held.current = false; }}>
   <div ref={track} className="flavour-track">{Array.from({length: COPIES}, (_, copy) => products.map((product, i) => {
    const real = copy === REAL;
    return <button key={`${copy}-${product.id}`} className={`related-product${product.id === current ? " is-current" : ""}`} tabIndex={real ? undefined : -1} aria-hidden={real ? undefined : true}
     aria-label={real ? `${product.name}${product.id === current ? ", now viewing" : ""}` : undefined}
     onClick={() => { if (!drag.current?.moved) onOpen(product); }}
     onFocus={e => { if (real && viewport.current) offset.current = viewport.current.clientWidth * .05 - e.currentTarget.offsetLeft; }}>
     <div className="related-photo"><span className="related-number">0{i + 1}</span>{product.id === current && <span className="related-current">Now viewing</span>}<div className="related-image"><ProductImage product={product}/></div><span className="related-plus"><ArrowUpRight/></span></div>
     <span className="related-name">{product.name}</span><span className="related-kind">{product.kind}</span>
    </button>;
   }))}</div>
  </div>
  <div className="flavour-controls"><span>DRAG OR SWIPE TO EXPLORE</span><button onClick={toggle} aria-label={playing ? "Pause the flavours" : "Play the flavours"}>{playing ? <Pause size={11} fill="currentColor"/> : <Play size={11} fill="currentColor"/>}</button></div>
 </>;
}
