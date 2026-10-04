"use client";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, Pause, Play, X } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";

import { products, type Product } from "./products";
import { ProductScene } from "./product-scene";

const asset = (name: string) => `/assets/${name}`;
const mod = (n: number, length: number) => ((n % length) + length) % length;
function ProductImage({product, lazy = false}: {product: Product; lazy?: boolean}) { return <img className={product.carton ? "carton-image" : "jar-image"} style={product.carton ? undefined : {clipPath:`url(#cut-${product.clipId??product.id})`}} src={asset(product.image)} alt={`Priya ${product.name} packaging`} draggable="false" loading={lazy ? "lazy" : "eager"}/>; }
function ArrowUpRight() { return <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 15 15 5M5 5h10v10" stroke="currentColor" strokeWidth="1.2"/></svg>; }

export default function Home() {
 const [selected, setSelected] = useState<Product | null>(null);
 const [transitioning, setTransitioning] = useState(false);
 const [menu, setMenu] = useState(false);
 const [automatic, setAutomatic] = useState(true);
 const [active, setActive] = useState(0);
 const [reduced, setReduced] = useState(false);
 const [flight, setFlight] = useState<{ product: Product; rect: DOMRect; landed: boolean } | null>(null);
 const [gallery, setGallery] = useState(1);
 const stage = useRef<HTMLElement>(null);
 const jars = useRef<(HTMLButtonElement | null)[]>([]);
 const backdrop = useRef<SVGGElement>(null);
 const contour = useRef<SVGPathElement>(null);
 const cursor = useRef(0), target = useRef(0);
 const dragging = useRef<{start: number; offset: number; moved: boolean} | null>(null);
 const hover = useRef(false);
 const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
 useEffect(() => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const change = () => { setReduced(mq.matches); if(mq.matches) setAutomatic(false); };
  change(); mq.addEventListener("change",change); return () => mq.removeEventListener("change",change);
 },[]);
 const openProduct = useCallback((product: Product, origin?: HTMLElement) => {
  if(transitioning) return;
  setAutomatic(false); setMenu(false); setGallery(1);
  const rect = origin?.querySelector("img")?.getBoundingClientRect();
  window.scrollTo({top:0,behavior:"instant"});
  if(rect && !selected && !reduced) {
   setFlight({product,rect,landed:false}); setTransitioning(true);
   requestAnimationFrame(() => requestAnimationFrame(() => setFlight({product,rect,landed:true})));
   timer.current = setTimeout(() => {setSelected(product); setTransitioning(false); setFlight(null);},1000);
  } else {setSelected(product);setFlight(null);}
  window.history.pushState({},"",`#${product.id}`);
 },[transitioning,selected,reduced]);
 const goHome = useCallback(() => {
  if(timer.current) clearTimeout(timer.current);
  setSelected(null);setTransitioning(false);setFlight(null);setMenu(false);
  window.history.pushState({},"",window.location.pathname);window.scrollTo({top:0,behavior:"instant"});
 },[]);
 useEffect(() => {
  const restore = () => {if(timer.current)clearTimeout(timer.current);setSelected(products.find(p => p.id === window.location.hash.slice(1)) ?? null);setFlight(null);setTransitioning(false);};
  restore();window.addEventListener("popstate",restore);
  return () => {window.removeEventListener("popstate",restore);if(timer.current)clearTimeout(timer.current);};
 },[]);
 useEffect(() => {document.body.style.overflow = !selected ? "hidden" : "";return () => {document.body.style.overflow="";};},[selected]);
 useEffect(() => {
  if(selected) return;
  let raf=0,previous=performance.now(),elapsed=0,lastActive=-1;
  const animate=(now:number) => {
   const dt=Math.min(now-previous,40);previous=now;elapsed+=dt;
   if(automatic&&!hover.current&&!dragging.current&&!transitioning&&elapsed>2400)target.current+=dt*.000085;
   cursor.current+=(target.current-cursor.current)*(reduced?1:1-Math.exp(-dt/125));
   const width=window.innerWidth,mobile=width<700;
   jars.current.forEach((el,i) => {
    if(!el)return;
    const offset=mod(i-cursor.current+products.length/2,products.length)-products.length/2,distance=Math.abs(offset);
    const x=offset*width*(mobile?.62:.29),y=Math.min(distance,2.8)*(mobile?35:47)+Math.sin(offset*1.2)*22,scale=Math.max(.54,1-distance*.17);
    el.style.transform=`translate(-50%,-50%) translate3d(${x}px,${y}px,0) rotate(${offset*13}deg) scale(${scale})`;
    el.style.zIndex=String(10-Math.round(distance));el.style.opacity=String(Math.max(0,Math.min(1,3-distance)));
    el.style.visibility=distance>(mobile?1.6:2.7)?"hidden":"visible";
   });
   // The irregular red form and its lettering are one moving layer.
   const phase=cursor.current*.82;
   backdrop.current?.setAttribute("transform",`translate(${Math.sin(phase)*38} ${(Math.cos(phase)-1)*12}) rotate(${Math.sin(phase*.9)*11} 550 650)`);
   const wave=Math.sin(phase)*34;
   contour.current?.setAttribute("d",`M-120 760 C35 395 178 ${120+wave} 440 ${51-wave*.45} C510 ${22+wave*.4} 529 ${1-wave*.5} 565 ${31+wave*.35} C620 ${38-wave*.4} 670 ${60+wave*.3} 731 ${77-wave*.25} C929 ${136-wave} 1052 430 1230 760Z`);
   const index=mod(Math.round(cursor.current),products.length);if(index!==lastActive){lastActive=index;setActive(index);}
   raf=requestAnimationFrame(animate);
  };
  raf=requestAnimationFrame(animate);return () => cancelAnimationFrame(raf);
 },[selected,automatic,reduced,transitioning]);
 useEffect(() => {
  const el=stage.current;if(!el||selected)return;
  const onWheel=(e:WheelEvent) => {e.preventDefault();if(transitioning)return;setAutomatic(false);target.current+=Math.max(-100,Math.min(100,e.deltaY+e.deltaX))*.0035;};
  el.addEventListener("wheel",onWheel,{passive:false});return () => el.removeEventListener("wheel",onWheel);
 },[selected,transitioning]);
 const step=(direction:number) => {setAutomatic(false);target.current=Math.round(target.current)+direction;};
 const goTo=(id:string) => {setMenu(false);if(!selected){setSelected(products[active]);window.history.pushState({},"",`#${products[active].id}`);}setTimeout(() => document.getElementById(id)?.scrollIntoView({behavior:reduced?"instant":"smooth"}),100);};
 const galleryImages=["pickle-making.jpg","ingredient-art.jpg","serving.jpg"];
 return <main className={selected?"experience detail-mode":"experience carousel-mode"}>
  <svg className="clip-definitions" width="0" height="0" aria-hidden="true"><defs>
   <clipPath id="cut-mango-avakaya" clipPathUnits="objectBoundingBox"><path d="M.304 .061 Q.48 .030 .68 .050 Q.687 .054 .687 .068 L.687 .174 Q.68 .183 .672 .190 L.667 .204 L.667 .23 Q.691 .240 .699 .251 Q.708 .263 .707 .30 L.714 .83 Q.713 .898 .689 .930 Q.676 .950 .590 .952 Q.48 .960 .368 .952 Q.323 .947 .308 .930 Q.289 .903 .288 .830 L.282 .300 Q.280 .269 .295 .250 L.321 .230 L.323 .208 Q.322 .195 .308 .186 L.299 .178 L.301 .083Z"/></clipPath>
   <clipPath id="cut-tomato" clipPathUnits="objectBoundingBox"><path d="M.306 .060 Q.49 .028 .683 .050 Q.69 .054 .69 .068 L.69 .174 Q.687 .184 .678 .190 L.671 .205 L.673 .230 Q.696 .240 .706 .250 Q.714 .264 .713 .300 L.719 .830 Q.719 .896 .697 .930 Q.683 .948 .634 .952 Q.50 .965 .390 .958 Q.332 .950 .309 .930 Q.292 .904 .290 .830 L.284 .300 Q.282 .269 .297 .250 L.324 .230 L.326 .206 Q.325 .193 .312 .187 L.302 .179 L.304 .082Z"/></clipPath>
   <clipPath id="cut-red-chilli" clipPathUnits="objectBoundingBox"><path d="M.311 .060 Q.50 .028 .691 .050 Q.699 .054 .7 .068 L.698 .174 Q.692 .184 .685 .190 L.678 .205 L.682 .230 Q.704 .240 .715 .250 Q.721 .264 .720 .300 L.727 .830 Q.727 .897 .706 .930 Q.690 .948 .648 .952 Q.50 .965 .386 .958 Q.34 .950 .315 .930 Q.296 .904 .296 .830 L.290 .300 Q.287 .268 .298 .250 L.328 .230 L.330 .206 Q.33 .193 .32 .187 L.309 .179 L.309 .082Z"/></clipPath>
   <clipPath id="cut-gongura" clipPathUnits="objectBoundingBox"><path d="M.288 .054 Q.49 .018 .674 .040 Q.681 .044 .682 .060 L.680 .165 L.662 .181 L.654 .208 Q.660 .230 .687 .239 Q.702 .253 .700 .300 L.708 .842 Q.710 .905 .690 .933 Q.668 .953 .497 .958 Q.309 .953 .295 .932 Q.278 .910 .273 .852 L.268 .290 Q.266 .250 .280 .238 L.308 .219 L.310 .191 L.296 .179 L.286 .168Z"/></clipPath>
  </defs></svg>
  <header className="site-header">
   {selected?<button className="small-control back-control" onClick={goHome} aria-label="Back to collection"><ArrowLeft size={15}/><span>BACK</span></button>:<button className="motion-control" onClick={() => setAutomatic(!automatic)} aria-label={automatic?"Pause carousel":"Play carousel"}>{automatic?<Pause size={10} fill="currentColor"/>:<Play size={10} fill="currentColor"/>}</button>}
   <button className="brand" onClick={goHome} aria-label="Priya Foods home"><img src={asset("logo.png")} alt="Priya — The Joy of Good Taste" width="120" height="58"/></button>
   <button className="menu-trigger" onClick={() => setMenu(true)}>MENU <span/></button>
  </header>
  <Sheet open={menu} onOpenChange={setMenu}><SheetContent side="right" className="priya-menu" showCloseButton={false}>
   <div className="menu-top"><img src={asset("logo.png")} alt="Priya" width="106"/><SheetClose className="menu-close" aria-label="Close menu"><X size={21}/></SheetClose></div>
   <SheetTitle className="sr-only">Explore Priya Foods</SheetTitle><SheetDescription className="menu-eyebrow">THE JOY OF GOOD TASTE</SheetDescription>
   <nav className="menu-links" aria-label="Main navigation"><button onClick={goHome}><span>01</span>Our flavours<ArrowUpRight/></button><button onClick={() => goTo("story")}><span>02</span>A taste of home<ArrowUpRight/></button><button onClick={() => goTo("products")}><span>03</span>Discover more<ArrowUpRight/></button><button onClick={() => goTo("contact")}><span>04</span>Get in touch<ArrowUpRight/></button></nav>
   <a className="menu-shop" href="https://priyafoods.com/collections/pickles" target="_blank" rel="noopener noreferrer">Visit the official store <ArrowUpRight/></a><p className="menu-since">Bringing you the joy of good taste since 1980.</p>
  </SheetContent></Sheet>
  {!selected&&<section ref={stage} className={`carousel-stage ${transitioning?"is-leaving":""}`} aria-label="Explore Priya flavours" tabIndex={0}
   onKeyDown={e => {if(e.key==="ArrowRight"){e.preventDefault();step(1);}if(e.key==="ArrowLeft"){e.preventDefault();step(-1);}}}
   onPointerDown={e => {if(transitioning)return;dragging.current={start:e.clientX,offset:target.current,moved:false};setAutomatic(false);}}
   onPointerMove={e => {const d=dragging.current;if(d){if(Math.abs(e.clientX-d.start)>7)d.moved=true;target.current=d.offset-(e.clientX-d.start)/window.innerWidth*(window.innerWidth<700?1.8:3.4);}}}
   onPointerUp={() => {if(dragging.current){if(dragging.current.moved)target.current=Math.round(target.current);setTimeout(() => {dragging.current=null;},0);}}}
   onPointerLeave={() => {hover.current=false;if(dragging.current){target.current=Math.round(target.current);dragging.current=null;}}}>
   <h1 className="sr-only">Priya Foods. The joy of good taste.</h1>
   <div className="carousel-mound" aria-hidden="true"><svg viewBox="0 0 1100 650" preserveAspectRatio="none"><defs><path id="brand-arc" d="M92 616 C182 4 867 -62 1033 616"/></defs><g ref={backdrop}><path ref={contour} className="mound-fill" d="M-120 760 C35 395 178 120 440 51 C510 22 529 1 565 31 C620 38 670 60 731 77 C929 136 1052 430 1230 760Z"/><text><textPath href="#brand-arc" startOffset="50%" textAnchor="middle">THE JOY OF GOOD TASTE</textPath></text></g></svg></div>
   <div className="orbit" aria-label="Product carousel">{products.map((product,i) => <button key={product.id} ref={el => {jars.current[i]=el;}} className={`orbit-product ${product.carton?"is-carton":""}`} aria-label={`Discover ${product.name}`} onMouseEnter={() => {hover.current=true;}} onMouseLeave={() => {hover.current=false;}} onClick={e => {if(!dragging.current?.moved)openProduct(product,e.currentTarget);}}><ProductImage product={product}/><span className="product-tooltip">{product.name}<span>↗</span></span></button>)}</div>
   <div className="carousel-bottom"><button className="carousel-arrow" onClick={() => step(-1)} aria-label="Previous flavour"><ArrowLeft size={20}/></button><div className="explore-prompt"><span className="flavour-name" aria-live="polite">{products[active].name}</span><span>SCROLL OR DRAG TO EXPLORE</span><button onClick={() => openProduct(products[active],jars.current[active]??undefined)}>DISCOVER THIS FLAVOUR <ArrowRight size={11}/></button></div><button className="carousel-arrow" onClick={() => step(1)} aria-label="Next flavour"><ArrowRight size={20}/></button></div>
   <div className="carousel-index" aria-hidden="true">0{active+1}<span>/ 0{products.length}</span></div>
  </section>}
  {flight&&<div className={`flying-product ${flight.landed?"landed":""} ${flight.product.carton?"is-carton":""}`} style={{"--start-top":`${flight.rect.top}px`,"--start-left":`${flight.rect.left}px`,"--start-width":`${flight.rect.width}px`,"--start-height":`${flight.rect.height}px`} as CSSProperties}><ProductImage product={flight.product}/></div>}
  {selected&&<div key={selected.id} className="product-page">
   <ProductScene product={selected} reduced={reduced}/>
   <section id="story" className="product-story"><span className="eyebrow">A LITTLE TASTE OF HOME</span><p>{selected.description}</p><span className="ingredient-note">{selected.note}</span><a className="text-link" href={selected.url} target="_blank" rel="noopener noreferrer">EXPLORE AT PRIYA FOODS <ArrowUpRight/></a></section>
   <section className="editorial-gallery" aria-label="Priya food and ingredients"><div className="gallery-track" style={{transform:`translateX(calc(-${gallery} * (var(--gallery-width) + var(--gallery-gap)) + (100vw - var(--gallery-width))/2))`}}>{galleryImages.map((src,i) => <figure key={`${src}-${i}`} className={i===gallery?"gallery-image current":"gallery-image"}><img src={asset(src)} alt={i===0?"Mango pickle preparation from Priya Foods":i===1?"Priya Beerakaaya pachadi with ridge gourd and a serving bowl":"Priya’s traditional pachadi serving imagery"} loading="lazy"/></figure>)}</div><div className="gallery-controls"><span>FLAVOURS, ROOTED IN TRADITION</span><div><button onClick={() => setGallery(mod(gallery-1,3))} aria-label="Previous image"><ArrowLeft size={17}/></button><span>0{gallery+1} / 03</span><button onClick={() => setGallery(mod(gallery+1,3))} aria-label="Next image"><ArrowRight size={17}/></button></div></div></section>
   <section id="products" className="related-products"><div className="section-heading"><span className="eyebrow">MORE TO LOVE</span><h2>OUR FLAVOURS</h2></div><div className="product-grid">{products.filter(p => p.id!==selected.id).slice(0,4).map((product,index) => <button className="related-product" key={product.id} onClick={() => openProduct(product)}><div className="related-photo"><span className="related-number">0{index+1}</span><div className="related-image"><ProductImage product={product} lazy/></div><span className="related-plus"><ArrowUpRight/></span></div><span className="related-name">{product.name}</span><span className="related-kind">{product.kind}</span></button>)}</div><button className="collection-link" onClick={goHome}>EXPLORE THE COLLECTION <ArrowRight size={15}/></button></section>
   <footer id="contact" className="site-footer"><div className="footer-wordmark" aria-label="Priya Foods"><span>PRIYA</span><em>Foods</em></div><div className="footer-bottom"><div className="footer-brand"><img src={asset("logo.png")} alt="Priya Foods" width="96"/><span>THE JOY OF GOOD TASTE<br/>SINCE 1980</span></div><nav aria-label="Footer navigation"><button onClick={goHome}>Our flavours</button><a href="https://priyafoods.com/pages/about-us" target="_blank" rel="noopener noreferrer">Our story ↗</a><a href="https://priyafoods.com/collections/roti-pachadi" target="_blank" rel="noopener noreferrer">Roti pachadi ↗</a><a href="https://priyafoods.com/collections/pickles" target="_blank" rel="noopener noreferrer">Pickles ↗</a></nav><div className="footer-contact"><span>LET’S TALK</span><a href="mailto:response@priyafoods.com">response@priyafoods.com</a><a href="tel:+914023597777">+91 40 2359 7777</a></div><div className="footer-note"><p>Familiar flavours.<br/>Unforgettable memories.</p><a href="https://priyafoods.com/" target="_blank" rel="noopener noreferrer">VISIT PRIYAFOODS.COM <ArrowUpRight/></a></div></div><div className="footer-small"><span>A creative website concept for Priya Foods</span><button onClick={() => window.scrollTo({top:0,behavior:reduced?"instant":"smooth"})}>BACK TO TOP ↑</button></div></footer>
  </div>}
 </main>;
}
