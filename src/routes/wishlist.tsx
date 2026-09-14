import { Link, createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageShell } from "@/components/PageShell";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your Wishlist — Mgwaba iStore" },
      { name: "description", content: "iPhones you've saved for later at Mgwaba iStore." },
      { property: "og:title", content: "Your Wishlist — Mgwaba iStore" },
      { property: "og:description", content: "Saved iPhones, ready when you are." },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  const { wishlist } = useStore();
  const items = products.filter((p) => wishlist.includes(p.slug));

  return (
    <PageShell>
      <PageHeader
        eyebrow="Wishlist"
        title="Saved for later"
        subtitle="Your shortlist of iPhones, stored right here in this browser."
      />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        {items.length === 0 ? (
          <div className="surface p-16 text-center">
            <p className="text-muted-foreground">You haven't saved any iPhones yet.</p>
            <Button asChild className="mt-6 rounded-full">
              <Link to="/shop">Browse iPhones</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
