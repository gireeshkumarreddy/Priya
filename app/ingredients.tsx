"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Check } from "lucide-react";
import type { Product, Sprite } from "./products";

const wedges = Array.from({ length: 8 }, (_, i) => {
 const a = (i / 8) * Math.PI * 2 + .06, b = ((i + 1) / 8) * Math.PI * 2 - .06, r = 35;
 return `M50 50 L${50 + Math.cos(a) * r} ${50 + Math.sin(a) * r} A${r} ${r} 0 0 1 ${50 + Math.cos(b) * r} ${50 + Math.sin(b) * r}Z`;
});

/** Hand-drawn ingredient sprites, defined once and reused by every particle and icon. */
export function SpriteDefs() {
 return <svg className="clip-definitions" width="0" height="0" aria-hidden="true"><defs>
  <symbol id="spr-gongura-leaf" viewBox="0 0 100 100">
   {/* Roselle: three broad, round-tipped lobes on a red stalk. */}
   <path d="M50 97 L50 82" stroke="#8a2836" strokeWidth="3.5" strokeLinecap="round"/>
   <path fill="#4b8a3f" d="M48 84 C30 84 10 72 8 52 C7 45 12 40 19 42 C35 47 45 64 48 84Z"/>
   <path fill="#4b8a3f" d="M52 84 C70 84 90 72 92 52 C93 45 88 40 81 42 C65 47 55 64 52 84Z"/>
   <path fill="#3e7b36" d="M50 84 C32 70 28 38 42 14 C46 8 54 8 58 14 C72 38 68 70 50 84Z"/>
   <path d="M50 82 L50 16 M49 82 L15 49 M51 82 L85 49" stroke="#8a2836" strokeWidth="1.6" fill="none" opacity=".75"/>
  </symbol>
  <symbol id="spr-curry-leaf" viewBox="0 0 100 100"><path fill="#2f6a2b" d="M50 4 C72 28 72 70 50 96 C28 70 28 28 50 4Z"/><path d="M50 10 L50 92" stroke="#9cc06a" strokeWidth="1.6"/></symbol>
  <symbol id="spr-red-chilli" viewBox="0 0 100 100">
   <path fill="#c3172b" d="M24 28 C34 22 46 26 54 36 C66 52 78 70 94 90 C74 84 56 70 44 56 C34 46 24 40 24 28Z"/>
   <path fill="#ff8a7a" opacity=".45" d="M34 30 C44 30 52 38 58 46 C50 42 42 36 34 30Z"/>
   <path fill="#3b7a2a" d="M14 22 C20 16 30 18 30 28 C26 34 18 34 14 30Z"/><path d="M16 22 C12 14 8 10 3 8" stroke="#3b7a2a" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
  </symbol>
  <symbol id="spr-green-chilli" viewBox="0 0 100 100">
   <path fill="#4f9a2a" d="M24 28 C34 22 46 26 54 36 C66 52 78 70 94 90 C74 84 56 70 44 56 C34 46 24 40 24 28Z"/>
   <path fill="#d4f59a" opacity=".5" d="M34 30 C44 30 52 38 58 46 C50 42 42 36 34 30Z"/>
   <path fill="#2f6322" d="M14 22 C20 16 30 18 30 28 C26 34 18 34 14 30Z"/><path d="M16 22 C12 14 8 10 3 8" stroke="#2f6322" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
  </symbol>
  <symbol id="spr-chilli-flake" viewBox="0 0 100 100"><path fill="#b3121f" d="M22 38 L52 22 L78 40 L66 70 L34 72Z"/><path fill="#e8503e" opacity=".6" d="M34 40 L52 30 L64 42 L48 50Z"/><ellipse cx="74" cy="78" rx="8" ry="5" fill="#ecc97a"/></symbol>
  <symbol id="spr-garlic" viewBox="0 0 100 100">
   <path fill="#f5eddc" stroke="#d6c39f" strokeWidth="2" d="M50 8 C58 22 80 44 76 70 C72 90 28 90 24 70 C20 44 42 22 50 8Z"/>
   <path d="M50 16 C46 40 44 62 48 86 M58 26 C64 46 66 66 62 84" stroke="#e1cfae" strokeWidth="2" fill="none"/><path d="M46 9 C49 3 52 3 54 9" stroke="#b79f75" strokeWidth="3" fill="none"/>
  </symbol>
  <symbol id="spr-mustard" viewBox="0 0 100 100"><circle cx="36" cy="42" r="16" fill="#5a2f17"/><circle cx="66" cy="56" r="14" fill="#6b3a1c"/><circle cx="44" cy="74" r="11" fill="#4c2712"/><circle cx="31" cy="37" r="4" fill="#c18656" opacity=".7"/><circle cx="62" cy="51" r="3.5" fill="#c18656" opacity=".7"/></symbol>
  <symbol id="spr-lime" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#79a92b"/><circle cx="50" cy="50" r="41" fill="#f3f5cc"/><g fill="#cfe060">{wedges.map(d => <path key={d} d={d}/>)}</g><circle cx="50" cy="50" r="4" fill="#f3f5cc"/></symbol>
  <symbol id="spr-ginger" viewBox="0 0 100 100">
   <path fill="#d8a45a" stroke="#b07e3a" strokeWidth="2" d="M12 62 C8 48 22 40 32 46 C34 32 50 26 56 38 C64 26 82 30 80 46 C94 50 94 68 80 72 C70 82 50 78 40 74 C28 80 14 74 12 62Z"/>
   <path d="M30 52 C34 58 34 64 30 68 M56 44 C60 52 60 60 56 66 M74 52 C76 58 76 62 74 66" stroke="#b9873f" strokeWidth="2" fill="none" opacity=".7"/>
  </symbol>
  <symbol id="spr-tomato" viewBox="0 0 100 100">
   <circle cx="50" cy="56" r="40" fill="#d9282c"/><ellipse cx="35" cy="42" rx="10" ry="7" fill="#ff8a7a" opacity=".55"/>
   <path fill="#3e7d2c" d="M50 18 L56 28 L68 24 L60 34 L70 40 L56 38 L50 46 L44 38 L30 40 L40 34 L32 24 L44 28Z"/><path d="M50 22 L52 8" stroke="#3e7d2c" strokeWidth="4" strokeLinecap="round"/>
  </symbol>
  <symbol id="spr-tomato-slice" viewBox="0 0 100 100">
   <circle cx="50" cy="50" r="46" fill="#c9201f"/><circle cx="50" cy="50" r="40" fill="#ee4a3b"/>
   <g fill="#f9a48d"><ellipse cx="50" cy="27" rx="11" ry="13"/><ellipse cx="73" cy="50" rx="13" ry="11"/><ellipse cx="50" cy="73" rx="11" ry="13"/><ellipse cx="27" cy="50" rx="13" ry="11"/></g>
   <g fill="#f8d77e"><ellipse cx="48" cy="26" rx="2.5" ry="3.5"/><ellipse cx="74" cy="48" rx="3.5" ry="2.5"/><ellipse cx="52" cy="74" rx="2.5" ry="3.5"/><ellipse cx="26" cy="52" rx="3.5" ry="2.5"/></g><circle cx="50" cy="50" r="7" fill="#e23b30"/>
  </symbol>
  <symbol id="spr-mango" viewBox="0 0 100 100"><path fill="#f3cf55" d="M14 40 L56 24 L88 42 L86 70 L46 86 L16 68Z"/><path fill="#e2b33a" d="M48 58 L88 42 L86 70 L46 86Z"/><path fill="#5c8c2b" d="M14 40 L56 24 L88 42 L48 58Z"/><path fill="#7fae3c" opacity=".6" d="M24 40 L54 29 L70 38 L42 49Z"/></symbol>
  <symbol id="spr-tamarind" viewBox="0 0 100 100">
   <path fill="#7a4a26" d="M10 60 C14 48 24 50 30 46 C36 40 44 44 50 40 C58 34 66 38 72 34 C80 28 90 32 92 40 C94 48 86 50 80 54 C72 58 66 56 58 60 C50 64 44 62 36 66 C28 70 20 72 14 70 C10 68 8 64 10 60Z"/>
   <path d="M18 62 C40 54 62 48 86 38" stroke="#a36a3c" strokeWidth="2" fill="none" opacity=".6"/>
  </symbol>
 </defs></svg>;
}

export function SpriteIcon({ sprite, className }: { sprite: Sprite; className?: string }) {
 return <svg className={className} viewBox="0 0 100 100" aria-hidden="true"><use href={`#spr-${sprite}`}/></svg>;
}

type Particle = { kind: Sprite; x: number; y: number; depth: number; size: number; rot: number; dur: number; delay: number; mobile: boolean };
const sizes: Record<Sprite, [number, number]> = { "gongura-leaf": [90, 140], "curry-leaf": [46, 70], "red-chilli": [80, 120], "green-chilli": [70, 105], "chilli-flake": [16, 30], garlic: [40, 60], mustard: [20, 30], lime: [70, 110], ginger: [80, 115], tomato: [72, 105], "tomato-slice": [64, 92], mango: [60, 90], tamarind: [80, 110] };

function seeded(text: string) {
 let h = 1779033703;
 for (const c of text) h = Math.imul(h ^ c.charCodeAt(0), 3432918353);
 return () => { h = Math.imul(h ^ (h >>> 15), h | 1); h ^= h + Math.imul(h ^ (h >>> 7), h | 61); return ((h ^ (h >>> 14)) >>> 0) / 4294967296; };
}

/** Scatter particles around the jar without covering it; deterministic per product. */
function layout(product: Product): Particle[] {
 const rand = seeded(product.id), placed: Particle[] = [];
 for (const [kind, count = 0] of Object.entries(product.details.scatter) as [Sprite, number][]) {
  for (let j = 0; j < count; j++) {
   let x = 0, y = 0;
   for (let attempt = 0; attempt < 40; attempt++) {
    x = (rand() * 2 - 1) * 47; y = (rand() * 2 - 1) * 45;
    const clearOfJar = Math.abs(x) > 13 || Math.abs(y) > 36;
    const spaced = placed.every(p => Math.hypot(p.x - x, (p.y - y) * .8) > 7);
    if (clearOfJar && spaced) break;
   }
   const depth = .4 + rand() * .85, [min, max] = sizes[kind];
   placed.push({ kind, x, y, depth, size: Math.round((min + rand() * (max - min)) * (.62 + depth * .42)), rot: Math.round(rand() * 360), dur: 3.2 + rand() * 3.4, delay: -rand() * 6, mobile: j % 2 === 0 });
  }
 }
 return placed;
}

/** The floating ingredients plus the two information panels that flank the turning jar. */
export function IngredientScene({ product }: { product: Product }) {
 const { details } = product;
 const particles = useMemo(() => layout(product), [product]);
 const [focus, setFocus] = useState<Sprite | null>(null);
 const [open, setOpen] = useState(0);
 const field = useRef<HTMLDivElement>(null);
 useEffect(() => {
  // Pointer parallax: near particles drift further than far ones.
  let raf = 0, x = 0, y = 0, tx = 0, ty = 0;
  const tick = () => {
   x += (tx - x) * .08; y += (ty - y) * .08;
   field.current?.style.setProperty("--px", x.toFixed(3)); field.current?.style.setProperty("--py", y.toFixed(3));
   raf = Math.abs(tx - x) + Math.abs(ty - y) > .002 ? requestAnimationFrame(tick) : 0;
  };
  const move = (e: PointerEvent) => { tx = e.clientX / innerWidth * 2 - 1; ty = e.clientY / innerHeight * 2 - 1; if (!raf) raf = requestAnimationFrame(tick); };
  window.addEventListener("pointermove", move, { passive: true });
  return () => { window.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
 }, []);
 const highlight = (sprite: Sprite | null) => setFocus(sprite);
 return <>
  <div ref={field} className={`ingredient-field${focus ? " has-focus" : ""}`} aria-hidden="true">
   <div className="ingredient-orbit">{particles.map((p, i) => <span key={i} data-kind={p.kind}
    className={`ingredient-particle kind-${p.kind}${p.mobile ? "" : " desktop-only"}${p.depth < .62 ? " is-far" : p.depth > 1.12 ? " is-near" : ""}${focus === p.kind ? " is-focus" : ""}`}
    style={{ "--x": `${p.x}vw`, "--y": `${p.y}vh`, "--depth": p.depth, "--size": `${p.size}px`, "--r": `${p.rot}deg`, "--dur": `${p.dur}s`, "--delay": `${p.delay}s` } as CSSProperties}>
    <span className="particle-float"><SpriteIcon sprite={p.kind}/></span>
   </span>)}</div>
  </div>
  <aside className="ingredient-panel panel-left" aria-label={`What is inside ${product.name}`}>
   <span className="eyebrow">WHAT&apos;S INSIDE</span>
   <h2 className="panel-title">The ingredients</h2>
   <ul className="ingredient-list">{details.ingredients.map((ingredient, i) => <li key={ingredient.name} style={{ "--i": i } as CSSProperties} className={open === i ? "is-open" : undefined}>
    <button className="ingredient-row" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}
     onMouseEnter={() => highlight(ingredient.sprite)} onMouseLeave={() => highlight(null)} onFocus={() => highlight(ingredient.sprite)} onBlur={() => highlight(null)}>
     <SpriteIcon sprite={ingredient.sprite} className="ingredient-icon"/>
     <span className="ingredient-name">{ingredient.name}</span>
     {ingredient.share && <span className="ingredient-share">{ingredient.share}</span>}
     <span className="ingredient-toggle" aria-hidden="true"/>
    </button>
    <div className="ingredient-detail"><p>{ingredient.detail}</p></div>
   </li>)}</ul>
  </aside>
  <aside className="ingredient-panel panel-right" aria-label={`Why you will love ${product.name}`}>
   <span className="eyebrow">WHY YOU&apos;LL LOVE IT</span>
   <h2 className="panel-title">Good things inside</h2>
   <ul className="highlight-list">{details.highlights.map((item, i) => <li key={item} style={{ "--i": i } as CSSProperties}><span className="tick"><Check size={11} strokeWidth={2.4}/></span>{item}</li>)}</ul>
   <div className="heat-row"><span>HEAT</span><div className="heat-meter" role="img" aria-label={`Heat ${details.heat} out of 5`}>{[1, 2, 3, 4, 5].map(n => <SpriteIcon key={n} sprite="red-chilli" className={n <= details.heat ? "is-on" : undefined}/>)}</div></div>
   <dl className="spec-list">{details.specs.map(spec => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}</dl>
   <a className="cta cta-solid cta-small" href={product.url} target="_blank" rel="noopener noreferrer">Buy this {product.kind.toLowerCase()} <span aria-hidden="true">↗</span></a>
  </aside>
 </>;
}
