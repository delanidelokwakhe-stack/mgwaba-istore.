import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Mgwaba iStore" },
      { name: "description", content: "How Mgwaba iStore collects, uses and protects your personal information when you shop with us." },
      { property: "og:title", content: "Privacy Policy — Mgwaba iStore" },
      { property: "og:description", content: "How we handle and protect your personal information." },
    ],
  }),
  component: Privacy,
});

const sections = [
  {
    title: "Information we collect",
    body: "We collect the details you provide at checkout — your name, email address, mobile number and delivery address — along with order history and any proof-of-payment documents you upload.",
  },
  {
    title: "How we use your information",
    body: "Your information is used to process orders, arrange delivery, verify payments, provide warranty support and send order updates. We do not sell your personal information.",
  },
  {
    title: "Payment data",
    body: "Card details are handled by our payment provider and are never stored on our servers. EFT proof-of-payment documents are used only to verify your order.",
  },
  {
    title: "Data retention",
    body: "Order records are kept for as long as needed to support warranty claims and to meet South African tax and consumer-protection requirements.",
  },
  {
    title: "Your rights",
    body: "You may request access to, correction of, or deletion of your personal information at any time by contacting us on WhatsApp or through the contact page.",
  },
];

function Privacy() {
  return (
    <PageShell>
      <PageHeader eyebrow="Legal" title="Privacy Policy" subtitle="Last updated: this page is maintained by Mgwaba iStore." />
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
