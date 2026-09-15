import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import {
  BadgeCheck,
  GitCompare,
  Heart,
  RotateCcw,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Box,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import phoneImg from "@/assets/phone-generic.jpg";
import heroImg from "@/assets/hero-iphone.jpg";
import phone13 from "@/assets/iPHONE 13.png";
import { Stars, StockBadge } from "@/components/Badges";
import { PageShell } from "@/components/PageShell";
import { ProductCard } from "@/components/ProductCard";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { monthly, zar } from "@/lib/format";
import { getProduct, products, testimonials, whatsInTheBox, type Product } from "@/lib/products";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "iPhone not found — Mgwaba iStore" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const p = loaderData.product;
    return {
      meta: [
        { title: `${p.name} — ${zar(p.price)} | Mgwaba iStore` },
        {
          name: "description",
          content: `Buy a ${p.condition.toLowerCase()} ${p.name} with ${p.storage.join(", ")} storage. ${p.stock}. Nationwide delivery and secure payments.`,
        },
        { property: "og:title", content: `${p.name} — Mgwaba iStore` },
        {
          property: "og:description",
          content: `${p.condition} ${p.name} from ${zar(p.price)} with warranty and nationwide delivery.`,
        },
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { product } = Route.useLoaderData() as { product: Product };
  const { addToCart, toggleWishlist, wishlist, toggleCompare, compare, addRecent } = useStore();
  const [storage, setStorage] = useState(product.storage[0]!);
  const [colour, setColour] = useState(product.colours[0]!);
  const [image, setImage] = useState(0);
  const [review, setReview] = useState("");

  useEffect(() => {
    addRecent(product.slug);
    setStorage(product.storage[0]!);
    setColour(product.colours[0]!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.slug]);

  const gallery = [heroImg, phoneImg, phone13];
  const related = products
    .filter((p) => p.slug !== product.slug && p.year >= product.year - 1)
    .slice(0, 4);
  const wished = wishlist.includes(product.slug);

  return (
    <PageShell>
      <section className="hero-glow pt-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
          {/* Gallery */}
          <div>
            <div className="surface group overflow-hidden">
              <img
                src={gallery[image]}
                alt={`${product.name} in ${colour}`}
                width={1200}
                height={1200}
                className="h-[420px] w-full object-cover transition-transform duration-700 group-hover:scale-125"
              />
            </div>
            <div className="mt-4 flex items-center gap-3">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setImage(i)}
                  className={cn(
                    "h-16 w-16 overflow-hidden rounded-xl border-2 transition-colors",
                    image === i ? "border-foreground" : "border-border",
                  )}
                >
                  <img src={g} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
              <div className="ml-auto flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs text-muted-foreground">
                <RotateCcw className="h-3.5 w-3.5" /> 360° viewer
              </div>
            </div>
          </div>

          {/* Buy box */}
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <StockBadge status={product.stock} qty={product.stockQty} />
              {product.badges.map((b) => (
                <span
                  key={b}
                  className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                >
                  {b}
                </span>
              ))}
            </div>
            <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">{product.name}</h1>
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Stars rating={product.rating} />
              {product.rating.toFixed(1)} · {product.reviews} reviews · {product.condition}
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-3xl font-semibold">{zar(product.price)}</span>
              {product.oldPrice ? (
                <span className="text-muted-foreground line-through">{zar(product.oldPrice)}</span>
              ) : null}
            </div>
            <p className="text-sm text-muted-foreground">
              or {zar(monthly(product.price))} /month × 3 · Trade-in value up to {zar(product.tradeInValue)}
            </p>

            <div className="mt-7">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Storage</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.storage.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStorage(s)}
                    className={cn(
                      "rounded-xl border px-4 py-2 text-sm transition-colors",
                      storage === s
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:bg-accent",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Colour</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colours.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColour(c)}
                    className={cn(
                      "rounded-xl border px-4 py-2 text-sm transition-colors",
                      colour === c
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:bg-accent",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <dl className="mt-7 grid grid-cols-2 gap-3 text-sm">
              {[
                ["Battery health", product.batteryHealth],
                ["Condition", product.condition],
                [
                  "Warranty",
                  product.condition === "Brand New" ? "12 months Apple" : "6 months Mgwaba",
                ],
                ["Delivery estimate", "1–4 business days"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl border border-border p-4">
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd className="mt-0.5 font-medium">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="flex-1 rounded-full"
                disabled={product.stock === "Sold Out"}
                onClick={() => {
                  addToCart({ slug: product.slug, storage, colour, qty: 1 });
                  toast.success(`${product.name} (${storage}, ${colour}) added to cart`);
                }}
              >
                <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/checkout">Buy Now</Link>
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <Button variant="ghost" size="sm" onClick={() => toggleWishlist(product.slug)}>
                <Heart
                  className={cn("mr-1.5 h-4 w-4", wished && "fill-destructive text-destructive")}
                />
                Wishlist
              </Button>
              <Button variant="ghost" size="sm" onClick={() => toggleCompare(product.slug)}>
                <GitCompare
                  className={cn("mr-1.5 h-4 w-4", compare.includes(product.slug) && "text-info")}
                />
                Compare
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  void navigator.clipboard?.writeText(window.location.href);
                  toast.success("Product link copied");
                }}
              >
                <Share2 className="mr-1.5 h-4 w-4" /> Share
              </Button>
            </div>

            <div className="mt-6 grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
              {[
                [BadgeCheck, "IMEI verified"],
                [ShieldCheck, "Warranty included"],
                [Truck, "Insured delivery"],
              ].map(([Icon, label], i) => {
                const I = Icon as typeof BadgeCheck;
                return (
                  <span key={i} className="flex items-center gap-2">
                    <I className="h-4 w-4" /> {label as string}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="border-t border-border py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <SectionHeading eyebrow="Specifications" title="The technical detail" align="left" />
          <div className="surface mt-8 grid gap-px overflow-hidden sm:grid-cols-2">
            {(Object.entries(product.specs) as [string, string][]).map(([k, v]) => (
              <div
                key={k}
                className="flex items-start justify-between gap-4 border-b border-border p-5"
              >
                <span className="text-sm capitalize text-muted-foreground">
                  {k.replace(/([A-Z])/g, " $1")}
                </span>
                <span className="text-right text-sm font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's in the box */}
      <section className="border-t border-border bg-card/40 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <SectionHeading eyebrow="Unboxing" title="What's in the Box?" align="left" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {whatsInTheBox.map((item, i) => (
              <Reveal key={item.label} delay={i * 0.05}>
                <div className="surface flex items-start gap-4 p-5">
                  <Box className="mt-0.5 h-5 w-5 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.note}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Power adapter and EarPods may not be included depending on region and model.
          </p>
        </div>
      </section>

      {/* Frequently bought together */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeading eyebrow="Bundle & Save" title="Frequently bought together" align="left" />
        <div className="surface mt-8 grid gap-6 p-8 sm:grid-cols-[1fr_auto] sm:items-center">
          <ul className="space-y-3 text-sm">
            {[
              [`${product.name} · ${storage} · ${colour}`, product.price],
              ["Premium MagSafe case", 549],
              ["Tempered glass screen protector", 249],
            ].map(([label, price]) => (
              <li key={label as string} className="flex justify-between gap-4">
                <span>{label as string}</span>
                <span className="font-medium">{zar(price as number)}</span>
              </li>
            ))}
          </ul>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Bundle price</p>
            <p className="font-display text-2xl font-semibold">{zar(product.price + 649)}</p>
            <Button
              className="mt-3 rounded-full"
              onClick={() => {
                addToCart({ slug: product.slug, storage, colour, qty: 1 });
                toast.success("Bundle added to cart");
              }}
            >
              Add bundle
            </Button>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="border-t border-border py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Reviews"
            title={`${product.rating.toFixed(1)} out of 5`}
            align="left"
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {testimonials.slice(0, 4).map((t) => (
              <figure key={t.name} className="surface p-6">
                <Stars rating={t.rating} />
                <blockquote className="mt-3 text-sm text-muted-foreground">“{t.text}”</blockquote>
                <figcaption className="mt-4 text-sm font-medium">{t.name}</figcaption>
              </figure>
            ))}
          </div>
          <div className="surface mt-6 p-6">
            <p className="font-medium">Write a review</p>
            <Textarea
              rows={4}
              maxLength={1000}
              className="mt-3"
              placeholder={`Tell other buyers about your ${product.name}…`}
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            <Button
              className="mt-4 rounded-full"
              onClick={() => {
                if (!review.trim()) {
                  toast.error("Please write your review first.");
                  return;
                }
                toast.success("Thanks! Your review is pending moderation.");
                setReview("");
              }}
            >
              Submit review
            </Button>
          </div>
        </div>
      </section>

      <RecentlyViewed />

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <SectionHeading eyebrow="You may also like" title="Related iPhones" align="left" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
