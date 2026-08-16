import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products, type Product } from "./data";
import { clearCatalog, loadCatalog, persistCatalog, syncModuleCatalog } from "./catalog";
import { type Collection } from "./data";
import {
  clearCollections,
  clearSite,
  defaultSite,
  loadCollections,
  loadSite,
  persistCollections,
  persistSite,
  syncModuleCollections,
  type SiteContent,
} from "./site";

/* ---------------------------------- types --------------------------------- */

export type CartItem = {
  slug: string;
  qty: number;
  option?: string | undefined;
};

export type OrderStatus =
  | "New Order"
  | "Contacted"
  | "Confirmed"
  | "Processing"
  | "Ready for Delivery"
  | "Delivered"
  | "Cancelled";

export type Order = {
  reference: string;
  createdAt: string;
  status: OrderStatus;
  customer: {
    name: string;
    email: string;
    phone: string;
    location: string;
    county: string;
    notes?: string | undefined;
  };
  items: { slug: string; name: string; qty: number; price: number; option?: string | undefined }[];
  total: number;
};

export type Account = {
  name: string;
  email: string;
  phone?: string | undefined;
  isAdmin?: boolean | undefined;
};

/* -------------------------------- utilities ------------------------------- */

const read = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: unknown) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — cart simply won't persist */
  }
};

const CART_KEY = "sdl.cart";
const USER_KEY = "sdl.user";
const ORDERS_KEY = "sdl.orders";
const SEQ_KEY = "sdl.seq";
const ACCOUNTS_KEY = "sdl.accounts";

type AccountRecord = { password: string; account: Account };

/* Studio admin seeded on this device. Local-only convenience login: it unlocks
   the listing manager in this browser and protects nothing on a server. */
const ADMIN_EMAIL = "kplowren@yahoo.com";
const ADMIN_PASSWORD = "Crimsons2023.";

export const isAdminEmail = (email: string) => email.trim().toLowerCase() === ADMIN_EMAIL;


const seedAdmin = () => {
  const accounts = read<Record<string, AccountRecord>>(ACCOUNTS_KEY, {});
  const current = accounts[ADMIN_EMAIL];
  accounts[ADMIN_EMAIL] = {
    password: ADMIN_PASSWORD,
    account: {
      name: current?.account.name ?? "Studio Admin",
      email: ADMIN_EMAIL,
      phone: current?.account.phone,
      isAdmin: true,
    },
  };
  write(ACCOUNTS_KEY, accounts);
};

export const makeReference = () => {
  const seq = read<number>(SEQ_KEY, 123) + 1;
  write(SEQ_KEY, seq);
  return `SDL-${new Date().getFullYear()}-${String(seq).padStart(5, "0")}`;
};

/* --------------------------------- context -------------------------------- */

type StoreValue = {
  ready: boolean;
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  addToCart: (slug: string, qty?: number, option?: string) => void;
  setQty: (slug: string, qty: number, option?: string) => void;
  removeFromCart: (slug: string, option?: string) => void;
  clearCart: () => void;
  user: Account | null;
  register: (a: Account & { password: string }) => { ok: boolean; error?: string };
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  updateProfile: (a: Partial<Account>) => void;
  orders: Order[];
  catalog: Product[];
  siteCollections: Collection[];
  saveCollection: (c: Collection, originalSlug?: string) => { ok: boolean; error?: string };
  deleteCollection: (slug: string) => void;
  resetCollections: () => void;
  site: SiteContent;
  saveSite: (site: SiteContent) => void;
  resetSite: () => void;
  saveProduct: (product: Product, originalSlug?: string) => { ok: boolean; error?: string };
  deleteProduct: (slug: string) => void;
  resetCatalog: () => void;
  placeOrder: (customer: Order["customer"]) => Order;
};

const StoreContext = createContext<StoreValue | null>(null);

const sameLine = (a: CartItem, slug: string, option?: string) =>
  a.slug === slug && (a.option ?? "") === (option ?? "");

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<Account | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [catalog, setCatalog] = useState<Product[]>(products);
  const [siteCollections, setSiteCollections] = useState<Collection[]>(loadCollections);
  const [site, setSite] = useState<SiteContent>(defaultSite);

  useEffect(() => {
    try {
      setCart(read<CartItem[]>(CART_KEY, []));
      const storedUser = read<Account | null>(USER_KEY, null);
      /* Older sessions may predate the admin flag — restore it for the studio account. */
      setUser(
        storedUser
          ? {
              ...storedUser,
              email: storedUser.email?.trim().toLowerCase() ?? "",
              isAdmin:
                storedUser.isAdmin ||
                storedUser.email?.trim().toLowerCase() === ADMIN_EMAIL,
            }
          : null,
      );
      setOrders(read<Order[]>(ORDERS_KEY, []));
      seedAdmin();
      const stored = loadCatalog();
      syncModuleCatalog(stored);
      setCatalog(stored);
      const storedCollections = loadCollections();
      syncModuleCollections(storedCollections);
      setSiteCollections(storedCollections);
      setSite(loadSite());
    } catch {
      /* corrupt local data — fall back to shipped defaults rather than hanging */
    } finally {
      setReady(true);
    }
  }, []);


  useEffect(() => {
    if (ready) write(CART_KEY, cart);
  }, [cart, ready]);
  useEffect(() => {
    if (ready) write(ORDERS_KEY, orders);
  }, [orders, ready]);
  useEffect(() => {
    if (ready) write(USER_KEY, user);
  }, [user, ready]);

  const addToCart = useCallback((slug: string, qty = 1, option?: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => sameLine(i, slug, option));
      if (existing) {
        return prev.map((i) =>
          sameLine(i, slug, option) ? { ...i, qty: i.qty + qty } : i,
        );
      }
      return [...prev, { slug, qty, option }];
    });
  }, []);

  const setQty = useCallback((slug: string, qty: number, option?: string) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((i) => !sameLine(i, slug, option))
        : prev.map((i) => (sameLine(i, slug, option) ? { ...i, qty } : i)),
    );
  }, []);

  const removeFromCart = useCallback((slug: string, option?: string) => {
    setCart((prev) => prev.filter((i) => !sameLine(i, slug, option)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const commitCatalog = useCallback((list: Product[]) => {
    persistCatalog(list);
    syncModuleCatalog(list);
    setCatalog(list);
  }, []);

  const saveProduct: StoreValue["saveProduct"] = useCallback(
    (product, originalSlug) => {
      const slug = product.slug.trim().toLowerCase();
      if (!slug || !product.name.trim()) return { ok: false, error: "Name and slug are required." };
      const list = loadCatalog();
      const index = list.findIndex((p) => p.slug === (originalSlug ?? slug));
      if (list.some((p, i) => p.slug === slug && i !== index))
        return { ok: false, error: "Another product already uses that slug." };
      const next: Product = { ...product, slug };
      if (index >= 0) list[index] = next;
      else list.unshift(next);
      commitCatalog([...list]);
      return { ok: true };
    },
    [commitCatalog],
  );

  const deleteProduct = useCallback(
    (slug: string) => commitCatalog(loadCatalog().filter((p) => p.slug !== slug)),
    [commitCatalog],
  );

  const commitCollections = useCallback((list: Collection[]) => {
    persistCollections(list);
    syncModuleCollections(list);
    setSiteCollections(list);
  }, []);

  const saveCollection: StoreValue["saveCollection"] = useCallback(
    (collection, originalSlug) => {
      const slug = collection.slug.trim().toLowerCase();
      if (!slug || !collection.name.trim())
        return { ok: false, error: "Name and slug are required." };
      const list = loadCollections();
      const index = list.findIndex((c) => c.slug === (originalSlug ?? slug));
      if (list.some((c, i) => c.slug === slug && i !== index))
        return { ok: false, error: "Another collection already uses that slug." };
      const next: Collection = { ...collection, slug };
      if (index >= 0) list[index] = next;
      else list.push(next);
      commitCollections([...list]);
      return { ok: true };
    },
    [commitCollections],
  );

  const deleteCollection = useCallback(
    (slug: string) => commitCollections(loadCollections().filter((c) => c.slug !== slug)),
    [commitCollections],
  );

  const resetCollections = useCallback(() => {
    clearCollections();
    const defaults = loadCollections();
    syncModuleCollections(defaults);
    setSiteCollections(defaults);
  }, []);

  const saveSite = useCallback((next: SiteContent) => {
    persistSite(next);
    setSite(next);
  }, []);

  const resetSite = useCallback(() => {
    clearSite();
    setSite(loadSite());
  }, []);

  const resetCatalog = useCallback(() => {
    clearCatalog();
    const defaults = loadCatalog();
    syncModuleCatalog(defaults);
    setCatalog(defaults);
  }, []);

  const priceOf = (slug: string) => products.find((p) => p.slug === slug)?.price ?? 0;

  const subtotal = useMemo(
    () => cart.reduce((sum, i) => sum + priceOf(i.slug) * i.qty, 0),
    [cart],
  );
  const cartCount = useMemo(() => cart.reduce((n, i) => n + i.qty, 0), [cart]);

  /* Accounts are stored locally on this device only — no passwords leave the
     browser and nothing sensitive is transmitted. */
  const register: StoreValue["register"] = useCallback((a) => {
    const existing = read<Record<string, AccountRecord>>(ACCOUNTS_KEY, {});
    const key = a.email.trim().toLowerCase();
    if (!key || !a.password) return { ok: false, error: "Email and password required." };
    if (existing[key]) return { ok: false, error: "An account with that email exists." };
    const account: Account = { name: a.name, email: key, phone: a.phone };
    existing[key] = { password: a.password, account };
    write(ACCOUNTS_KEY, existing);
    setUser(account);
    return { ok: true };
  }, []);

  const login: StoreValue["login"] = useCallback((email, password) => {
    const key = email.trim().toLowerCase();
    const pass = password.trim();

    /* Studio admin always works, even if the local account store is missing or stale. */
    if (key === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
      seedAdmin();
      const seeded = read<Record<string, AccountRecord>>(ACCOUNTS_KEY, {})[ADMIN_EMAIL];
      setUser(seeded?.account ?? { name: "Studio Admin", email: ADMIN_EMAIL, isAdmin: true });
      return { ok: true };
    }

    const existing = read<Record<string, AccountRecord>>(ACCOUNTS_KEY, {});
    const rec = existing[key];
    if (!rec || rec.password !== password)
      return { ok: false, error: "Incorrect email or password." };
    setUser({ ...rec.account, email: key });
    return { ok: true };
  }, []);


  const logout = useCallback(() => setUser(null), []);

  const updateProfile = useCallback((patch: Partial<Account>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      const existing = read<Record<string, AccountRecord>>(ACCOUNTS_KEY, {});
      const rec = existing[prev.email];
      if (rec) {
        rec.account = next;
        write(ACCOUNTS_KEY, existing);
      }
      return next;
    });
  }, []);

  const placeOrder = useCallback(
    (customer: Order["customer"]) => {
      const items = cart.map((i) => {
        const p = products.find((x) => x.slug === i.slug) as Product;
        return {
          slug: i.slug,
          name: p?.name ?? i.slug,
          qty: i.qty,
          price: p?.price ?? 0,
          option: i.option,
        };
      });
      const order: Order = {
        reference: makeReference(),
        createdAt: new Date().toISOString(),
        status: "New Order",
        customer,
        items,
        total: items.reduce((s, i) => s + i.price * i.qty, 0),
      };
      setOrders((prev) => [order, ...prev]);
      setCart([]);
      return order;
    },
    [cart],
  );

  const value: StoreValue = {
    ready,
    cart,
    cartCount,
    subtotal,
    addToCart,
    setQty,
    removeFromCart,
    clearCart,
    user,
    register,
    login,
    logout,
    updateProfile,
    orders,
    catalog,
    saveProduct,
    deleteProduct,
    resetCatalog,
    siteCollections,
    saveCollection,
    deleteCollection,
    resetCollections,
    site,
    saveSite,
    resetSite,
    placeOrder,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
