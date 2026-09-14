import { Star } from "lucide-react";
import type { StockStatus } from "@/lib/products";
import { cn } from "@/lib/utils";

export function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i <= Math.round(rating) ? "fill-warning text-warning" : "text-muted-foreground/40",
          )}
        />
      ))}
    </span>
  );
}

const stockStyles: Record<StockStatus, string> = {
  "In Stock": "bg-success/12 text-success border-success/30",
  "Low Stock": "bg-warning/12 text-warning border-warning/30",
  "Sold Out": "bg-destructive/12 text-destructive border-destructive/30",
  "Coming Soon": "bg-info/12 text-info border-info/30",
};

const dot: Record<StockStatus, string> = {
  "In Stock": "bg-success",
  "Low Stock": "bg-warning",
  "Sold Out": "bg-destructive",
  "Coming Soon": "bg-info",
};

export function StockBadge({ status, qty }: { status: StockStatus; qty?: number }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        stockStyles[status],
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dot[status])} />
      {status}
      {status === "Low Stock" && qty !== undefined ? ` · ${qty} left` : ""}
    </span>
  );
}
