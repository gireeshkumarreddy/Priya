"use client";

import { useEffect, useRef } from "react";
import { ProductTurn, type ProductTurnHandle } from "./product-turn";
import { blobPath } from "./blob";
import type { Product } from "./products";

const ease = (t: number) => t < .5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
const clamp = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Opening sequence: the jar rises onto a red wavy disc and turns once, the
 * logo takes the centre, then the curtain lifts while the logo flies into the
 * header slot it will occupy for the rest of the visit.
 */
export function Intro({ product, onDone }: { product: Product; onDone: () => void }) {
 const root = useRef<HTMLDivElement>(null), curtain = useRef<HTMLDivElement>(null), disc = useRef<SVGSVGElement>(null), discPath = useRef<SVGPathElement>(null);
 const jar = useRef<HTMLDivElement>(null), logo = useRef<HTMLImageElement>(null), turn = useRef<ProductTurnHandle>(null);
 const finished = useRef(false);
 const finish = useRef(() => {});
 useEffect(() => {
  const animations: Animation[] = [];
  let raf = 0, timer = 0;
  const done = () => { if (finished.current) return; finished.current = true; onDone(); };
  // Deep links and reduced-motion visitors go straight to the content.
  if (window.location.hash || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { done(); return; }
  finish.current = () => { animations.forEach(a => a.finish()); cancelAnimationFrame(raf); clearTimeout(timer); done(); };
  const play = (el: Element | null, frames: Keyframe[], options: KeyframeAnimationOptions) => { if (el) animations.push(el.animate(frames, { fill: "both", ...options })); };
  const start = performance.now();
  // Later animations on the same element only fill forwards, so they never
  // override an earlier one before their own start.
  // The disc keeps breathing and the jar turns once, both on one clock.
  const frame = (now: number) => {
   const t = now - start;
   discPath.current?.setAttribute("d", blobPath(500, 500, 430, t / 520));
   turn.current?.turn(ease(clamp((t - 950) / 1500)) * Math.PI * 2);
   if (t < 3000) raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  play(disc.current, [{ transform: "translate(-50%,-50%) scale(0) rotate(-40deg)" }, { transform: "translate(-50%,-50%) scale(1) rotate(0)" }], { duration: 1100, delay: 150, easing: "cubic-bezier(.2,.9,.25,1.05)" });
  play(jar.current, [{ transform: "translate(-50%,-50%) translateY(70vh) rotate(-16deg) scale(.7)", opacity: 0 }, { opacity: 1, offset: .25 }, { transform: "translate(-50%,-50%) translateY(0) rotate(0) scale(1)", opacity: 1 }], { duration: 1250, delay: 200, easing: "cubic-bezier(.16,1,.3,1)" });
  play(jar.current, [{ transform: "translate(-50%,-50%) scale(1)", opacity: 1 }, { transform: "translate(-50%,-50%) translateY(-6vh) scale(.35)", opacity: 0 }], { duration: 520, delay: 2550, easing: "cubic-bezier(.6,0,.4,1)", fill: "forwards" });
  play(disc.current, [{ transform: "translate(-50%,-50%) scale(1)" }, { transform: "translate(-50%,-50%) scale(0)" }], { duration: 620, delay: 2600, easing: "cubic-bezier(.7,0,.3,1)", fill: "forwards" });
  play(logo.current, [{ opacity: 0, transform: "translate(-50%,-50%) scale(.6)", filter: "blur(10px)" }, { opacity: 1, transform: "translate(-50%,-50%) scale(1)", filter: "blur(0)" }], { duration: 650, delay: 3150, easing: "cubic-bezier(.2,.9,.3,1.2)" });
  // Fly the logo into the header brand, measured live so it lands exactly.
  timer = window.setTimeout(() => {
   const target = document.querySelector<HTMLElement>(".site-header .brand img")?.getBoundingClientRect();
   const from = logo.current?.getBoundingClientRect();
   if (target && from && logo.current) {
    const dx = target.left + target.width / 2 - (from.left + from.width / 2), dy = target.top + target.height / 2 - (from.top + from.height / 2);
    play(logo.current, [{ transform: "translate(-50%,-50%) scale(1)" }, { transform: `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(${target.width / from.width})` }], { duration: 950, easing: "cubic-bezier(.75,0,.2,1)", fill: "forwards" });
   }
   play(curtain.current, [{ transform: "translateY(0)" }, { transform: "translateY(-100%)" }], { duration: 950, delay: 80, easing: "cubic-bezier(.75,0,.2,1)" });
   timer = window.setTimeout(done, 1000);
  }, 4150);
  return () => { animations.forEach(a => a.cancel()); cancelAnimationFrame(raf); clearTimeout(timer); };
 }, [onDone]);
 return <div ref={root} className="intro" role="presentation">
  <div ref={curtain} className="intro-curtain">
   <svg ref={disc} className="intro-disc" viewBox="0 0 1000 1000" aria-hidden="true"><path ref={discPath} d={blobPath(500, 500, 430, 0)}/></svg>
   <div ref={jar} className="intro-jar"><ProductTurn ref={turn} product={product}/></div>
   <span className="intro-tagline">THE JOY OF GOOD TASTE · SINCE 1980</span>
   <button className="intro-skip" onClick={() => finish.current()}>Skip intro</button>
  </div>
  <img ref={logo} className="intro-logo" src="/assets/logo.png" alt="" width="594" height="287"/>
 </div>;
}
