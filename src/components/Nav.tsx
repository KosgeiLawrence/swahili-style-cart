import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import logo from "@/assets/logo.png";
import { useStore } from "@/lib/store";

const adminLink = { to: "/admin", label: "Admin" };

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { cartCount, user, site } = useStore();
  const links = [...site.menu, ...(user?.isAdmin ? [adminLink] : [])];
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-50">
      <div className="glass-strong border-x-0 border-t-0">
        <nav
          aria-label="Main"
          className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:h-20 lg:px-8"
        >
          <Link to="/" className="shrink-0" aria-label="Swahili Design Lab home">
            <img
              src={logo}
              alt="Swahili Design Lab"
              width={1152}
              height={576}
              className="h-10 w-auto sm:h-14"
            />
          </Link>

          <ul className="hidden items-center gap-8 lg:flex">
            {links.map((l) => {
              const active = pathname === l.to;
              return (
                <li key={l.to}>
                  <Link
                    to={l.to as "/"}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      active ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/account"
              aria-label="My account"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-border/70 transition-colors hover:border-primary hover:text-primary sm:flex lg:hidden"
            >
              <User className="h-4 w-4" />
            </Link>
            <Link
              to="/cart"
              aria-label={`Cart, ${cartCount} items`}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border/70 transition-colors hover:border-primary hover:text-primary"
            >
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              to={site.ctaTo as "/"}
              className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 md:inline-flex"
            >
              {site.ctaLabel}
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 lg:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </div>

      {open && (
        <div className="glass-strong border-x-0 border-t-0 lg:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col px-5 py-3">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to as "/"}
                  onClick={() => setOpen(false)}
                  className={`block border-b border-border/50 py-4 text-base font-medium ${
                    pathname === l.to ? "text-primary" : "text-foreground"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="py-4">
              <Link
                to={site.ctaTo as "/"}
                onClick={() => setOpen(false)}
                className="block rounded-full bg-primary px-5 py-3 text-center text-sm font-medium text-primary-foreground"
              >
                {site.ctaLabel}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
