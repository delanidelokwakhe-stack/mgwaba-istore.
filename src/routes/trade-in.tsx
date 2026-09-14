import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader, PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { zar } from "@/lib/format";
import { products } from "@/lib/products";

export const Route = createFileRoute("/trade-in")({
  head: () => ({
    meta: [
      { title: "Trade-In Calculator — Mgwaba iStore" },
      { name: "description", content: "Estimate your iPhone trade-in value instantly based on model, storage, battery health and condition." },
      { property: "og:title", content: "Trade-In Calculator — Mgwaba iStore" },
      { property: "og:description", content: "Instant iPhone trade-in estimates with bonus upgrade discounts." },
    ],
  }),
  component: TradeIn,
});

const physical = { "Like New": 1, Excellent: 0.9, Good: 0.78, Fair: 0.6 } as const;
const screenCond = { Flawless: 1, "Minor scratches": 0.92, "Deep scratches": 0.82, Cracked: 0.55 } as const;

function TradeIn() {
  const [slug, setSlug] = useState(products[6]!.slug);
  const [storage, setStorage] = useState("128GB");
  const [battery, setBattery] = useState(90);
  const [cond, setCond] = useState<keyof typeof physical>("Excellent");
  const [screen, setScreen] = useState<keyof typeof screenCond>("Flawless");
  const [faceId, setFaceId] = useState(true);
  const [unlocked, setUnlocked] = useState(true);
  const [accessories, setAccessories] = useState(false);

  const device = products.find((p) => p.slug === slug)!;

  const result = useMemo(() => {
    const storageBoost = 1 + products[0]!.storage.length * 0 + (["512GB", "1TB", "2TB"].includes(storage) ? 0.1 : ["256GB"].includes(storage) ? 0.05 : 0);
    let value = device.tradeInValue * storageBoost;
    value *= physical[cond];
    value *= screenCond[screen];
    value *= 0.7 + (battery / 100) * 0.3;
    if (!faceId) value *= 0.7;
    if (!unlocked) value *= 0.85;
    if (accessories) value *= 1.03;
    const base = Math.round(value / 50) * 50;
    const bonus = cond === "Like New" || cond === "Excellent" ? 1000 : 500;
    return { base, bonus, total: base + bonus };
  }, [device, storage, battery, cond, screen, faceId, unlocked, accessories]);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Trade-In"
        title="Turn your old iPhone into discount"
        subtitle="Answer a few questions and get an instant estimate. Final value is confirmed after inspection."
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_400px]">
        <div className="surface space-y-7 p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <Label>Current iPhone Model</Label>
              <Select value={slug} onValueChange={(v) => setSlug(v)}>
                <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.slug} value={p.slug}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Storage Capacity</Label>
              <Select value={storage} onValueChange={setStorage}>
                <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["64GB", "128GB", "256GB", "512GB", "1TB", "2TB"].map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Battery Health · {battery}%</Label>
            <Slider
              className="mt-4"
              min={60}
              max={100}
              step={1}
              value={[battery]}
              onValueChange={(v) => setBattery(v[0] ?? 90)}
            />
          </div>

          <div>
            <Label>Physical Condition</Label>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(Object.keys(physical) as (keyof typeof physical)[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCond(c)}
                  className={`rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                    cond === c ? "border-foreground bg-foreground text-background" : "border-border hover:bg-accent"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Screen Condition</Label>
            <Select value={screen} onValueChange={(v) => setScreen(v as keyof typeof screenCond)}>
              <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.keys(screenCond).map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Face ID working", faceId, setFaceId] as const,
              ["Network unlocked", unlocked, setUnlocked] as const,
              ["Box & accessories", accessories, setAccessories] as const,
            ].map(([label, value, set]) => (
              <label key={label} className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3 text-sm">
                {label}
                <Switch checked={value} onCheckedChange={set} />
              </label>
            ))}
          </div>
        </div>

        <aside className="surface h-fit p-8 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">Your estimate</h2>
          <motion.p
            key={result.total}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 font-display text-4xl font-semibold"
          >
            {zar(result.total)}
          </motion.p>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Estimated trade-in value</dt>
              <dd>{zar(result.base)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Bonus trade-in discount</dt>
              <dd className="text-success">+{zar(result.bonus)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 font-medium">
              <dt>Final discount towards purchase</dt>
              <dd>{zar(result.total)}</dd>
            </div>
          </dl>
          <Button
            className="mt-7 w-full rounded-full"
            size="lg"
            onClick={() => toast.success("Trade-in quote requested — we'll WhatsApp you shortly.")}
          >
            Request Trade-In Quote
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            Estimates are indicative. Final value confirmed after a free in-store or courier inspection.
          </p>
        </aside>
      </section>
    </PageShell>
  );
}
