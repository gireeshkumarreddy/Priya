# Priya Foods — reference recreation

A responsive React/Vinext concept based on the supplied 11.72-second desktop recording. All visible products, logos and food imagery come from priyafoods.com. No shopping backend or invented brand claims.

## Reference mapping

| Reference time | Observed scene | Implementation |
| --- | --- | --- |
| 0–1.7s | Centred logo, cream canvas, curved red mound, floating jars | Official Priya logo, cream canvas, red curved background, five authentic glass-jar products |
| 1.7–6.7s | Products travel along an arc, changing scale and tilt | Continuous orbit driven by scroll, drag, swipe, arrow keys and controls; pausable motion |
| 6.7–7.8s | Selected product travels down as the scene clears | One-second positional transition into the selected product hero |
| 7.8–9.2s | Two large serif title lines reveal | Masked Bodoni Moda reveals, original product photography |
| 9.2–10s | Product travels and tilts on scroll, centred story | Pinned product arrival, fixed-axis 360° scroll turn, then verified product content |
| ~10s | Three-image editorial gallery | Official food preparation and pachadi imagery with adjacent panels |
| ~10.5s | Four related products | Four interactive product columns |
| 10.9–11.7s | Oversized red footer | Priya typography, logo, official contact details and store links |

The recording does not reveal an open menu or mobile layouts; those use the same design language and section order. The carousel contains five glass jars only: Mango Avakaya, Tomato, Gongura, Red Chilli, and Lime Ginger. Its red form and curved lettering share the carousel motion clock. Selected-product rotation uses a 2×-resolution photo renderer with positively oriented label samples; the cap and glass retain the sharp original photo. Four products use verified rear-label images. Mango has no verified rear image, so its turn stays within the available front view. Exact full-angle reconstruction would require complete multi-angle photography or a textured 3D model. No rear label is fabricated. The restored carousel controls are retained. The monitor bezel and social-media overlay in the recording are excluded.

## Content and assets

Official research sources: https://priyafoods.com/ and /pages/about-us; /collections/pickles/products/mango-avakaya-pickle; /collections/pickles/products/tomato-pickle-with-garlic; /collections/pickles/products/red-chilli-pickle; /collections/roti-pachadi/products/beerakaaya-chutney-100g; /collections/roti-pachadi/products/vankaaya-chutney-100g; /collections/roti-pachadi/products/dosakaaya-chutney-100g.

Jost is the official store's interface typeface. Bodoni Moda adapts the reference's high-contrast display serif. The official logo is unchanged. The reference's deeper red and warm orange are retained as adaptations of the brand's red, gold and cream palette.

The three-image gallery uses the official homepage's pickle_mixing_frame.jpg plus the Beerakaaya product page's food and heritage photography. Product links open the exact official store pages. No price or stock claims are made.

## Interaction and accessibility

- Wheel, drag, touch swipe, keyboard arrows, and explicit previous/next controls.
- Product selection, related-product switching, hash deep links and browser back.
- Accessible Radix menu, keyboard focus styles, meaningful alt text.
- Reduced-motion preference respected; visible pause/play control.
- Responsive 390px layout verified using a temporary, removed viewport harness.

## Development

The project uses React 19, TypeScript, Vinext and native requestAnimationFrame/Web CSS motion, with no external runtime services.

Requires Node.js 22.13+ and pnpm 11.25.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open http://localhost:5173. To build and serve the production bundle:

```sh
pnpm build
pnpm start
```

All product photos, fonts, logos, styles, and animation source are included in this repository. Dependencies and generated build caches are installed or created locally. The existing Sites/Cloudflare configuration is included.

Rear-image sources: TomatoWG300gside2.jpg, RedChilliWG300gside2.jpg, beerakayaback.png, vankayaback.png, dosakayaback.png from the respective official Priya product galleries.

Additional official product sources: https://priyafoods.com/products/gongura-pickle-with-garlic and https://priyafoods.com/products/lime-ginger-pickle. Photos: GonguraPickle300gWG_71382e49-5bd1-45a3-a61c-72eaeed58d1b.jpg, Gongura_Pickle_300g_WG_side2.jpg, LimeGinger300gWOG_Exotic.jpg, LimeGinger300gWOG_Exoticside2.jpg from their product galleries.
