import { Link, createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCircle2, Package, Truck } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/order-success")({
  validateSearch: (search: Record<string, unknown>) => ({
    order: typeof search["order"] === "string" ? search["order"] : "MG-000000",
    method: typeof search["method"] === "string" ? search["method"] : "card",
  }),
  head: () => ({
    meta: [
      { title: "Order Confirmed — Mgwaba iStore" },
      { name: "description", content: "Your iPhone order is confirmed. Track your delivery and view your order receipt." },
      { property: "og:title", content: "Order Confirmed — Mgwaba iStore" },
      { property: "og:description", content: "Thank you for your order at Mgwaba iStore." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderSuccess,
});

function OrderSuccess() {
  const { order, method } = Route.useSearch();
  const eta = new Date(Date.now() + 3 * 86400000).toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const notifications =
    method === "eft"
      ? ["Payment Received", "Awaiting Verification", "Order Processing", "Order Shipped"]
      : ["Payment Verified", "Order Processing", "Preparing Your iPhone", "Order Shipped"];

  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-32 sm:px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="surface p-10 text-center sm:p-14">
          <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
          <h1 className="mt-6 text-3xl font-semibold sm:text-4xl">Thank you for your order</h1>
          <p className="mt-3 text-muted-foreground">
            {method === "eft"
              ? "Your order will be processed once your payment has been verified."
              : "Payment approved — we're preparing your iPhone for dispatch."}
          </p>

          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border p-5">
              <dt className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Package className="h-3.5 w-3.5" /> Order number
              </dt>
              <dd className="mt-1 font-display text-lg font-semibold">{order}</dd>
            </div>
            <div className="rounded-2xl border border-border p-5">
              <dt className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Truck className="h-3.5 w-3.5" /> Estimated delivery
              </dt>
              <dd className="mt-1 font-display text-lg font-semibold">{eta}</dd>
            </div>
          </dl>

          <ul className="mt-8 space-y-2 text-left text-sm text-muted-foreground">
            {notifications.map((n, i) => (
              <li key={n} className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5">
                <CheckCircle2 className={i === 0 ? "h-4 w-4 text-success" : "h-4 w-4 opacity-30"} />
                {n}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-full px-7">
              <Link to="/contact">Track Order</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-7">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </PageShell>
  );
}
