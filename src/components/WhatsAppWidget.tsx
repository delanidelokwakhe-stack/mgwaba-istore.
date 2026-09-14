import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

const WHATSAPP = "27673676855"; // Mgwaba iStore WhatsApp number

const options = [
  "Ask about stock",
  "Request quotation",
  "Track order",
  "Trade-In enquiry",
  "Finance enquiry",
  "General support",
];

export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);

  const link = (topic: string) =>
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
      `Hi Mgwaba iStore 👋 I'd like help with: ${topic}`,
    )}`;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="glass w-[19rem] rounded-3xl p-4 shadow-[var(--shadow-lift)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Mgwaba iStore</p>
                <p className="text-xs text-success">● Typically replies in minutes</p>
              </div>
              <button aria-label="Close chat" onClick={() => setOpen(false)}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <p className="mt-3 rounded-2xl bg-secondary p-3 text-sm text-secondary-foreground">
              Hi there 👋 Welcome to Mgwaba iStore. How can we help you today?
            </p>
            <div className="mt-3 grid gap-1.5">
              {options.map((o) => (
                <a
                  key={o}
                  href={link(o)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-border px-3 py-2 text-sm transition-colors hover:bg-accent"
                >
                  {o}
                </a>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        aria-label="Chat on WhatsApp"
        onClick={() => setOpen((v) => !v)}
        className="bounce-nudge relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[var(--shadow-lift)] transition-transform hover:scale-105"
      >
        <MessageCircle className="h-6 w-6" />
        {!open ? (
          <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-destructive text-[11px] font-bold text-destructive-foreground">
            1
          </span>
        ) : null}
      </button>
    </div>
  );
}
