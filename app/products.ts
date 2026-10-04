export type Sprite = "gongura-leaf" | "curry-leaf" | "red-chilli" | "green-chilli" | "chilli-flake" | "garlic" | "mustard" | "lime" | "ginger" | "tomato" | "tomato-slice" | "mango" | "tamarind";
export type Ingredient = { name: string; share?: string; detail: string; sprite: Sprite };
export type Details = {
 ingredients: Ingredient[];
 highlights: string[];
 specs: { label: string; value: string }[];
 heat: number;
 // How many of each floating ingredient surround the jar while it turns.
 scatter: Partial<Record<Sprite, number>>;
};
export type Product = { id: string; name: string; lines: string[]; kind: string; image: string; rearImage?: string; rearLeft?: number; rearRight?: number; clipId?: string; bodyCenter?: number; bodyRadius?: number; labelTop?: number; labelBottom?: number; description: string; note: string; url: string; carton?: boolean; details: Details };

// Ingredient shares and garlic notes are transcribed from the rear-label photography in /public/assets.
const storage = { label: "Storage", value: "Cool, dry place · dry, clean spoon" };
export const products: Product[] = [
 { id: "mango-avakaya", name: "Mango Avakaya", lines: ["MANGO", "AVAKAYA"], kind: "Pickle", image: "pickle-mango.jpg", description: "The unmistakable taste of mango avakaya. Mango pieces, mustard and red chillies come together in this spicy, tangy favourite — a familiar companion to hot rice and ghee.", note: "Mango · Mustard · Red chillies", url: "https://priyafoods.com/collections/pickles/products/mango-avakaya-pickle", details: {
  ingredients: [
   { name: "Raw mango", detail: "Firm, sour mango cut with its skin on, so every piece keeps its bite.", sprite: "mango" },
   { name: "Mustard", detail: "Ground mustard gives avakaya its sharp, nose-tingling kick.", sprite: "mustard" },
   { name: "Red chillies", detail: "Chilli powder for colour and the slow, building heat.", sprite: "chilli-flake" },
   { name: "Garlic", detail: "Whole cloves that soak up the masala over time.", sprite: "garlic" },
  ],
  highlights: ["The classic Andhra summer pickle", "Bold mustard and chilli masala", "Made to be mixed with hot rice and ghee"],
  specs: [{ label: "Taste", value: "Spicy · tangy · pungent" }, { label: "Best with", value: "Hot rice & ghee, curd rice" }, storage],
  heat: 4,
  scatter: { mango: 9, mustard: 7, "chilli-flake": 12, "red-chilli": 3, garlic: 3 },
 } },
 { id: "tomato", name: "Tomato Pickle", lines: ["TOMATO", "PICKLE"], kind: "Pickle", image: "pickle-tomato.jpg", rearImage: "tomato-back.jpg", rearLeft: .29, rearRight: .66, description: "Tomato, garlic and red chillies, brought together with mustard and fenugreek. A tangy, spicy pickle to bring the familiar flavours of home to your everyday meal.", note: "Tomato · Garlic · Red chillies", url: "https://priyafoods.com/collections/pickles/products/tomato-pickle-with-garlic", details: {
  ingredients: [
   { name: "Tomato", share: "47%", detail: "Nearly half the jar is ripe tomato, cooked down until rich and tangy.", sprite: "tomato" },
   { name: "Garlic", share: "5%", detail: "Garlic cloves add a mellow, savoury warmth.", sprite: "garlic" },
   { name: "Chilli powder", detail: "Red chilli powder and dry chillies for colour and heat.", sprite: "chilli-flake" },
   { name: "Tempering", detail: "Mustard seeds, black gram and Bengal gram splits with curry leaves.", sprite: "curry-leaf" },
  ],
  highlights: ["47% tomato in every jar", "Made with rice bran oil", "No added sugar in the ingredients"],
  specs: [{ label: "Taste", value: "Tangy · savoury · medium heat" }, { label: "Best with", value: "Dosa, idli, rice, roti" }, storage],
  heat: 3,
  scatter: { tomato: 5, "tomato-slice": 5, garlic: 4, "curry-leaf": 4, "red-chilli": 2, "chilli-flake": 9, mustard: 4 },
 } },
 { id: "gongura", name: "Gongura Pickle", lines: ["GONGURA", "PICKLE"], kind: "Pickle", image: "pickle-gongura.jpg", rearImage: "gongura-back.jpg", rearLeft: .322, rearRight: .7, bodyCenter: .486, bodyRadius: .218, labelTop: .306, labelBottom: .824, description: "Roselle leaves, spices and dry chillies come together in this Telugu favourite. Gongura brings its distinctive tang to rice, roti, dosa and everyday meals.", note: "Gongura leaves · Tamarind · Mustard seeds", url: "https://priyafoods.com/products/gongura-pickle-with-garlic", details: {
  ingredients: [
   { name: "Gongura leaves", detail: "Roselle leaves — naturally sour, the signature of Andhra cooking.", sprite: "gongura-leaf" },
   { name: "Dry chillies", detail: "Roasted red chillies ground into the leaves for depth and heat.", sprite: "red-chilli" },
   { name: "Garlic", detail: "Cloves tempered in oil, mellow against the leafy tang.", sprite: "garlic" },
   { name: "Mustard seeds", detail: "Crackled in hot oil to finish the tempering.", sprite: "mustard" },
  ],
  highlights: ["The pride of Andhra kitchens", "0 g added sugar, 0 g trans fat", "60 servings in a 300 g jar"],
  specs: [{ label: "Net quantity", value: "300 g" }, { label: "Per teaspoon", value: "14 kcal (5 g)" }, storage],
  heat: 3,
  scatter: { "gongura-leaf": 14, "red-chilli": 3, garlic: 3, mustard: 5, "chilli-flake": 5 },
 } },
 { id: "red-chilli", name: "Red Chilli Pickle", lines: ["RED CHILLI", "PICKLE"], kind: "Pickle", image: "pickle-chilli.jpg", rearImage: "chilli-back.jpg", rearLeft: .29, rearRight: .66, description: "Bold red chillies meet the tang of tamarind and the warmth of garlic. A fiery pickle, seasoned with mustard and spices, for those who like a little more heat with their meal.", note: "Red chillies · Tamarind · Garlic", url: "https://priyafoods.com/collections/pickles/products/red-chilli-pickle", details: {
  ingredients: [
   { name: "Red chillies", share: "31%", detail: "Whole red chillies make up almost a third of the jar.", sprite: "red-chilli" },
   { name: "Tamarind", detail: "Tamarind paste balances the fire with a deep sourness.", sprite: "tamarind" },
   { name: "Garlic", share: "5%", detail: "Garlic for a rounded, savoury finish.", sprite: "garlic" },
   { name: "Tempering", detail: "Mustard seeds, gram splits, dry chillies and curry leaves.", sprite: "curry-leaf" },
  ],
  highlights: ["31% red chillies — for heat lovers", "Made with rice bran oil", "No added sugar in the ingredients"],
  specs: [{ label: "Taste", value: "Fiery · sour · garlicky" }, { label: "Best with", value: "Curd rice, pesarattu, roti" }, storage],
  heat: 5,
  scatter: { "red-chilli": 9, "chilli-flake": 24, tamarind: 3, garlic: 3, "curry-leaf": 3, mustard: 3 },
 } },
 { id: "lime-ginger", name: "Lime Ginger Pickle", lines: ["LIME GINGER", "PICKLE"], kind: "Pickle", image: "pickle-lime-ginger.jpg", rearImage: "lime-ginger-back.jpg", rearLeft: .29, rearRight: .66, clipId: "tomato", description: "Lime pieces and ginger bring sour, sweet and tangy flavours together with aromatic spices. A lively accompaniment to idli, dosa, rice or roti.", note: "Lime · Ginger · Mixed spices", url: "https://priyafoods.com/products/lime-ginger-pickle", details: {
  ingredients: [
   { name: "Lime", share: "44%", detail: "Lime pieces and lime juice, matured until the rind turns tender.", sprite: "lime" },
   { name: "Ginger", share: "21%", detail: "Fresh ginger for a bright, warming zing.", sprite: "ginger" },
   { name: "Chilli powder", detail: "Just enough chilli to lift the citrus.", sprite: "chilli-flake" },
   { name: "Mixed spices", detail: "A gentle spice blend that keeps the lime in front.", sprite: "mustard" },
  ],
  highlights: ["Made without garlic", "44% lime and 21% ginger", "No added oil or sugar in the ingredients"],
  specs: [{ label: "Taste", value: "Sour · zesty · gently spiced" }, { label: "Best with", value: "Idli, dosa, curd rice" }, storage],
  heat: 2,
  scatter: { lime: 9, ginger: 6, "chilli-flake": 7, "green-chilli": 3, mustard: 3 },
 } },
];
