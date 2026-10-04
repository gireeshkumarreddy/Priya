"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import type { Product } from "./products";
import { createPhotoTurn } from "./photo-turn-renderer";

export type ProductTurnHandle = { turn: (radians: number) => void };

export const ProductTurn = forwardRef<ProductTurnHandle, { product: Product }>(function ProductTurn({ product }, ref) {
 const canvas=useRef<HTMLCanvasElement>(null);
 const draw=useRef<(angle:number)=>void>(()=>{});
 const rotation=useRef(0);
 const [ready,setReady]=useState(false);
 useImperativeHandle(ref,()=>({turn:angle=>{rotation.current=angle;draw.current(angle);}}),[]);
 useEffect(()=>{
  const element=canvas.current;if(!element)return;
  let resize:ResizeObserver|undefined;
  const cancel=createPhotoTurn(element,product,render=>{
   draw.current=render;
   const size=()=>{
    // Supersampling keeps fine packaging type clear even on standard-DPI screens.
    const density=Math.max(2,Math.min(devicePixelRatio||1,2.5));
    const width=Math.max(1,Math.round(element.clientWidth*density));
    const height=Math.max(1,Math.round(element.clientHeight*density));
    // Reassigning an unchanged canvas size clears its pixels. ResizeObserver
    // fires once on attachment too, so preserve the already rendered frame.
    if(element.width!==width)element.width=width;
    if(element.height!==height)element.height=height;
    render(rotation.current);
   };
   resize=new ResizeObserver(size);resize.observe(element);size();setReady(true);
  });
  return()=>{cancel();resize?.disconnect();draw.current=()=>{};};
 },[product]);
 const clip={clipPath:`url(#cut-${product.clipId??product.id})`};
 return <div className="product-turn" data-ready={ready}>
  <img className="spin-fallback" style={clip} src={`/assets/${product.image}`} alt={`Priya ${product.name} packaging`} draggable="false"/>
  <canvas ref={canvas} style={clip} aria-hidden="true"/>
 </div>;
});
