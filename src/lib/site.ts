import { collections as defaultCollections, type Collection } from "./data";

/* ---------------------------- editable site copy --------------------------- */

export type MenuItem = { label: string; to: string };

export type SiteContent = {
  menu: MenuItem[];
  ctaLabel: string;
  ctaTo: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryLabel: string;
  heroSecondaryLabel: string;
  heroImage: string;
  heroCardTitle: string;
  heroCardText: string;
  collectionsEyebrow: string;
  collectionsTitle: string;
  featuredEyebrow: string;
  featuredTitle: string;
  impact: { stat: string; label: string }[];
  philosophyEyebrow: string;
  philosophyTitle: string;
  philosophyBody1: string;
  philosophyBody2: string;
  closingTitle: string;
  closingText: string;
  closingButton: string;
};

export const NAV_TARGETS = [
  "/",
  "/shop",
  "/collections",
  "/about",
  "/contact",
  "/account",
  "/cart",
] as const;

export const defaultSite: SiteContent = {
  menu: [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/shop" },
    { label: "Collections", to: "/collections" },
    { label: "About", to: "/about" },
    { label: "My Account", to: "/account" },
  ],
  ctaLabel: "Explore Collection",
  ctaTo: "/collections",
  heroEyebrow: "Nairobi · Circular design studio",
  heroTitle: "Sustainable Fashion, Designed With Purpose.",
  heroSubtitle:
    "Discover thoughtfully designed fashion and lifestyle pieces created through creativity, circularity and responsible design.",
  heroPrimaryLabel: "Shop Collection",
  heroSecondaryLabel: "Explore Our Story",
  heroImage: "",
  heroCardTitle: "Reworked Patchwork Shirt Jacket",
  heroCardText: "One of one, cut from reclaimed indigo cloth.",
  collectionsEyebrow: "Collections",
  collectionsTitle: "Made from what already exists.",
  featuredEyebrow: "Featured",
  featuredTitle: "This season in the studio.",
  impact: [
    { stat: "3.2 tonnes", label: "Textile waste diverted from landfill" },
    { stat: "40+", label: "Designers and makers in the studio network" },
    { stat: "92%", label: "Of materials reclaimed, natural or recycled" },
  ],
  philosophyEyebrow: "Our philosophy",
  philosophyTitle: "Fashion That Gives Materials Another Life.",
  philosophyBody1:
    "Swahili Design Lab works with sustainable materials, creative reuse, responsible production and innovative design. Every piece begins with something that already exists — deadstock cloth, retired sailcloth, pre-loved denim, workshop offcuts.",
  philosophyBody2:
    "Our designers rebuild those materials into pieces made to be kept, repaired and worn for years. Production happens in small runs, in Nairobi, with makers paid fairly for skilled hand work.",
  closingTitle: "Wear the Change.",
  closingText:
    "Explore our collection of sustainable designs and support a new generation of responsible fashion.",
  closingButton: "Shop Sustainable Fashion",
};

const SITE_KEY = "sdl.site";
const COLLECTIONS_KEY = "sdl.collections";

const readKey = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeKey = (key: string, value: unknown) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
};

const removeKey = (key: string) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* storage unavailable */
  }
};

/** Stored copy merged over the defaults so new fields always resolve. */
export const loadSite = (): SiteContent => {
  const stored = readKey<Partial<SiteContent>>(SITE_KEY, {});
  return {
    ...defaultSite,
    ...stored,
    menu: stored.menu?.length ? stored.menu : defaultSite.menu,
    impact: stored.impact?.length ? stored.impact : defaultSite.impact,
  };
};

export const persistSite = (site: SiteContent) => writeKey(SITE_KEY, site);
export const clearSite = () => removeKey(SITE_KEY);

/* ------------------------------- collections ------------------------------- */

export const loadCollections = (): Collection[] => {
  const stored = readKey<Collection[] | null>(COLLECTIONS_KEY, null);
  if (!Array.isArray(stored) || stored.length === 0) return [...defaultCollections];
  return stored;
};

export const persistCollections = (list: Collection[]) => writeKey(COLLECTIONS_KEY, list);
export const clearCollections = () => removeKey(COLLECTIONS_KEY);

/** Keep the module-level array in sync so helpers like collectionName resolve. */
export const syncModuleCollections = (list: Collection[]) => {
  defaultCollections.splice(0, defaultCollections.length, ...list);
};

export const emptyCollection = (): Collection => ({
  slug: "",
  name: "",
  blurb: "",
  image: "",
});
