import { Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  detectBrand,
  formatCardNumber,
  formatExpiry,
  type CardDetails,
} from "@/services/paymentService";
import { cn } from "@/lib/utils";

export function CardPayment({
  value,
  onChange,
}: {
  value: CardDetails;
  onChange: (c: CardDetails) => void;
}) {
  const [focused, setFocused] = useState(false);
  const brand = detectBrand(value.number);

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl border border-border bg-[linear-gradient(135deg,var(--spacegray),var(--color-background))] p-6 text-foreground transition-transform duration-500",
          focused && "scale-[1.02]",
        )}
      >
        <div className="flex items-start justify-between">
          <Lock className="h-5 w-5 opacity-70" />
          <span className="font-display text-sm font-semibold uppercase tracking-widest">
            {brand === "visa" ? "VISA" : brand === "mastercard" ? "Mastercard" : "Card"}
          </span>
        </div>
        <p className="mt-8 font-mono text-lg tracking-[0.18em]">
          {value.number || "•••• •••• •••• ••••"}
        </p>
        <div className="mt-6 flex justify-between text-xs uppercase tracking-widest opacity-80">
          <span>{value.name || "Cardholder Name"}</span>
          <span>{value.expiry || "MM/YY"}</span>
        </div>
      </div>

      <div className="grid gap-5">
        <div>
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            inputMode="numeric"
            placeholder="4242 4242 4242 4242"
            className="mt-2"
            value={value.number}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => onChange({ ...value, number: formatCardNumber(e.target.value) })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiry">MM / YY</Label>
            <Input
              id="expiry"
              inputMode="numeric"
              placeholder="09/29"
              className="mt-2"
              value={value.expiry}
              onChange={(e) => onChange({ ...value, expiry: formatExpiry(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              inputMode="numeric"
              maxLength={4}
              placeholder="123"
              className="mt-2"
              value={value.cvv}
              onChange={(e) =>
                onChange({ ...value, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })
              }
            />
          </div>
        </div>
        <div>
          <Label htmlFor="cardName">Cardholder Name</Label>
          <Input
            id="cardName"
            maxLength={100}
            className="mt-2"
            value={value.name}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="billing">Billing Address</Label>
          <Input
            id="billing"
            maxLength={200}
            className="mt-2"
            value={value.billingAddress}
            onChange={(e) => onChange({ ...value, billingAddress: e.target.value })}
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={value.saveCard}
            onCheckedChange={(c) => onChange({ ...value, saveCard: Boolean(c) })}
          />
          Save this card for faster checkout
        </label>
      </div>

      <div className="rounded-2xl border border-border bg-secondary/50 p-5">
        <p className="flex items-center gap-2 text-sm font-medium">
          <ShieldCheck className="h-4 w-4 text-success" />
          Your card details are protected with secure encryption.
        </p>
        <ul className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
          {[
            "🔒 SSL Secure Checkout",
            "🔒 PCI DSS Compliant Processing",
            "🔒 3D Secure Authentication",
            "🔒 Fraud Protection & Encryption",
          ].map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
