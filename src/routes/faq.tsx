import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/lib/products";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQs — Mgwaba iStore" },
      { name: "description", content: "Answers about iPhone authenticity, warranties, delivery times, trade-ins and payment methods." },
      { property: "og:title", content: "FAQs — Mgwaba iStore" },
      { property: "og:description", content: "Everything you need to know before buying your iPhone." },
    ],
  }),
  component: Faq,
});

const extra = [
  { q: "Can I collect my order in person?", a: "Yes. Select Store Collection at checkout and collect from our Durban store within two hours of your order being confirmed." },
  { q: "Do you sell accessories?", a: "We stock cases, tempered glass, MagSafe chargers and 20W adapters. Ask on WhatsApp for current stock and bundle pricing." },
  { q: "What does 'Excellent' condition mean?", a: "Excellent devices are pre-owned, fully functional, with minimal cosmetic wear and battery health above 85%. Every unit is professionally cleaned and reset." },
  { q: "Can I return a device?", a: "Yes — 7-day returns on unopened devices and 14 days for defective units, in line with the Consumer Protection Act." },
];

function Faq() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="FAQs"
        title="Frequently asked questions"
        subtitle="Can't find what you need? Our team is one WhatsApp message away."
      />
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <Reveal>
          <Accordion type="single" collapsible className="surface divide-y divide-border px-6">
            {[...faqs, ...extra].map((f) => (
              <AccordionItem key={f.q} value={f.q} className="border-none">
                <AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </section>
    </PageShell>
  );
}
