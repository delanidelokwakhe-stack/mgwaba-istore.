import { Banknote, CreditCard, Wallet } from "lucide-react";
import type { PaymentMethod } from "@/services/paymentService";
import { cn } from "@/lib/utils";

const methods: { id: PaymentMethod; icon: typeof CreditCard; title: string; text: string }[] = [
  {
    id: "card",
    icon: CreditCard,
    title: "💳 Pay with Card",
    text: "Visa, Mastercard, debit & credit — instant confirmation",
  },
  {
    id: "eft",
    icon: Banknote,
    title: "🏦 Bank Transfer (EFT)",
    text: "Pay manually and upload your proof of payment",
  },
  {
    id: "instalment",
    icon: Wallet,
    title: "📆 Instalment Plan",
    text: "Split into 3–24 monthly payments",
  },
];

export function PaymentMethods({
  value,
  onChange,
}: {
  value: PaymentMethod;
  onChange: (m: PaymentMethod) => void;
}) {
  return (
    <div className="grid gap-3">
      {methods.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => onChange(m.id)}
          className={cn(
            "flex items-center gap-4 rounded-2xl border p-5 text-left transition-all",
            value === m.id ? "border-foreground bg-accent" : "border-border hover:bg-accent/50",
          )}
        >
          <m.icon className="h-5 w-5 shrink-0" />
          <div className="min-w-0">
            <p className="font-medium">{m.title}</p>
            <p className="text-sm text-muted-foreground">{m.text}</p>
          </div>
          <span
            className={cn(
              "ml-auto h-4 w-4 shrink-0 rounded-full border",
              value === m.id ? "border-8 border-foreground" : "border-border",
            )}
          />
        </button>
      ))}
    </div>
  );
}
