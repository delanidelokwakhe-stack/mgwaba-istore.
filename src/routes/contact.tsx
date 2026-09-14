import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Mgwaba iStore — WhatsApp, Email & Store Location" },
      {
        name: "description",
        content:
          "Reach Mgwaba iStore on WhatsApp, by phone or email. Store location, business hours and enquiry form.",
      },
      { property: "og:title", content: "Contact Mgwaba iStore" },
      {
        property: "og:description",
        content: "WhatsApp, phone, email and store location for Mgwaba iStore.",
      },
    ],
  }),
  component: Contact,
});

const hours = [
  ["Monday – Friday", "08:30 – 18:00"],
  ["Saturday", "09:00 – 15:00"],
  ["Sunday", "10:00 – 13:00"],
  ["Public Holidays", "Closed"],
];

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  return (
    <PageShell>
      <PageHeader
        eyebrow="Contact"
        title="We're here to help"
        subtitle="Stock checks, quotations, trade-ins or after-sales support — reach us however you prefer."
      />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2">
        <div className="space-y-5">
          <Reveal>
            <a
              href="https://wa.me/27673676855"
              target="_blank"
              rel="noreferrer"
              className="surface lift flex items-center gap-4 p-6"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#25D366] text-white">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold">Chat on WhatsApp</p>
                <p className="text-sm text-muted-foreground">+27 67 367 6855 · fastest response</p>
              </div>
            </a>
          </Reveal>

          {[
            { icon: Phone, title: "Call us", value: "+27 67 367 6855", href: "tel:+27673676855" },
            {
              icon: Mail,
              title: "Email",
              value: "mgwabawebsolutions@gmail.com",
              href: "mailto:mgwabawebsolutions@gmail.com",
            },
            {
              icon: MapPin,
              title: "Store location",
              value: "Shop 14, Anton Lembede Street, Durban CBD, 4001",
              href: "#map",
            },
          ].map((c, i) => (
            <Reveal key={c.title} delay={0.05 * (i + 1)}>
              <a href={c.href} className="surface lift flex items-center gap-4 p-6">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-secondary">
                  <c.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold">{c.title}</p>
                  <p className="truncate text-sm text-muted-foreground">{c.value}</p>
                </div>
              </a>
            </Reveal>
          ))}

          <Reveal delay={0.25}>
            <div className="surface p-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <p className="font-semibold">Business hours</p>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                {hours.map(([d, t]) => (
                  <div key={d} className="flex justify-between">
                    <dt className="text-muted-foreground">{d}</dt>
                    <dd>{t}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>

        <div className="space-y-5">
          <Reveal>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
                  toast.error("Please complete every field.");
                  return;
                }
                toast.success("Message sent — we'll get back to you within one business day.");
                setForm({ name: "", email: "", message: "" });
              }}
              className="surface space-y-5 p-8"
            >
              <h2 className="text-lg font-semibold">Send us a message</h2>
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  maxLength={100}
                  className="mt-2"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  maxLength={255}
                  className="mt-2"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="message">How can we help?</Label>
                <Textarea
                  id="message"
                  rows={5}
                  maxLength={1000}
                  className="mt-2"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>
              <Button type="submit" size="lg" className="w-full rounded-full">
                Send message
              </Button>
            </form>
          </Reveal>

          <Reveal delay={0.1}>
            <div id="map" className="surface overflow-hidden">
              <div className="grid h-64 place-items-center bg-secondary text-center">
                <div>
                  <MapPin className="mx-auto h-7 w-7 text-muted-foreground" />
                  <p className="mt-3 text-sm font-medium">Google Maps</p>
                  <p className="text-xs text-muted-foreground">
                    Shop 14, Anton Lembede Street, Durban CBD
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
