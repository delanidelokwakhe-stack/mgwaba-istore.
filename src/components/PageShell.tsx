import type { ReactNode } from "react";
import { BackToTop } from "@/components/BackToTop";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <BackToTop />
      <WhatsAppWidget />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <section className="hero-glow border-b border-border pb-14 pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">{subtitle}</p>
      </div>
    </section>
  );
}
