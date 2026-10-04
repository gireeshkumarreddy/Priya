import type { Product } from "./products";

export const asset = (name: string) => `/assets/${name}`;

export function ProductImage({product, lazy = false}: {product: Product; lazy?: boolean}) { return <img className={product.carton ? "carton-image" : "jar-image"} style={product.carton ? undefined : {clipPath:`url(#cut-${product.clipId??product.id})`}} src={asset(product.image)} alt={`Priya ${product.name} packaging`} draggable="false" loading={lazy ? "lazy" : "eager"}/>; }
export function ArrowUpRight() { return <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 15 15 5M5 5h10v10" stroke="currentColor" strokeWidth="1.2"/></svg>; }
