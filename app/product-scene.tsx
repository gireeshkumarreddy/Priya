"use client";

import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { ProductTurn, type ProductTurnHandle } from "./product-turn";
import type { Product } from "./products";

const clamp=(n:number)=>Math.min(1,Math.max(0,n));
const smooth=(n:number)=>n*n*(3-2*n);

export function ProductScene({product,reduced}:{product:Product;reduced:boolean}) {
 const scene=useRef<HTMLElement>(null),jar=useRef<HTMLDivElement>(null),title=useRef<HTMLHeadingElement>(null);
 const turn=useRef<ProductTurnHandle>(null);
 useEffect(()=>{
  let raf=0,previous=0,current=window.scrollY;
  const render=(time:number)=>{
   const dt=previous?Math.min(time-previous,40):16;previous=time;
   current+=(window.scrollY-current)*(reduced?1:1-Math.exp(-dt/65));
   const height=window.innerHeight;
   const scroll=Math.max(0,current-(scene.current?.offsetTop??0))/height;
   const arrive=smooth(clamp(scroll/.42));
   const spin=clamp((scroll-.42)/1.12);
   if(jar.current){
    const mobile=window.innerWidth<701;
    jar.current.style.transform=`translate(-50%,${reduced?0:-arrive*height*(mobile?.45:.57)}px)`;
   }
   turn.current?.turn(reduced?0:spin*Math.PI*2);
   if(title.current){title.current.style.opacity=String(1-arrive);title.current.style.transform=`translateY(${-arrive*65}px)`;}
   scene.current?.style.setProperty("--arrival",String(arrive));
   if(Math.abs(window.scrollY-current)>.1)raf=requestAnimationFrame(render);else raf=0;
  };
  const update=()=>{if(!raf){previous=0;raf=requestAnimationFrame(render);}};
  update();window.addEventListener("scroll",update,{passive:true});window.addEventListener("resize",update);
  return()=>{cancelAnimationFrame(raf);window.removeEventListener("scroll",update);window.removeEventListener("resize",update);};
 },[product,reduced]);
 return <section ref={scene} className={`product-hero spin-scene ${reduced?"reduced-scene":""}`} aria-labelledby="product-title">
  <div className="product-hero-stage">
   <h1 ref={title} id="product-title" className={`product-title ${product.lines[0].length>9?"long-title":""}`}>{product.lines.map((line,i)=><span className="title-mask" key={line}><span style={{animationDelay:`${100+i*100}ms`}}>{line}</span></span>)}</h1>
   <span className="product-category">{product.kind}</span><span className="product-origin">The joy of good taste<br/>Since 1980</span>
   <div ref={jar} className={`detail-product ${product.carton?"is-carton":""}`}><ProductTurn ref={turn} product={product}/></div>
   <button className="detail-scroll" onClick={()=>document.getElementById("story")?.scrollIntoView({behavior:reduced?"instant":"smooth"})} aria-label="Read the product story"><ArrowDown size={18}/></button>
  </div>
 </section>;
}
