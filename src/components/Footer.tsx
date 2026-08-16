import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import logo from "@/assets/logo.png";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border/70 bg-sand/60">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="sm:col-span-2">
          <img
            src={logo}
            alt="Swahili Design Lab"
            loading="lazy"
            width={1152}
            height={576}
            className="h-11 w-auto"
          />
          <p className="mt-5 max-w-xs text-sm text-muted-foreground">
            Sustainable Fashion. Responsible Design.
          </p>
          <a
            href="https://swahilidesignlab.co.ke"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            swahilidesignlab.co.ke
          </a>
          <div className="mt-6 flex gap-3">
            {[
              { Icon: Instagram, label: "Instagram" },
              { Icon: Facebook, label: "Facebook" },
              { Icon: Linkedin, label: "LinkedIn" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="https://swahilidesignlab.co.ke"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 transition-colors hover:border-primary hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="eyebrow">Shop</h2>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <Link to="/shop" className="hover:text-primary">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/collections" className="hover:text-primary">
                Collections
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-primary">
                Cart
              </Link>
            </li>
            <li>
              <Link to="/account" className="hover:text-primary">
                My Account
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="eyebrow">Studio</h2>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <Link to="/about" className="hover:text-primary">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-primary">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-primary">
                Terms &amp; Conditions
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/70">
        <p className="mx-auto max-w-7xl px-5 py-6 text-xs text-muted-foreground lg:px-8">
          © {new Date().getFullYear()} Swahili Design Lab. Mombasa, Kenya.
        </p>
      </div>
    </footer>
  );
}
