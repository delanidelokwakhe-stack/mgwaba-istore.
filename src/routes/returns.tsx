import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/returns")({
  head: () => ({
    meta: [
      { title: "Returns & Refunds — Mgwaba iStore" },
      { name: "description", content: "Our 7-day returns window, refund timelines and how to book a return for your iPhone." },
      { property: "og:title", content: "Returns & Refunds — Mgwaba iStore" },
      { property: "og:description", content: "7-day returns, easy refunds and warranty repairs." },
    ],
  }),
  component: Returns,
});

const steps = [
  { title: "7-day change of mind", body: "Return an unopened, unused device within 7 days of delivery for a full refund, less the return courier fee." },
  { title: "Faulty on arrival", body: "If a device is defective on arrival, we replace it at no cost. Contact us within 48 hours of delivery." },
  { title: "How to book a return", body: "Message us on WhatsApp with your order number and the reason for the return. We arrange a courier collection at a time that suits you." },
  { title: "Refund timelines", body: "Card refunds reflect within 3–5 business days. EFT refunds are paid back to the originating account within 2 business days of inspection." },
  { title: "Warranty repairs", body: "Warranty claims are logged with an authorised repair centre. Loan devices are available on request while yours is being repaired." },
];

function Returns() {
  return (
    <PageShell>
      <PageHeader eyebrow="Support" title="Returns & Refunds" subtitle="Straightforward returns, no fine-print games." />
      <section className="mx-auto max-w-3xl space-y-6 px-4 py-14 sm:px-6">
        {steps.map((s) => (
          <article key={s.title} className="surface p-7">
            <h2 className="text-lg font-semibold">{s.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
