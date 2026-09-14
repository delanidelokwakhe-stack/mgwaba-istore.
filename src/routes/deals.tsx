import { Link, createFileRoute } from "@tanstack/react-router";
import { CreditCard, Gift, Repeat, Truck } from "lucide-react";
import { PageHeader, PageShell } from "@/components/PageShell";
import { ProductCard } from "@/components/ProductCard";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/products";

export const Route = createFileRoute("/deals")({
  head: () => ({
    meta: [
      { title: "Deals & Promotions — Mgwaba iStore" },
      { name: "description", content: "Trade-in bonuses, Buy Now Pay Later, free accessories and free nationwide delivery on iPhones." },
      { property: "og:title", content: "Deals & Promotions — Mgwaba iStore" },
      { property: "og:description", content: "Save more on genuine iPhones with our current promotions." },
    ],
  }),
  component: Deals,
});

const banners = [
  { icon: Repeat, title: "🔥 Trade-In & Save", text: "Trade your current iPhone and get up to R12 000 off, plus a R1 000 bonus when you upgrade to a Pro model.", to: "/trade-in" as const, cta: "Calculate my value" },
  { icon: CreditCard, title: "💳 Buy Now Pay Later", text: "Interest-friendly plans from 3 to 24 months. Deposit from 10%, instant estimate, no paperwork.", to: "/finance" as const, cta: "Build my plan" },
  { icon: Gift, title: "🎁 Free Accessories", text: "Selected iPhone 15, 16 and 17 models ship with a case, tempered glass and 20W adapter.", to: "/shop" as const, cta: "Shop eligible models" },
  { icon: Truck, title: "🚚 Free Delivery over R10 000", text: "Insured, tracked courier to your door anywhere in South Africa, at no extra cost.", to: "/delivery" as const, cta: "Delivery details" },
];

function Deals() {
  const discounted = products.filter((p) => p.oldPrice);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Deals"
        title="Promotions worth switching for"
        subtitle="Real savings on real Apple hardware — no hidden fees, no fine print games."
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2">
          {banners.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.06}>
              <div className="surface lift h-full p-8">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
                  <b.icon className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-xl font-semibold">{b.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{b.text}</p>
                <Button asChild variant="outline" className="mt-6 rounded-full">
                  <Link to={b.to}>{b.cta}</Link>
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="Price Drops" title="Reduced this month" align="left" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {discounted.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
