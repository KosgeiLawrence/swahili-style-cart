import tote from "@/assets/p-tote.jpg";
import jacket from "@/assets/p-jacket.jpg";
import raffia from "@/assets/p-raffia.jpg";
import scarf from "@/assets/p-scarf.jpg";
import cushion from "@/assets/p-cushion.jpg";
import earrings from "@/assets/p-earrings.jpg";
import duffel from "@/assets/p-duffel.jpg";
import dress from "@/assets/p-dress.jpg";

import colUpcycled from "@/assets/col-upcycled.jpg";
import colBags from "@/assets/col-bags.jpg";
import colTextiles from "@/assets/col-textiles.jpg";
import colLimited from "@/assets/col-limited.jpg";

export type Product = {
  slug: string;
  name: string;
  short: string;
  description: string;
  price: number;
  image: string;
  category: string;
  collection: string;
  materials: string[];
  sustainability: string;
  stock: number;
  options?: { label: string; values: string[] };
};

export type Collection = {
  slug: string;
  name: string;
  blurb: string;
  image: string;
};

export const CATEGORIES = [
  "Bags",
  "Clothing",
  "Accessories",
  "Home & Lifestyle",
  "Upcycled Products",
  "Limited Editions",
] as const;

export const collections: Collection[] = [
  {
    slug: "upcycled-fashion",
    name: "Upcycled Fashion",
    blurb: "Garments rebuilt from deadstock denim, offcuts and pre-loved cloth.",
    image: colUpcycled,
  },
  {
    slug: "sustainable-bags",
    name: "Sustainable Bags",
    blurb: "Totes, crossbodies and duffels made from reclaimed canvas and raffia.",
    image: colBags,
  },
  {
    slug: "reimagined-textiles",
    name: "Reimagined Textiles",
    blurb: "Hand-finished cloth, scarves and home pieces with a second life.",
    image: colTextiles,
  },
  {
    slug: "limited-editions",
    name: "Limited Editions",
    blurb: "Small-run studio pieces made once, from what the studio already has.",
    image: colLimited,
  },
];

export const products: Product[] = [
  {
    slug: "reclaimed-textile-tote",
    name: "Reclaimed Textile Tote",
    short: "Heavyweight canvas tote with a hand-stitched textile panel.",
    description:
      "A generous everyday tote cut from reclaimed cotton canvas, finished with a hand-stitched panel of vintage Kenyan cloth. Reinforced base and shoulder-length straps built to carry weight for years.",
    price: 2500,
    image: tote,
    category: "Bags",
    collection: "sustainable-bags",
    materials: ["Reclaimed cotton canvas", "Vintage textile offcuts", "Cotton thread"],
    sustainability:
      "Every panel is cut from textile waste collected from Nairobi tailoring workshops, diverting roughly 0.4kg of fabric from landfill per bag.",
    stock: 14,
  },
  {
    slug: "kitenge-patch-denim-jacket",
    name: "Kitenge Patch Denim Jacket",
    short: "Pre-loved denim rebuilt with kitenge panelling.",
    description:
      "Sourced second-hand, deconstructed and rebuilt in the studio with kitenge panelling across one sleeve. Each jacket is one of one — wash, fade and patch placement will differ.",
    price: 6800,
    image: jacket,
    category: "Clothing",
    collection: "upcycled-fashion",
    materials: ["Pre-loved denim", "Kitenge cotton", "Recycled metal hardware"],
    sustainability:
      "Extending the life of one denim jacket avoids the ~3,700 litres of water needed to produce a new one.",
    stock: 6,
    options: { label: "Size", values: ["S", "M", "L", "XL"] },
  },
  {
    slug: "woven-raffia-crossbody",
    name: "Woven Raffia Crossbody",
    short: "Hand-woven raffia body with a vegetable-tanned strap.",
    description:
      "Woven by hand over three days by artisans on the coast, with an adjustable vegetable-tanned leather strap and a soft cotton lining.",
    price: 4200,
    image: raffia,
    category: "Bags",
    collection: "sustainable-bags",
    materials: ["Hand-woven raffia", "Vegetable-tanned leather", "Organic cotton lining"],
    sustainability:
      "Raffia is a rapidly renewable palm fibre harvested without felling the tree, and the bag is fully biodegradable at end of life.",
    stock: 9,
  },
  {
    slug: "indigo-block-print-scarf",
    name: "Indigo Block Print Scarf",
    short: "Hand block printed cotton in natural indigo.",
    description:
      "A lightweight cotton scarf printed by hand with carved wooden blocks and dyed in small batches with natural indigo. Softens beautifully with wear.",
    price: 1800,
    image: scarf,
    category: "Accessories",
    collection: "reimagined-textiles",
    materials: ["Organic cotton", "Natural indigo dye"],
    sustainability:
      "Dyed with plant-based indigo in a closed-loop vat, so no synthetic dye effluent leaves the studio.",
    stock: 22,
  },
  {
    slug: "offcut-patchwork-cushion",
    name: "Offcut Patchwork Cushion",
    short: "Cushion cover pieced from studio offcuts.",
    description:
      "A 45x45cm cushion cover pieced entirely from fabric offcuts left over from our garment production, with a hidden zip and washable cover.",
    price: 2200,
    image: cushion,
    category: "Home & Lifestyle",
    collection: "reimagined-textiles",
    materials: ["Mixed cotton offcuts", "Recycled polyester zip"],
    sustainability:
      "Made from 100% production waste — nothing new is cut for this piece.",
    stock: 18,
  },
  {
    slug: "recycled-brass-earrings",
    name: "Recycled Brass Sun Earrings",
    short: "Hand-cast brass discs with a brushed finish.",
    description:
      "Cast from recycled brass scrap, filed and brushed by hand, finished on hypoallergenic hooks. Light enough to wear all day.",
    price: 1500,
    image: earrings,
    category: "Accessories",
    collection: "upcycled-fashion",
    materials: ["Recycled brass", "Stainless steel hooks"],
    sustainability:
      "Cast from padlocks, taps and hardware scrap collected from local metal workshops.",
    stock: 30,
  },
  {
    slug: "repurposed-sail-duffel",
    name: "Repurposed Sail Duffel",
    short: "Weekend duffel cut from retired dhow sailcloth.",
    description:
      "A roomy weekender made from retired sailcloth, with a cyan zip pull, internal pocket and reinforced webbing handles.",
    price: 7900,
    image: duffel,
    category: "Bags",
    collection: "limited-editions",
    materials: ["Retired sailcloth", "Recycled webbing", "Metal hardware"],
    sustainability:
      "Sailcloth is near-indestructible but rarely recycled — we rescue it from coastal boatyards before it is burned.",
    stock: 4,
  },
  {
    slug: "hand-embroidered-shirt-dress",
    name: "Hand Embroidered Shirt Dress",
    short: "Organic cotton shirt dress with hand embroidery.",
    description:
      "A relaxed shirt dress in undyed organic cotton with subtle tonal hand embroidery down the placket. Made to order in small runs.",
    price: 5400,
    image: dress,
    category: "Clothing",
    collection: "upcycled-fashion",
    materials: ["Undyed organic cotton", "Cotton embroidery thread", "Corozo buttons"],
    sustainability:
      "Left undyed to eliminate dye water entirely, and cut using a zero-waste pattern that uses 96% of the fabric roll.",
    stock: 7,
    options: { label: "Size", values: ["S", "M", "L", "XL"] },
  },
];

export const formatKES = (n: number) =>
  `KES ${n.toLocaleString("en-KE", { maximumFractionDigits: 0 })}`;

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const collectionName = (slug: string) =>
  collections.find((c) => c.slug === slug)?.name ?? slug;
