import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, GitCompare } from "lucide-react";
import { toast } from "sonner";
import phoneImg from "@/assets/phone-generic.jpg";
import phoneXR from "@/assets/iPhone XR.png";
import phone11 from "@/assets/iPhone 11.jpg";
import phone12 from "@/assets/iPhone 12.png";
import phone13 from "@/assets/iPHONE 13.png";
import phone14 from "@/assets/iPhone 14.jpg";
import phone15 from "@/assets/iPhone 15.jpg";
import phone16 from "@/assets/iPhone 16.jpg";
import { Stars, StockBadge } from "@/components/Badges";
import { Button } from "@/components/ui/button";
import { zar, monthly } from "@/lib/format";
import type { Product } from "@/lib/products";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart, toggleWishlist, wishlist, toggleCompare, compare } = useStore();
  const wished = wishlist.includes(product.slug);
  const compared = compare.includes(product.slug);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.05, 0.35) }}
      className="surface lift group flex flex-col overflow-hidden"
    >
      <div className="relative">
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="block overflow-hidden bg-secondary"
        >
          <img
            src={phoneImg}
            srcSet={`${phone13} 800w`}
            alt={`${product.name} — ${product.colours[0]}`}
            loading="lazy"
            width={800}
            height={800}
            className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.badges.slice(0, 2).map((b) => (
            <span
              key={b}
              className="glass rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
            >
              {b}
            </span>
          ))}
        </div>
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            aria-label="Add to wishlist"
            onClick={() => {
              toggleWishlist(product.slug);
              toast.success(wished ? "Removed from wishlist" : "Saved to wishlist");
            }}
            className="glass grid h-9 w-9 place-items-center rounded-full transition-transform hover:scale-110"
          >
            <Heart className={cn("h-4 w-4", wished && "fill-destructive text-destructive")} />
          </button>
          <button
            aria-label="Add to compare"
            onClick={() => {
              toggleCompare(product.slug);
              toast.success(compared ? "Removed from compare" : "Added to compare");
            }}
            className="glass grid h-9 w-9 place-items-center rounded-full transition-transform hover:scale-110"
          >
            <GitCompare className={cn("h-4 w-4", compared && "text-info")} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold">{product.name}</h3>
            <p className="text-xs text-muted-foreground">{product.condition}</p>
          </div>
          <StockBadge status={product.stock} qty={product.stockQty} />
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Stars rating={product.rating} />
          <span>
            {product.rating.toFixed(1)} · {product.reviews} reviews
          </span>
        </div>

        <dl className="grid grid-cols-2 gap-y-1.5 text-xs text-muted-foreground">
          <div className="col-span-2">
            <dt className="sr-only">Storage</dt>
            <dd>Storage: {product.storage.join(" · ")}</dd>
          </div>
          <div className="col-span-2">
            <dt className="sr-only">Colours</dt>
            <dd className="truncate">Colours: {product.colours.join(", ")}</dd>
          </div>
          <div>Battery: {product.batteryHealth}</div>
          <div>Released {product.year}</div>
        </dl>

        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-semibold">{zar(product.price)}</span>
            {product.oldPrice ? (
              <span className="text-sm text-muted-foreground line-through">
                {zar(product.oldPrice)}
              </span>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">
            or {zar(monthly(product.price))} /month × 24
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/product/$slug" params={{ slug: product.slug }}>
                View Details
              </Link>
            </Button>
            <Button
              size="sm"
              disabled={product.stock === "Sold Out"}
              onClick={() => {
                addToCart({
                  slug: product.slug,
                  storage: product.storage[0]!,
                  colour: product.colours[0]!,
                  qty: 1,
                });
                toast.success(`${product.name} added to cart`);
              }}
            >
              <ShoppingBag className="mr-1.5 h-4 w-4" />
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
