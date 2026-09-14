import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products, type Product } from "./products";

export interface CartItem {
  slug: string;
  storage: string;
  colour: string;
  qty: number;
  savedForLater?: boolean | undefined;
}

export interface BankSettings {
  businessName: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  branchCode: string;
  accountType: string;
}

interface StoreValue {
  theme: "dark" | "light";
  toggleTheme: () => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQty: (index: number, qty: number) => void;
  removeItem: (index: number) => void;
  toggleSaveForLater: (index: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  wishlist: string[];
  toggleWishlist: (slug: string) => void;
  compare: string[];
  toggleCompare: (slug: string) => void;
  recent: string[];
  addRecent: (slug: string) => void;
  bank: BankSettings;
  setBank: (b: BankSettings) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

const read = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const BANK_STORAGE_KEY = "mgwaba-istore-bank-settings-v2";
const defaultBank: BankSettings = {
  businessName: "Mgwaba iStore",
  bankName: "Capitec Bank",
  accountHolder: "Mgwaba iStore (Pty) Ltd",
  accountNumber: "1765621176",
  branchCode: "470010",
  accountType: "Cheque / Current Account",
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [bank, setBankState] = useState<BankSettings>(() => read(BANK_STORAGE_KEY, defaultBank));

  useEffect(() => {
    setTheme(read<"dark" | "light">("mg-theme", "dark"));
    setCart(read<CartItem[]>("mg-cart", []));
    setWishlist(read<string[]>("mg-wishlist", []));
    setCompare(read<string[]>("mg-compare", []));
    setRecent(read<string[]>("mg-recent", []));
    const setBank = (newBank: BankSettings) => {
      setBankState(newBank);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(BANK_STORAGE_KEY, JSON.stringify(newBank));
      }
    };

    setHydrated(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    if (hydrated) window.localStorage.setItem("mg-theme", JSON.stringify(theme));
  }, [theme, hydrated]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem("mg-cart", JSON.stringify(cart));
  }, [cart, hydrated]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem("mg-wishlist", JSON.stringify(wishlist));
  }, [wishlist, hydrated]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem("mg-compare", JSON.stringify(compare));
  }, [compare, hydrated]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem("mg-recent", JSON.stringify(recent));
  }, [recent, hydrated]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem("mg-bank", JSON.stringify(bank));
  }, [bank, hydrated]);

  const value = useMemo<StoreValue>(() => {
    const priceOf = (slug: string) => products.find((p: Product) => p.slug === slug)?.price ?? 0;
    const active = cart.filter((i) => !i.savedForLater);
    return {
      theme,
      toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
      cart,
      addToCart: (item) =>
        setCart((c) => {
          const idx = c.findIndex(
            (i) => i.slug === item.slug && i.storage === item.storage && i.colour === item.colour,
          );
          if (idx >= 0) {
            const next = [...c];
            const existing = next[idx]!;
            next[idx] = { ...existing, qty: existing.qty + item.qty, savedForLater: false };
            return next;
          }
          return [...c, item];
        }),
      updateQty: (index, qty) =>
        setCart((c) => c.map((i, n) => (n === index ? { ...i, qty: Math.max(1, qty) } : i))),
      removeItem: (index) => setCart((c) => c.filter((_, n) => n !== index)),
      toggleSaveForLater: (index) =>
        setCart((c) =>
          c.map((i, n) => (n === index ? { ...i, savedForLater: !i.savedForLater } : i)),
        ),
      clearCart: () => setCart([]),
      cartCount: active.reduce((a, i) => a + i.qty, 0),
      cartTotal: active.reduce((a, i) => a + priceOf(i.slug) * i.qty, 0),
      wishlist,
      toggleWishlist: (slug) =>
        setWishlist((w) => (w.includes(slug) ? w.filter((s) => s !== slug) : [...w, slug])),
      compare,
      toggleCompare: (slug) =>
        setCompare((c) =>
          c.includes(slug) ? c.filter((s) => s !== slug) : c.length >= 4 ? c : [...c, slug],
        ),
      recent,
      addRecent: (slug) => setRecent((r) => [slug, ...r.filter((s) => s !== slug)].slice(0, 6)),
      bank,
      
      setBank: setBankState,
    };
  }, [theme, cart, wishlist, compare, recent, bank]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

// The hook intentionally lives with the provider so both share the same context.
// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
