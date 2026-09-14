import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, Moon, Search, ShoppingBag, Sun, X, Apple } from "lucide-react";
import { useEffect, useState } from "react";
import { SearchDialog } from "@/components/SearchDialog";
import { Button } from "@/components/ui/button";
import logo from "@/assets/Mgwaba iStore LOGO.png";
import { useStore } from "@/lib/store";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/deals", label: "Deals" },
  { to: "/compare", label: "Compare" },
  { to: "/finance", label: "Finance" },
  { to: "/delivery", label: "Delivery" },
  { to: "/reviews", label: "Reviews" },
  { to: "/faq", label: "FAQs" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const { cartCount, wishlist, theme, toggleTheme } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "glass shadow-[var(--shadow-soft)]" : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <img
              src={logo}
              alt="Mgwaba iStore"
              className="h-11 w-11 rounded-lg bg-white/95 p-0.5"
            />
            <span className="font-display text-base font-semibold tracking-tight">
              Mgwaba <span className="text-muted-foreground">iStore</span>
            </span>
          </Link>

          <div className="mx-auto hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "bg-accent text-foreground" }}
                className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-1">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-accent"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
            <button
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-accent"
            >
              {theme === "dark" ? (
                <Sun className="h-[18px] w-[18px]" />
              ) : (
                <Moon className="h-[18px] w-[18px]" />
              )}
            </button>
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-accent"
            >
              <Heart className="h-[18px] w-[18px]" />
              {wishlist.length > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                  {wishlist.length}
                </span>
              ) : null}
            </Link>
            <Link
              to="/cart"
              aria-label="Cart"
              className="relative grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-accent"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {cartCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              ) : null}
            </Link>
            <Button asChild size="sm" className="ml-1 hidden sm:inline-flex">
              <Link to="/shop">Shop Now</Link>
            </Button>
            <button
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-accent lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border lg:hidden"
            >
              <div className="grid gap-1 px-4 py-4">
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
