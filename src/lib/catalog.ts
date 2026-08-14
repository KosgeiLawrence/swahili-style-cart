import { products, type Product } from "./data";

const CATALOG_KEY = "sdl.catalog";

/** Read the locally managed catalog, falling back to the shipped defaults. */
export const loadCatalog = (): Product[] => {
  if (typeof window === "undefined") return [...products];
  try {
    const raw = window.localStorage.getItem(CATALOG_KEY);
    if (!raw) return [...products];
    const parsed = JSON.parse(raw) as Product[];
    if (!Array.isArray(parsed) || parsed.length === 0) return [...products];
    return parsed;
  } catch {
    return [...products];
  }
};

export const persistCatalog = (list: Product[]) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CATALOG_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable */
  }
};

export const clearCatalog = () => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CATALOG_KEY);
  } catch {
    /* storage unavailable */
  }
};

/** Keep the module-level array in sync so route loaders resolve edited products. */
export const syncModuleCatalog = (list: Product[]) => {
  products.splice(0, products.length, ...list);
};

export const emptyProduct = (): Product => ({
  slug: "",
  name: "",
  short: "",
  description: "",
  price: 0,
  image: "",
  category: "Bags",
  collection: "upcycled-fashion",
  materials: [],
  sustainability: "",
  stock: 1,
});
