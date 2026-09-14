import { createFileRoute } from "@tanstack/react-router";
import { Box, Clock, MapPin, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { PageHeader, PageShell } from "@/components/PageShell";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { whatsInTheBox } from "@/lib/products";

export const Route = createFileRoute("/delivery")({
  head: () => ({
    meta: [
      { title: "Delivery & Shipping — Mgwaba iStore" },
      { name: "description", content: "Insured nationwide iPhone delivery in 1–4 business days, free on orders over R10 000, with live tracking." },
      { property: "og:title", content: "Delivery & Shipping — Mgwaba iStore" },
      { property: "og:description", content: "Fast insured courier delivery across South Africa with live tracking." },
    ],
  }),
  component: Delivery,
});

const steps = [
  { icon: PackageCheck, title: "Order placed", text: "You receive an order number and confirmation instantly." },
  { icon: ShieldCheck, title: "Quality check", text: "42-point inspection and IMEI verification before packing." },
  { icon: Truck, title: "Dispatched", text: "Courier collects and you receive a live tracking link." },
  { icon: MapPin, title: "Delivered", text: "Signature on delivery, with insurance covering the full value." },
];

const options = [
  { name: "Standard Courier", time: "2–4 business days", price: "R120 · Free over R10 000" },
  { name: "Express Courier", time: "1–2 business days", price: "R249" },
  { name: "Same-Day (Durban metro)", time: "Order before 11:00", price: "R399" },
  { name: "Store Collection", time: "Ready in 2 hours", price: "Free" },
];

function Delivery() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Delivery"
        title="Insured, tracked, nationwide"
        subtitle="Every iPhone ships fully insured with signature on delivery — anywhere in South Africa."
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <div className="surface lift h-full p-6">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-secondary">
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-xs text-muted-foreground">Step {i + 1}</p>
                <h3 className="text-base font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card/40 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionHeading eyebrow="Shipping Methods" title="Choose your speed" align="left" />
          <div className="surface mt-8 divide-y divide-border">
            {options.map((o) => (
              <div key={o.name} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-5">
                <div className="min-w-0">
                  <p className="truncate font-medium">{o.name}</p>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> {o.time}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-medium">{o.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <SectionHeading eyebrow="Unboxing" title="What's in the Box?" align="left" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
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
      </section>
    </PageShell>
  );
}
