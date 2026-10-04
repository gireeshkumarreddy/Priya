import type { Product } from "./products";

const TAU=Math.PI*2;

/** Correctly oriented photo sampling: every visible face reads left to right. */
export function labelSample(position:number,angle:number) {
 const surface=Math.asin(Math.max(-.99999,Math.min(.99999,position)));
 const local=surface-angle;
 const rear=Math.cos(local)<0;
 const face=Math.atan2(Math.sin(local-(rear?Math.PI:0)),Math.cos(local-(rear?Math.PI:0)));
 // Edge views in a front photograph contain too few pixels to stretch across
 // the middle of the jar. An angular mapping at quarter turns prevents that
 // zero-derivative smear, while frontal views retain the original photo scale.
 const quarter=Math.sin(angle)**2;
 const offset=Math.sin(face)*(1-quarter)+(face/(Math.PI/2))*quarter;
 const derivative=(Math.cos(face)*(1-quarter)+(2/Math.PI)*quarter)/Math.sqrt(Math.max(.0001,1-position*position));
 return {rear,offset,derivative};
}

export function createPhotoTurn(canvas:HTMLCanvasElement,product:Product,onReady:(render:(angle:number)=>void)=>void) {
 const ctx=canvas.getContext("2d",{alpha:true});if(!ctx)return()=>{};
 let cancelled=false,lastAngle=Number.NaN,lastWidth=0,lastHeight=0;
 const load=(src:string)=>new Promise<HTMLImageElement>((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=`/assets/${src}`;});
 Promise.all([load(product.image),load(product.rearImage??product.image)]).then(([front,back])=>{
  if(cancelled)return;
  const center=product.bodyCenter??(product.id==="red-chilli"?.508:product.id==="tomato"?.502:.498);
  const radius=product.bodyRadius??.214;
  const top=product.labelTop??.324,bottom=product.labelBottom??.82;
  const render=(requestedAngle:number)=>{
   const w=canvas.width,h=canvas.height;
   // A front-only photograph cannot honestly show an unseen back label.
   // Keep that product within its photographed face instead of stretching pixels.
   const angle=product.rearImage?requestedAngle:Math.sin(requestedAngle)*.55;
   if(Math.abs(angle-lastAngle)<.0002&&w===lastWidth&&h===lastHeight)return;
   lastAngle=angle;lastWidth=w;lastHeight=h;
   ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high";
   ctx.clearRect(0,0,w,h);
   // Glass, shoulder and cap stay photographic and sharp; only the cylindrical
   // label surface is reprojected. No mirrored CSS backfaces or striped body.
   ctx.drawImage(front,0,0,w,h);
   const normalized=((angle%TAU)+TAU)%TAU;
   const frontDistance=Math.min(normalized,TAU-normalized);
   if(frontDistance>.0002){
    const left=Math.floor((center-radius)*w),right=Math.ceil((center+radius)*w);
    for(let x=left;x<right;x++){
     const position=Math.max(-.9999,Math.min(.9999,((x+.5)/w-center)/radius));
     const sample=labelSample(position,angle);
     if(!product.rearImage&&sample.rear){sample.offset=Math.sign(Math.asin(position)-angle)*.99;sample.derivative=0;sample.rear=false;}
     const photo=sample.rear&&product.rearImage?back:front;
     const rearLeft=product.rearLeft??center-radius,rearRight=product.rearRight??center+radius;
     const photoCenter=sample.rear?(rearLeft+rearRight)/2:center;
     const photoRadius=sample.rear?(rearRight-rearLeft)/2:radius;
     const sx=photoCenter+photoRadius*sample.offset;
     const sampleWidth=Math.min(24,Math.max(.5,sample.derivative/w*photo.width*photoRadius/radius));
     const safeX=Math.max((photoCenter-photoRadius+.002)*photo.width,Math.min((photoCenter+photoRadius-.002)*photo.width-sampleWidth,sx*photo.width-sampleWidth/2));
     ctx.drawImage(photo,safeX,top*photo.height,sampleWidth,(bottom-top)*photo.height,x,top*h,1,(bottom-top)*h);
    }
   }
   canvas.dataset.angle=String(Math.round(angle*180/Math.PI));
   canvas.dataset.renderStatus="sharp-photo-ready";
  };
  onReady(render);
 }).catch(()=>{canvas.dataset.renderStatus="asset-error";});
 return()=>{cancelled=true;};
}
