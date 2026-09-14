import { Link, createFileRoute } from "@tanstack/react-router";
import { Minus, Plus, Tag, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import phoneImg from "@/assets/phone-generic.jpg";
import { PageHeader, PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { monthly, zar } from "@/lib/format";
import { products } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Mgwaba iStore" },
      { name: "description", content: "Review your iPhone order, apply a promo code and continue to secure checkout." },
      { property: "og:title", content: "Your Cart — Mgwaba iStore" },
      { property: "og:description", content: "Review your iPhone order and check out securely." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { cart, updateQty, removeItem, toggleSaveForLater, cartTotal } = useStore();
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);

  const active = cart.filter((i) => !i.savedForLater);
  const saved = cart.filter((i) => i.savedForLater);
  const delivery = cartTotal >= 10000 || cartTotal === 0 ? 0 : 120;
  const total = Math.max(0, cartTotal - discount + delivery);

  const line = (slug: string) => products.find((p) => p.slug === slug);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Cart"
        title="Your bag"
        subtitle="Everything you've picked out, ready for secure checkout."
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {active.length === 0 ? (
            <div className="surface p-16 text-center">
              <p className="text-muted-foreground">Your bag is empty.</p>
              <Button asChild className="mt-6 rounded-full">
                <Link to="/shop">Continue shopping</Link>
              </Button>
            </div>
          ) : (
            cart.map((item, index) => {
              if (item.savedForLater) return null;
              const p = line(item.slug);
              if (!p) return null;
              return (
                <div key={`${item.slug}-${index}`} className="surface flex flex-wrap items-center gap-5 p-5">
                  <img
                    src={phoneImg}
                    alt={p.name}
                    loading="lazy"
                    width={120}
                    height={120}
                    className="h-24 w-24 shrink-0 rounded-2xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.storage} · {item.colour} · {p.condition}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Estimated delivery: 1–4 business days
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <div className="flex items-center rounded-full border border-border">
                        <button
                          aria-label="Decrease"
                          className="grid h-8 w-8 place-items-center"
                          onClick={() => updateQty(index, item.qty - 1)}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.qty}</span>
                        <button
                          aria-label="Increase"
                          className="grid h-8 w-8 place-items-center"
                          onClick={() => updateQty(index, item.qty + 1)}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => toggleSaveForLater(index)}>
                        Save for later
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => removeItem(index)}>
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Remove
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg font-semibold">{zar(p.price * item.qty)}</p>
                    <p className="text-xs text-muted-foreground">{zar(monthly(p.price))} /month</p>
                  </div>
                </div>
              );
            })
          )}

          {saved.length > 0 ? (
            <div className="surface p-6">
              <h2 className="font-semibold">Saved for later</h2>
              <div className="mt-4 space-y-3">
                {cart.map((item, index) => {
                  if (!item.savedForLater) return null;
                  const p = line(item.slug);
                  if (!p) return null;
                  return (
                    <div key={`saved-${index}`} className="flex items-center justify-between gap-4 text-sm">
                      <span className="min-w-0 truncate">
                        {p.name} · {item.storage} · {item.colour}
                      </span>
                      <Button variant="outline" size="sm" onClick={() => toggleSaveForLater(index)}>
                        Move to bag
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        <aside className="surface h-fit p-7 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <div className="mt-5 flex gap-2">
            <Input
              placeholder="Promo code"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
            />
            <Button
              variant="outline"
              onClick={() => {
                if (promo.trim().toUpperCase() === "MGWABA10") {
                  setDiscount(Math.round(cartTotal * 0.1));
                  toast.success("Promo applied — 10% off");
                } else {
                  toast.error("That promo code isn't valid.");
                }
              }}
            >
              <Tag className="h-4 w-4" />
            </Button>
          </div>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{zar(cartTotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Promo / trade-in discount</dt>
              <dd className="text-success">−{zar(discount)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery</dt>
              <dd>{delivery === 0 ? "Free" : zar(delivery)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
              <dt>Total</dt>
              <dd>{zar(total)}</dd>
            </div>
            <p className="text-xs text-muted-foreground">
              Or {zar(monthly(total))} /month on a 24-month plan.
            </p>
          </dl>
          <Button asChild size="lg" className="mt-6 w-full rounded-full" disabled={active.length === 0}>
            <Link to="/checkout">Secure Checkout</Link>
          </Button>
          <Button asChild variant="ghost" className="mt-2 w-full">
            <Link to="/shop">Continue shopping</Link>
          </Button>
        </aside>
      </section>
    </PageShell>
  );
}
