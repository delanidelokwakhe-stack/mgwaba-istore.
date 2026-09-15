import { Link, createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Banknote,
  CreditCard,
  Gift,
  Headphones,
  Repeat,
  ShieldCheck,
  Sparkles,
  Truck,
  Wallet,
  ArrowRight,
} from "lucide-react";
import heroImg from "@/assets/hero-iphone.jpg";
import { Stars } from "@/components/Badges";
import { PageShell } from "@/components/PageShell";
import { ProductCard } from "@/components/ProductCard";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { zar } from "@/lib/format";
import { bestSellers, faqs, newArrivals, products, testimonials } from "@/lib/products";
import { RecentlyViewed } from "@/components/RecentlyViewed";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mgwaba iStore — Your Next iPhone Starts Here" },
      {
        name: "description",
        content:
          "Genuine Apple iPhones from XR to iPhone 12 Pro. Affordable prices, secure payments, nationwide delivery and excellent customer service.",
      },
      { property: "og:title", content: "Mgwaba iStore — Your Next iPhone Starts Here" },
      {
        property: "og:description",
        content:
          "Genuine Apple iPhones, secure card & EFT payments, trade-ins and nationwide delivery.",
      },
    ],
  }),
  component: Home,
});

const reasons = [
  {
    icon: BadgeCheck,
    title: "Genuine Apple Devices",
    text: "IMEI verified against Apple's activation database before listing.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Tested",
    text: "42-point hardware inspection on every single device we sell.",
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    text: "Insured courier to every province, with live tracking.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    text: "PCI DSS compliant Visa & Mastercard processing with 3D Secure.",
  },
  {
    icon: Wallet,
    title: "Warranty Available",
    text: "Apple warranty on new units, 6–12 months on pre-owned.",
  },
  {
    icon: Banknote,
    title: "Affordable Prices",
    text: "Direct sourcing keeps our pricing below the big retailers.",
  },
  {
    icon: Headphones,
    title: "Excellent Support",
    text: "Real humans on WhatsApp, seven days a week.",
  },
];

const offers = [
  {
    icon: Repeat,
    title: "Trade-In & Save",
    text: "Get up to R12 000 off when you trade in your current iPhone.",
    to: "/trade-in" as const,
    cta: "Calculate value",
  },
  {
    icon: CreditCard,
    title: "Buy Now, Pay Later",
    text: "Split any iPhone into 1 to 3 monthly instalments.",
    to: "/finance" as const,
    cta: "See plans",
  },
  {
    icon: Gift,
    title: "Free Accessories",
    text: "Case, screen protector and 20W adapter on selected models.",
    to: "/deals" as const,
    cta: "View deals",
  },
  {
    icon: Truck,
    title: "Free Delivery",
    text: "Complimentary insured delivery on all orders over R10 000.",
    to: "/delivery" as const,
    cta: "Delivery info",
  },
];

function Home() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="hero-glow relative overflow-hidden pt-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-2 lg:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              iPhone 16 Pro now landed
            </span>
            <h1 className="mt-6 text-5xl font-semibold leading-[1.03] sm:text-6xl lg:text-7xl">
              Your Next iPhone <span className="text-sheen">Starts Here.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              Discover genuine Apple iPhones from iPhone XR to the latest iPhone 16 Pro.
              payments, nationwide delivery, and excellent customer service.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-7">
                <Link to="/shop">Shop Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-7">
                <Link to="/deals">View Deals</Link>
              </Button>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6">
              {[
                ["17", "Models in stock"],
                ["4.9★", "Average rating"],
                ["48h", "Typical delivery"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="font-display text-2xl font-semibold">{v}</dt>
                  <dd className="text-xs text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative"
          >
            <div className="float-soft overflow-hidden rounded-[2.5rem] border border-border shadow-[var(--shadow-lift)]">
              <img
                src={heroImg}
                alt="iPhone 12 Pro in space black titanium"
                width={1200}
                height={1408}
                className="w-full object-cover"
              />
            </div>
            <div className="glass absolute bottom-6 left-6 rounded-2xl px-4 py-3">
              <p className="text-xs text-muted-foreground">iPhone 12 Pro from</p>
              <p className="font-display text-xl font-semibold">{zar(8200)}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured collection */}
      <section id="featured" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Featured Collection"
          title="Every iPhone, one trusted store"
          subtitle="From the dependable iPhone XR to the flagship iPhone 12 Pro — each device quality tested, priced honestly and ready to ship."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section className="border-y border-border bg-card/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="New Arrivals" title="Just landed on our shelves" align="left" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {newArrivals.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="Buying a phone should feel safe"
          subtitle="Seven promises we keep on every single order."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.05}>
              <div className="surface lift h-full p-6">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-secondary">
                  <r.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{r.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Special offers */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <SectionHeading eyebrow="Special Offers" title="Ways to pay less" />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {offers.map((o, i) => (
            <Reveal key={o.title} delay={i * 0.06}>
              <div className="surface lift flex h-full items-start gap-5 overflow-hidden p-7">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
                  <o.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold">{o.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{o.text}</p>
                  <Link
                    to={o.to}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium hover:gap-2.5 hover:transition-all"
                  >
                    {o.cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Best sellers */}
      <section className="border-y border-border bg-card/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="Best Sellers" title="What South Africa is buying" align="left" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {bestSellers.slice(0, 8).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      <RecentlyViewed />

      {/* Reviews */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading eyebrow="Customer Reviews" title="Trusted by thousands of customers" />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.05}>
              <figure className="surface lift h-full p-6">
                <Stars rating={t.rating} />
                <blockquote className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  “{t.text}”
                </blockquote>
                <figcaption className="mt-5 text-sm font-medium">
                  {t.name} <span className="text-muted-foreground">· {t.city}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <SectionHeading eyebrow="FAQs" title="Questions, answered" />
          <Reveal className="mt-10">
            <Accordion type="single" collapsible className="surface divide-y divide-border px-6">
              {faqs.map((f) => (
                <AccordionItem key={f.q} value={f.q} className="border-none">
                  <AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
          <Reveal className="mt-8 text-center">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/faq">See all FAQs</Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <Reveal>
          <div className="surface overflow-hidden p-10 text-center sm:p-16">
            <h2 className="text-3xl font-semibold sm:text-4xl">Ready to upgrade?</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Chat to our team on WhatsApp for stock checks and quotations, or browse the full
              collection and check out in minutes.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="rounded-full px-7">
                <Link to="/shop">Shop iPhones</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-7">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}
