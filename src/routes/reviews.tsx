import { createFileRoute } from "@tanstack/react-router";
import { Stars } from "@/components/Badges";
import { PageHeader, PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { testimonials } from "@/lib/products";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Customer Reviews — Mgwaba iStore" },
      { name: "description", content: "Read verified customer reviews about buying genuine iPhones from Mgwaba iStore." },
      { property: "og:title", content: "Customer Reviews — Mgwaba iStore" },
      { property: "og:description", content: "Verified reviews from iPhone buyers across South Africa." },
    ],
  }),
  component: Reviews,
});

const breakdown = [
  { stars: 5, pct: 87 },
  { stars: 4, pct: 9 },
  { stars: 3, pct: 3 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 0 },
];

function Reviews() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Reviews"
        title="What our customers say"
        subtitle="Every review below comes from a verified Mgwaba iStore order."
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="surface grid gap-8 p-8 md:grid-cols-[240px_1fr]">
          <div className="text-center md:text-left">
            <p className="font-display text-5xl font-semibold">4.9</p>
            <Stars rating={5} className="mt-2" />
            <p className="mt-2 text-sm text-muted-foreground">Based on 1 284 verified orders</p>
          </div>
          <div className="space-y-2">
            {breakdown.map((b) => (
              <div key={b.stars} className="flex items-center gap-3 text-sm">
                <span className="w-10 shrink-0 text-muted-foreground">{b.stars}★</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-warning" style={{ width: `${b.pct}%` }} />
                </div>
                <span className="w-10 shrink-0 text-right text-muted-foreground">{b.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[...testimonials, ...testimonials].map((t, i) => (
            <Reveal key={`${t.name}-${i}`} delay={(i % 6) * 0.05}>
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
    </PageShell>
  );
}
