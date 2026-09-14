import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BadgeCheck, Loader2, Lock, ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, PageShell } from "@/components/PageShell";
import { BankTransfer } from "@/components/payment/BankTransfer";
import { PaymentStatusScreen } from "@/components/payment/PaymentSuccess";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zar } from "@/lib/format";
import { products } from "@/lib/products";
import { useStore } from "@/lib/store";
import { generateOrderNumber, submitEftProof, type PaymentResult } from "@/services/paymentService";
import { createOrder, uploadOrderProof } from "@/services/orderService";
import { sendOrderEmails } from "@/services/emailService";

import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Secure Checkout — Mgwaba iStore" },
      {
        name: "description",
        content:
          "Complete your iPhone order securely with bank transfer (EFT) payment.",
      },
      { property: "og:title", content: "Secure Checkout — Mgwaba iStore" },
      {
        property: "og:description",
        content: "Secure checkout with bank transfer (EFT) payment and proof of payment.",
      },
    ],
  }),
  component: Checkout,
});

const steps = [
  "Customer Information",
  "Delivery Address",
  "Shipping Method",
  "Payment Method",
  "Order Review",
  "Order Confirmation",
];

const shipping = [
  { id: "standard", name: "Standard Courier", time: "2–4 business days", price: 120 },
  { id: "express", name: "Express Courier", time: "1–2 business days", price: 249 },
  { id: "collect", name: "Store Collection", time: "Ready in 2 hours", price: 0 },
];

function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useStore();
  const [step, setStep] = useState(0);
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [address, setAddress] = useState({ line1: "", suburb: "", city: "", postal: "" });
  const [ship, setShip] = useState("standard");
  const method = "eft";
  const [proof, setProof] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [orderNumber] = useState(generateOrderNumber());

  const shipOption = shipping.find((s) => s.id === ship)!;
  const deliveryFee = cartTotal >= 10000 && ship === "standard" ? 0 : shipOption.price;
  const total = cartTotal + deliveryFee;
  const active = cart.filter((i) => !i.savedForLater);

  const next = () => {
    if (step === 0 && (!customer.name.trim() || !customer.email.trim() || !customer.phone.trim())) {
      toast.error("Please complete your contact details.");
      return;
    }
    if (step === 1 && (!address.line1.trim() || !address.city.trim() || !address.postal.trim())) {
      toast.error("Please complete your delivery address.");
      return;
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const pay = async () => {
  if (active.length === 0) {
    toast.error("Your cart is empty.");
    return;
  }

  if (!proof) {
    toast.error("Please upload your proof of payment.");
    setStep(3);
    return;
  }

  setProcessing(true);

    try {
    // EFT ONLY
      const res: PaymentResult = await submitEftProof(proof, orderNumber);

    if (res.status === "failed") {
        setProcessing(false);
        setResult(res);
        setStep(5);
        return;
      }

    // Upload EFT proof to Supabase Storage
      const proofOfPaymentPath = await uploadOrderProof(proof, orderNumber);

    // Create the real Supabase order
      const order = await createOrder({
        orderNumber,

        customer: {
          name: customer.name.trim(),
          email: customer.email.trim(),
          phone: customer.phone.trim(),
        },

        address: {
          line1: address.line1.trim(),
          suburb: address.suburb.trim(),
          city: address.city.trim(),
          postal: address.postal.trim(),
        },

        shippingMethod: shipOption.name,

        deliveryFee,

        // EFT ONLY
        paymentMethod: "eft",
        paymentStatus: "pending",
        orderStatus: "pending",

        paymentReference: res.reference,
        proofOfPaymentPath,

        items: active.map((item) => {
          const product = products.find((p) => p.slug === item.slug);

          if (!product) {
            throw new Error(`Product "${item.slug}" could not be found.`);
          }

          return {
            slug: product.slug,
            storage: item.storage,
            colour: item.colour,
            qty: item.qty,
          };
        }),
      });

    /*
     * KEEP YOUR EXISTING EMAILJS CODE HERE.
       *
       * Do NOT remove or replace your working
     * sendOrderEmails(...) section.
     */

      try {
        await sendOrderEmails({
          order_number: order.orderNumber,
          customer_name: customer.name.trim(),
          customer_email: customer.email.trim(),
          customer_phone: customer.phone.trim(),

          delivery_line1: address.line1.trim(),
          delivery_suburb: address.suburb.trim(),
          delivery_city: address.city.trim(),
          delivery_postal: address.postal.trim(),

          shipping_method: shipOption.name,

          subtotal: cartTotal,
          delivery_fee: deliveryFee,
          total,

          payment_method: "eft",
          payment_status: "pending",

          order_items: active
            .map((item) => {
              const product = products.find((p) => p.slug === item.slug);

              if (!product) {
                console.error(`Email notification: product "${item.slug}" could not be found.`);
                return null;
              }

              return {
                product_name: product.name,
                storage: item.storage,
                colour: item.colour,
                quantity: item.qty,
                unit_price: product.price,
                line_total: product.price * item.qty,
              };
            })
            .filter(
              (
                item,
              ): item is {
                product_name: string;
                storage: string;
                colour: string;
                quantity: number;
                unit_price: number;
                line_total: number;
              } => item !== null,
            ),
        });
      } catch (emailError) {
        console.error("Order email notification failed:", emailError);
      }

      // Clear cart after successful order creation
      clearCart();

      setProcessing(false);
      setResult(res);
      setStep(5);

      void navigate({
        to: "/order-success",
        search: {
          order: order.orderNumber,
          method: "eft",
        },
      });
    } catch (error) {
      console.error("EFT order failed:", error);

      setProcessing(false);

      toast.error(error instanceof Error ? error.message : "Unable to complete your EFT order.");
    }
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Checkout"
        title="Secure checkout"
        subtitle="Six quick steps between you and your new iPhone."
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* Stepper */}
        <ol className="surface mb-8 flex flex-wrap gap-3 p-5 text-xs">
          {steps.map((s, i) => (
            <li
              key={s}
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1.5",
                i === step
                  ? "bg-foreground text-background"
                  : i < step
                    ? "text-success"
                    : "text-muted-foreground",
              )}
            >
              <span className="font-semibold">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="surface p-8"
          >
            {step === 0 ? (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold">Customer Information</h2>
                <div>
                  <Label htmlFor="cname">Full name</Label>
                  <Input id="cname" maxLength={100} className="mt-2" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="cemail">Email</Label>
                    <Input id="cemail" type="email" maxLength={255} className="mt-2" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="cphone">Mobile number</Label>
                    <Input id="cphone" maxLength={20} className="mt-2" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
                  </div>
                </div>
              </div>
            ) : null}

            {step === 1 ? (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold">Delivery Address</h2>
                <div>
                  <Label htmlFor="line1">Street address</Label>
                  <Input id="line1" maxLength={200} className="mt-2" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {(["suburb", "city", "postal"] as const).map((f) => (
                    <div key={f}>
                      <Label htmlFor={f} className="capitalize">{f === "postal" ? "Postal code" : f}</Label>
                      <Input id={f} maxLength={80} className="mt-2" value={address[f]} onChange={(e) => setAddress({ ...address, [f]: e.target.value })} />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Shipping Method</h2>
                {shipping.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setShip(s.id)}
                    className={cn(
                      "flex w-full items-center justify-between gap-4 rounded-2xl border p-5 text-left transition-colors",
                      ship === s.id ? "border-foreground bg-accent" : "border-border hover:bg-accent/50",
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block font-medium">{s.name}</span>
                      <span className="block text-sm text-muted-foreground">{s.time}</span>
                    </span>
                    <span className="shrink-0 text-sm font-medium">
                      {s.price === 0 || (s.id === "standard" && cartTotal >= 10000) ? "Free" : zar(s.price)}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-7">
                <h2 className="text-lg font-semibold">Payment Method</h2>

                <div className="rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-success" />

                    <div>
                      <p className="font-medium">Bank Transfer (EFT)</p>

                      <p className="text-sm text-muted-foreground">
                        Pay by EFT and upload your proof of payment.
                      </p>
                    </div>
                  </div>
                </div>

                <BankTransfer orderNumber={orderNumber} onFileChange={setProof} />
              </div>
            ) : null}
            {step === 4 ? (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Order Review</h2>
                <dl className="grid gap-4 text-sm sm:grid-cols-2">
                  <div className="rounded-2xl border border-border p-4">
                    <dt className="text-xs text-muted-foreground">Customer</dt>
                    <dd className="mt-1">{customer.name || "—"}<br />{customer.email}<br />{customer.phone}</dd>
                  </div>
                  <div className="rounded-2xl border border-border p-4">
                    <dt className="text-xs text-muted-foreground">Delivery</dt>
                    <dd className="mt-1">{address.line1}<br />{address.suburb} {address.city}<br />{address.postal}</dd>
                  </div>
                  <div className="rounded-2xl border border-border p-4">
                    <dt className="text-xs text-muted-foreground">Shipping</dt>
                    <dd className="mt-1">{shipOption.name} · {shipOption.time}</dd>
                  </div>
                  <div className="rounded-2xl border border-border p-4">
                    <dt className="text-xs text-muted-foreground">Payment</dt>
                    <dd className="mt-1">Bank Transfer (EFT)</dd>
                  </div>
                </dl>
                <Button size="lg" className="w-full rounded-full" disabled={processing || active.length === 0} onClick={() => void pay()}>
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting order…
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                        Place EFT Order — {zar(total)}
                    </>
                  )}
                </Button>
              </div>
            ) : null}

            {step === 5 && result ? (
              <PaymentStatusScreen
                status={result.status}
                reference={result.reference}
                message={result.message}
                actions={
                  result.status === "failed" ? (
                    <Button onClick={() => setStep(3)}>Try another method</Button>
                  ) : (
                    <Button asChild variant="outline">
                      <Link to="/shop">Continue Shopping</Link>
                    </Button>
                  )
                }
              />
            ) : null}

            {step < 4 ? (
              <div className="mt-8 flex justify-between">
                <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
                  Back
                </Button>
                <Button className="rounded-full px-7" onClick={next}>
                  Continue
                </Button>
              </div>
            ) : null}
          </motion.div>

          <aside className="space-y-5">
            <div className="surface p-7">
              <h2 className="text-lg font-semibold">Order summary</h2>
              <ul className="mt-5 space-y-3 text-sm">
                {active.map((item, i) => {
                  const p = products.find((x) => x.slug === item.slug);
                  if (!p) return null;
                  return (
                    <li key={i} className="flex justify-between gap-4">
                      <span className="min-w-0">
                        {p.name} <span className="text-muted-foreground">×{item.qty}</span>
                        <span className="block text-xs text-muted-foreground">{item.storage} · {item.colour}</span>
                      </span>
                      <span className="shrink-0 font-medium">{zar(p.price * item.qty)}</span>
                    </li>
                  );
                })}
                {active.length === 0 ? (
                  <li className="text-muted-foreground">Your bag is empty.</li>
                ) : null}
              </ul>
              <dl className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd>{zar(cartTotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd>{deliveryFee === 0 ? "Free" : zar(deliveryFee)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                  <dt>Total</dt>
                  <dd>{zar(total)}</dd>
                </div>
              </dl>
            </div>

            <div className="surface p-7">
              <h3 className="font-semibold">Shop with confidence</h3>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                {[
                  [ShieldCheck, "Secure EFT payment"],
                  [BadgeCheck, "Genuine iPhones, IMEI verified"],
                  [Truck, "Fast insured delivery"],
                  [ShieldCheck, "Warranty support"],
                  [Lock, "Customer protection"],
                ].map(([Icon, label], i) => {
                  const I = Icon as typeof Lock;
                  return (
                    <li key={i} className="flex gap-2">
                      <I className="h-4 w-4 shrink-0 text-success" />
                      {label as string}
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
