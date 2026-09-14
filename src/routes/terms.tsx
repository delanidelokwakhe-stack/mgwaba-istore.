import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Mgwaba iStore" },
      { name: "description", content: "The terms that apply to purchases, instalment plans, trade-ins and warranties at Mgwaba iStore." },
      { property: "og:title", content: "Terms & Conditions — Mgwaba iStore" },
      { property: "og:description", content: "Purchase, instalment, trade-in and warranty terms." },
    ],
  }),
  component: Terms,
});

const sections = [
  { title: "Orders and pricing", body: "All prices are in South African Rand and include VAT. Orders are confirmed once payment has been approved or EFT proof of payment has been verified." },
  { title: "Stock availability", body: "Stock is updated regularly, but availability is not guaranteed until your order is confirmed. If an item becomes unavailable we will offer an alternative or a full refund." },
  { title: "Instalment plans", body: "Instalment agreements are subject to affordability checks. The monthly figures shown in our calculator are estimates and are confirmed before dispatch." },
  { title: "Trade-ins", body: "Trade-in quotes are estimates based on the details you provide. The final offer is confirmed after physical inspection of your device." },
  { title: "Warranty", body: "New devices carry the standard Apple limited warranty. Pre-owned and refurbished devices carry the warranty period stated on the product page." },
  { title: "Governing law", body: "These terms are governed by the laws of the Republic of South Africa, including the Consumer Protection Act." },
];

function Terms() {
  return (
    <PageShell>
      <PageHeader eyebrow="Legal" title="Terms & Conditions" subtitle="The rules that apply when you shop with Mgwaba iStore." />
      <section className="mx-auto max-w-3xl space-y-6 px-4 py-14 sm:px-6">
        {sections.map((s) => (
          <article key={s.title} className="surface p-7">
            <h2 className="text-lg font-semibold">{s.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
