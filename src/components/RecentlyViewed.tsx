import { Link } from "@tanstack/react-router";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import phoneImg from "@/assets/phone-generic.jpg";

import { SectionHeading } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { zar } from "@/lib/format";
import { products } from "@/lib/products";
import { useStore } from "@/lib/store";

export function RecentlyViewed() {
  const { recent, addToCart, toggleWishlist } = useStore();
  const items = recent
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is (typeof products)[number] => Boolean(p));

  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHeading eyebrow="Recently Viewed" title="Pick up where you left off" align="left" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {items.map((p) => (
          <div key={p.slug} className="surface lift overflow-hidden">
            <Link to="/product/$slug" params={{ slug: p.slug }}>
              <img
                src={phoneImg}
                srcSet={`${phoneImg} 800w`}
                alt={p.name}
                loading="lazy"
                width={800}
                height={800}
                className="h-32 w-full object-cover"
              />
            </Link>
            <div className="p-4">
              <p className="truncate text-sm font-semibold">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.storage.join(" · ")}</p>
              <p className="mt-1 text-sm font-medium">{zar(p.price)}</p>
              <div className="mt-3 flex gap-1.5">
                <Button asChild size="icon" variant="outline" className="h-8 w-8">
                  <Link to="/product/$slug" params={{ slug: p.slug }} aria-label="Quick view">
                    <Eye className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  aria-label="Wishlist"
                  onClick={() => toggleWishlist(p.slug)}
                >
                  <Heart className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  className="h-8 w-8"
                  aria-label="Add to cart"
                  onClick={() => {
                    addToCart({
                      slug: p.slug,
                      storage: p.storage[0]!,
                      colour: p.colours[0]!,
                      qty: 1,
                    });
                    toast.success(`${p.name} added to cart`);
                  }}
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
