import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";
import { PageHeader, PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { monthly, zar } from "@/lib/format";
import { products, type Product } from "@/lib/products";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare iPhones — Mgwaba iStore" },
      { name: "description", content: "Compare up to four iPhones side by side: display, chipset, cameras, battery, ports, weight and price." },
      { property: "og:title", content: "Compare iPhones — Mgwaba iStore" },
      { property: "og:description", content: "Side-by-side iPhone specification comparison with highlight differences." },
    ],
  }),
  component: Compare,
});

const rows: { label: string; get: (p: Product) => string }[] = [
  { label: "Model", get: (p) => p.name },
  { label: "Release Year", get: (p) => String(p.year) },
  { label: "Display Size", get: (p) => p.specs.display },
  { label: "Display Type", get: (p) => p.specs.displayType },
  { label: "Chipset", get: (p) => p.specs.chipset },
  { label: "RAM", get: (p) => p.specs.ram },
  { label: "Storage Options", get: (p) => p.storage.join(", ") },
  { label: "Camera System", get: (p) => p.specs.camera },
  { label: "Front Camera", get: (p) => p.specs.frontCamera },
  { label: "Video Recording", get: (p) => p.specs.video },
  { label: "Battery Life", get: (p) => p.specs.battery },
  { label: "Face ID", get: (p) => p.specs.faceId },
  { label: "Dynamic Island", get: (p) => p.specs.dynamicIsland },
  { label: "MagSafe Support", get: (p) => p.specs.magsafe },
  { label: "Charging Port", get: (p) => p.specs.port },
  { label: "Water Resistance", get: (p) => p.specs.water },
  { label: "Weight", get: (p) => p.specs.weight },
  { label: "Available Colours", get: (p) => p.colours.join(", ") },
  { label: "Price", get: (p) => zar(p.price) },
  { label: "Monthly Payment", get: (p) => `${zar(monthly(p.price))} × 3` },
  { label: "Availability", get: (p) => p.stock },
];

function Compare() {
  const { compare, toggleCompare } = useStore();
  const selected = compare
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p));

  const [highlight, setHighlight] = useState(true);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Compare"
        title="Compare iPhones side by side"
        subtitle="Select up to four devices and see exactly what changes between generations."
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="surface p-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
            <h2 className="min-w-0 truncate text-lg font-semibold">
              Selected devices ({selected.length}/4)
            </h2>
            <div className="flex shrink-0 items-center gap-2">
              <Switch
                id="highlight"
                checked={highlight}
                onCheckedChange={setHighlight}
              />
              <Label htmlFor="highlight" className="text-sm">Highlight differences</Label>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {products.map((p) => {
              const active = compare.includes(p.slug);
              return (
                <button
                  key={p.slug}
                  onClick={() => toggleCompare(p.slug)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs transition-colors",
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:bg-accent",
                  )}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>

        {selected.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">
            Pick at least two iPhones above to start comparing.
          </p>
        ) : (
          <div className="surface mt-8 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="sticky left-0 bg-card p-4 text-left text-xs uppercase tracking-widest text-muted-foreground">
                    Specification
                  </th>
                  {selected.map((p) => (
                    <th key={p.slug} className="p-4 text-left">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold">{p.name}</span>
                        <button aria-label="Remove" onClick={() => toggleCompare(p.slug)}>
                          <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const values = selected.map((p) => row.get(p));
                  const differs = new Set(values).size > 1;
                  return (
                    <tr key={row.label} className="border-t border-border">
                      <th className="sticky left-0 bg-card p-4 text-left font-medium text-muted-foreground">
                        {row.label}
                      </th>
                      {values.map((v, i) => (
                        <td
                          key={i}
                          className={cn(
                            "p-4 align-top",
                            highlight && differs && "bg-warning/10 font-medium",
                          )}
                        >
                          {v}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {selected.length > 0 ? (
          <div className="mt-6 text-center">
            <Button variant="outline" onClick={() => selected.forEach((p) => toggleCompare(p.slug))}>
              Clear comparison
            </Button>
          </div>
        ) : null}
      </section>
    </PageShell>
  );
}
