import { Link, useNavigate } from "@tanstack/react-router";
import { Search, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { zar } from "@/lib/format";
import { products } from "@/lib/products";

const popular = ["iPhone 15 Pro", "iPhone 13", "iPhone 12", "256GB", "Brand New", "Under R10 000"];

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products.slice(0, 6);
    return products
      .filter((p) =>
        [p.name, p.condition, p.stock, ...p.storage, ...p.colours, String(p.price)]
          .join(" ")
          .toLowerCase()
          .includes(q),
      )
      .slice(0, 8);
  }, [query]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search by model, storage, colour, price or condition…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No iPhones matched that search.</CommandEmpty>
        <CommandGroup heading="Popular searches">
          <div className="flex flex-wrap gap-2 px-2 py-2">
            {popular.map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term.replace("Under R10 000", ""))}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent"
              >
                <TrendingUp className="mr-1 inline h-3 w-3" />
                {term}
              </button>
            ))}
          </div>
        </CommandGroup>
        <CommandGroup heading="Devices">
          {results.map((p) => (
            <CommandItem
              key={p.slug}
              value={p.name}
              onSelect={() => {
                onOpenChange(false);
                void navigate({ to: "/product/$slug", params: { slug: p.slug } });
              }}
              className="flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                {p.name}
                <span className="text-xs text-muted-foreground">
                  {p.condition} · {p.stock}
                </span>
              </span>
              <span className="text-sm font-medium">{zar(p.price)}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Quick links">
          <CommandItem
            onSelect={() => {
              onOpenChange(false);
              void navigate({ to: "/shop" });
            }}
          >
            Browse all iPhones
          </CommandItem>
          <CommandItem
            onSelect={() => {
              onOpenChange(false);
              void navigate({ to: "/compare" });
            }}
          >
            Compare iPhones
          </CommandItem>
          <CommandItem
            onSelect={() => {
              onOpenChange(false);
              void navigate({ to: "/finance" });
            }}
          >
            Finance options
          </CommandItem>
        </CommandGroup>
      </CommandList>
      <div className="hidden">
        <Link to="/shop">Shop</Link>
      </div>
    </CommandDialog>
  );
}
