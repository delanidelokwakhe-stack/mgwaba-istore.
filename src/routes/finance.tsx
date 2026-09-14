import { Link, createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BadgeCheck, CreditCard, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader, PageShell } from "@/components/PageShell";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { zar } from "@/lib/format";

export const Route = createFileRoute("/finance")({
  head: () => ({
    meta: [
      { title: "Finance Options & Instalment Calculator — Mgwaba iStore" },
      { name: "description", content: "Split your iPhone into 3 to 24 monthly instalments. Calculate deposit, monthly payment and total payable." },
      { property: "og:title", content: "Finance Options — Mgwaba iStore" },
      { property: "og:description", content: "Buy Now Pay Later plans with an instant instalment calculator." },
    ],
  }),
  component: Finance,
});

const terms = [3, 6, 12, 18, 24];

function Finance() {
  const [price, setPrice] = useState(19499);
  const [deposit, setDeposit] = useState(3000);
  const [months, setMonths] = useState(12);
  const [rate, setRate] = useState(12);

  const calc = useMemo(() => {
    const balance = Math.max(0, price - deposit);
    const r = rate / 100 / 12;
    const payment = r === 0 ? balance / months : (balance * r) / (1 - Math.pow(1 + r, -months));
    const totalPayable = payment * months + deposit;
    return {
      balance,
      payment,
      totalPayable,
      interest: totalPayable - price,
    };
  }, [price, deposit, months, rate]);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Finance Options"
        title="Own it now, pay over time"
        subtitle="Flexible instalment plans on every iPhone we sell — transparent numbers, no surprises."
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_400px]">
        <div className="surface space-y-7 p-8">
          <h2 className="text-lg font-semibold">Instalment Calculator</h2>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="price">Product Price (R)</Label>
              <Input
                id="price"
                type="number"
                className="mt-2"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="deposit">Deposit Amount (R)</Label>
              <Input
                id="deposit"
                type="number"
                className="mt-2"
                value={deposit}
                onChange={(e) => setDeposit(Math.min(Number(e.target.value) || 0, price))}
              />
            </div>
          </div>

          <div>
            <Label>Number of Months</Label>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {terms.map((m) => (
                <button
                  key={m}
                  onClick={() => setMonths(m)}
                  className={`rounded-xl border py-2.5 text-sm transition-colors ${
                    months === m ? "border-foreground bg-foreground text-background" : "border-border hover:bg-accent"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Interest Rate (optional) · {rate}% p.a.</Label>
            <Slider
              className="mt-4"
              min={0}
              max={26}
              step={0.5}
              value={[rate]}
              onValueChange={(v) => setRate(v[0] ?? 12)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Deposit", zar(deposit)],
              ["Balance Remaining", zar(calc.balance)],
              ["Total Payable", zar(calc.totalPayable)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-border p-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 font-display text-lg font-semibold">{value}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Payment breakdown</p>
            <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-secondary">
              <motion.div
                className="bg-foreground"
                animate={{ width: `${(deposit / Math.max(calc.totalPayable, 1)) * 100}%` }}
                transition={{ duration: 0.6 }}
              />
              <motion.div
                className="bg-info"
                animate={{ width: `${(calc.balance / Math.max(calc.totalPayable, 1)) * 100}%` }}
                transition={{ duration: 0.6 }}
              />
              <motion.div
                className="bg-warning"
                animate={{ width: `${(Math.max(calc.interest, 0) / Math.max(calc.totalPayable, 1)) * 100}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span>■ Deposit</span>
              <span className="text-info">■ Capital</span>
              <span className="text-warning">■ Interest {zar(Math.max(calc.interest, 0))}</span>
            </div>
          </div>
        </div>

        <aside className="surface h-fit p-8 lg:sticky lg:top-24">
          <p className="text-sm text-muted-foreground">Your monthly payment</p>
          <motion.p
            key={Math.round(calc.payment)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 font-display text-4xl font-semibold"
          >
            {zar(calc.payment)}
          </motion.p>
          <p className="mt-1 text-sm text-muted-foreground">
            × {months} months after a {zar(deposit)} deposit
          </p>
          <Button asChild size="lg" className="mt-7 w-full rounded-full">
            <Link to="/shop">Choose your iPhone</Link>
          </Button>
          <ul className="mt-7 space-y-3 text-sm text-muted-foreground">
            {["No paperwork for plans under 6 months", "Settle early with zero penalty", "Trade-in value reduces your deposit"].map((t) => (
              <li key={t} className="flex gap-2">
                <BadgeCheck className="h-4 w-4 shrink-0 text-success" />
                {t}
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="border-t border-border py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="Ways to pay" title="Four payment routes, one checkout" />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { icon: CreditCard, title: "Visa & Mastercard", text: "Debit and credit cards, 3D Secure verified, instant approval." },
              { icon: ShieldCheck, title: "Bank Transfer (EFT)", text: "Pay manually and upload proof — we verify within business hours." },
              { icon: BadgeCheck, title: "Instalments", text: "3 to 24 months with a deposit from 10% of the device price." },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 0.06}>
                <div className="surface lift h-full p-7">
                  <c.icon className="h-6 w-6" />
                  <h3 className="mt-4 text-base font-semibold">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
