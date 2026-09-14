import { motion } from "framer-motion";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import type { ReactNode } from "react";

export function PaymentStatusScreen({
  status,
  reference,
  message,
  actions,
}: {
  status: "approved" | "pending" | "failed";
  reference: string;
  message: string;
  actions?: ReactNode;
}) {
  const config = {
    approved: {
      icon: CheckCircle2,
      tone: "text-success",
      title: "✅ Payment Approved",
      lines: ["Order Confirmed", "Preparing Your iPhone", "Tracking details will be sent shortly"],
    },
    pending: {
      icon: Clock,
      tone: "text-warning",
      title: "⏳ Payment Processing",
      lines: ["Please wait while we confirm your transaction."],
    },
    failed: {
      icon: XCircle,
      tone: "text-destructive",
      title: "❌ Payment Failed",
      lines: ["Please check your card details or try another payment method."],
    },
  }[status];

  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45 }}
      className="surface p-10 text-center"
    >
      <Icon className={`mx-auto h-14 w-14 ${config.tone}`} />
      <h2 className="mt-5 text-2xl font-semibold">{config.title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      <ul className="mt-5 space-y-1 text-sm text-muted-foreground">
        {config.lines.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
      <p className="mt-6 text-xs uppercase tracking-widest text-muted-foreground">
        Reference {reference}
      </p>
      {actions ? <div className="mt-7 flex flex-wrap justify-center gap-3">{actions}</div> : null}
    </motion.div>
  );
}
