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

/* ---------------------------------- types --------------------------------- */

export type CartItem = {
  slug: string;
  qty: number;
  option?: string;
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
    notes?: string;
  };
  items: { slug: string; name: string; qty: number; price: number; option?: string }[];
  total: number;
};

export type Account = {
  name: string;
  email: string;
  phone?: string;
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

  useEffect(() => {
    setCart(read<CartItem[]>(CART_KEY, []));
    setUser(read<Account | null>(USER_KEY, null));
    setOrders(read<Order[]>(ORDERS_KEY, []));
    setReady(true);
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

  const priceOf = (slug: string) => products.find((p) => p.slug === slug)?.price ?? 0;

  const subtotal = useMemo(
    () => cart.reduce((sum, i) => sum + priceOf(i.slug) * i.qty, 0),
    [cart],
  );
  const cartCount = useMemo(() => cart.reduce((n, i) => n + i.qty, 0), [cart]);

  /* Accounts are stored locally on this device only — no passwords leave the
     browser and nothing sensitive is transmitted. */
  const register: StoreValue["register"] = useCallback((a) => {
    const existing = read<Record<string, { password: string; account: Account }>>(
      "sdl.accounts",
      {},
    );
    const key = a.email.trim().toLowerCase();
    if (!key || !a.password) return { ok: false, error: "Email and password required." };
    if (existing[key]) return { ok: false, error: "An account with that email exists." };
    const account: Account = { name: a.name, email: key, phone: a.phone };
    existing[key] = { password: a.password, account };
    write("sdl.accounts", existing);
    setUser(account);
    return { ok: true };
  }, []);

  const login: StoreValue["login"] = useCallback((email, password) => {
    const existing = read<Record<string, { password: string; account: Account }>>(
      "sdl.accounts",
      {},
    );
    const rec = existing[email.trim().toLowerCase()];
    if (!rec || rec.password !== password)
      return { ok: false, error: "Incorrect email or password." };
    setUser(rec.account);
    return { ok: true };
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const updateProfile = useCallback((patch: Partial<Account>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      const existing = read<Record<string, { password: string; account: Account }>>(
        "sdl.accounts",
        {},
      );
      if (existing[prev.email]) {
        existing[prev.email].account = next;
        write("sdl.accounts", existing);
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
    placeOrder,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
