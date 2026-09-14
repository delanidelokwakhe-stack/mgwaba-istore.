import { Link } from "@tanstack/react-router";
import { Apple, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import logo from "@/assets/Mgwaba iStore LOGO.png";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="Mgwaba iStore"
              className="h-11 w-11 rounded-lg bg-white/95 p-0.5"
            />
            <span className="font-display text-base font-semibold">Mgwaba iStore</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Genuine Apple iPhones, quality tested and delivered nationwide. From iPhone XR to the
            iPhone 16 Pro.
          </p>
          <div className="mt-5 flex gap-2">
            {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social media"
                className="grid h-9 w-9 place-items-center rounded-full border border-border transition-colors hover:bg-accent"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Quick Links</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/shop" className="hover:text-foreground">
                Shop iPhones
              </Link>
            </li>
            <li>
              <Link to="/deals" className="hover:text-foreground">
                Deals
              </Link>
            </li>
            <li>
              <Link to="/compare" className="hover:text-foreground">
                Compare iPhones
              </Link>
            </li>
            <li>
              <Link to="/trade-in" className="hover:text-foreground">
                Trade-In Calculator
              </Link>
            </li>
            <li>
              <Link to="/finance" className="hover:text-foreground">
                Finance Options
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Support</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/contact" className="hover:text-foreground">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/delivery" className="hover:text-foreground">
                Delivery
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-foreground">
                FAQs
              </Link>
            </li>
            <li>
              <Link to="/reviews" className="hover:text-foreground">
                Reviews
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-foreground">
                Admin Portal
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Legal</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/privacy" className="hover:text-foreground">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-foreground">
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link to="/returns" className="hover:text-foreground">
                Returns Policy
              </Link>
            </li>
          </ul>
          <p className="mt-6 text-xs text-muted-foreground">
            Mgwaba iStore is an independent retailer and is not affiliated with Apple Inc.
          </p>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Mgwaba iStore. All rights reserved.
      </div>
    </footer>
  );
}
