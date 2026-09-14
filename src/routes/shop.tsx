import { createFileRoute } from "@tanstack/react-router";
import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader, PageShell } from "@/components/PageShell";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { allColours, allStorage, conditions, products } from "@/lib/products";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop iPhones — Mgwaba iStore" },
      {
        name: "description",
        content:
          "Browse every iPhone from XR to 17 Pro Max. Filter by model, price, storage, colour and condition.",
      },
      { property: "og:title", content: "Shop iPhones — Mgwaba iStore" },
      { property: "og:description", content: "Filter genuine iPhones by model, price, storage, colour and condition." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const [query, setQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(30000);
  const [storage, setStorage] = useState<string[]>([]);
  const [colours, setColours] = useState<string[]>([]);
  const [conds, setConds] = useState<string[]>([]);
  const [sort, setSort] = useState<"featured" | "low" | "high" | "new">("featured");
  const [showFilters, setShowFilters] = useState(false);

  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const filtered = useMemo(() => {
    const list = products.filter((p) => {
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (p.price > maxPrice) return false;
      if (storage.length && !p.storage.some((s) => storage.includes(s))) return false;
      if (colours.length && !p.colours.some((c) => colours.includes(c))) return false;
      if (conds.length && !conds.includes(p.condition)) return false;
      return true;
    });
    if (sort === "low") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") return [...list].sort((a, b) => b.price - a.price);
    if (sort === "new") return [...list].sort((a, b) => b.year - a.year);
    return list;
  }, [query, maxPrice, storage, colours, conds, sort]);

  const FilterPanel = (
    <div className="space-y-7">
      <div>
        <Label className="text-xs uppercase tracking-widest text-muted-foreground">Model</Label>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. iPhone 15 Pro"
          className="mt-2"
        />
      </div>
      <div>
        <Label className="text-xs uppercase tracking-widest text-muted-foreground">
          Max price · R{maxPrice.toLocaleString("en-ZA")}
        </Label>
        <Slider
          className="mt-4"
          min={4000}
          max={30000}
          step={500}
          value={[maxPrice]}
          onValueChange={(v) => setMaxPrice(v[0] ?? 30000)}
        />
      </div>
      <div>
        <Label className="text-xs uppercase tracking-widest text-muted-foreground">Storage</Label>
        <div className="mt-3 grid gap-2">
          {allStorage.map((s) => (
            <label key={s} className="flex items-center gap-2 text-sm">
              <Checkbox checked={storage.includes(s)} onCheckedChange={() => toggle(storage, setStorage, s)} />
              {s}
            </label>
          ))}
        </div>
      </div>
      <div>
        <Label className="text-xs uppercase tracking-widest text-muted-foreground">Condition</Label>
        <div className="mt-3 grid gap-2">
          {conditions.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm">
              <Checkbox checked={conds.includes(c)} onCheckedChange={() => toggle(conds, setConds, c)} />
              {c}
            </label>
          ))}
        </div>
      </div>
      <div>
        <Label className="text-xs uppercase tracking-widest text-muted-foreground">Colour</Label>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {allColours.map((c) => (
            <button
              key={c}
              onClick={() => toggle(colours, setColours, c)}
              className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                colours.includes(c)
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:bg-accent"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setQuery("");
          setMaxPrice(30000);
          setStorage([]);
          setColours([]);
          setConds([]);
        }}
      >
        Clear all filters
      </Button>
    </div>
  );

  return (
    <PageShell>
      <PageHeader
        eyebrow="Shop"
        title="Every iPhone in stock"
        subtitle="Filter by model, price, storage, colour and condition to find your perfect device."
      />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="surface sticky top-24 p-6">{FilterPanel}</div>
        </aside>

        <div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
            <p className="min-w-0 truncate text-sm text-muted-foreground">
              Showing {filtered.length} of {products.length} devices
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                onClick={() => setShowFilters((v) => !v)}
              >
                <SlidersHorizontal className="mr-1.5 h-4 w-4" />
                Filters
              </Button>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-sm"
              >
                <option value="featured">Featured</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="new">Newest</option>
              </select>
            </div>
          </div>

          {showFilters ? <div className="surface mt-5 p-6 lg:hidden">{FilterPanel}</div> : null}

          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
          {filtered.length === 0 ? (
            <p className="py-20 text-center text-muted-foreground">
              No iPhones match those filters. Try widening your price range.
            </p>
          ) : null}
        </div>
      </div>
    </PageShell>
  );
}
