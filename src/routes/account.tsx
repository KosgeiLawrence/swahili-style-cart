import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { formatKES } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account | Swahili Design Lab" },
      {
        name: "description",
        content:
          "Manage your Swahili Design Lab profile, review your order history and track the status of your order requests.",
      },
      { property: "og:title", content: "My Account | Swahili Design Lab" },
      { property: "og:description", content: "Profile, orders and account settings." },
      { property: "og:url", content: "/account" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/account" }],
  }),
  component: AccountPage,
});

const field =
  "h-12 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none focus:border-primary";

const tabs = ["Profile", "My Orders", "Account Settings"] as const;

function AccountPage() {
  const { user, logout, orders, updateProfile, ready } = useStore();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Profile");

  if (!ready) return <div className="min-h-[50vh]" />;

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-5 py-20 text-center lg:px-8">
        <h1 className="editorial text-3xl">My Account</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Sign in to view your orders and manage your details.
        </p>
        <Link
          to="/auth"
          className="mt-7 inline-flex rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground"
        >
          Log in or create an account
        </Link>
      </div>
    );
  }

  const onSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    updateProfile({
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
    });
    toast.success("Profile updated");
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 lg:px-8">
      <p className="eyebrow">My Account</p>
      <h1 className="editorial mt-3 text-4xl sm:text-5xl">Hello, {user.name.split(" ")[0]}</h1>

      <div className="mt-9 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`h-11 rounded-full border px-5 text-sm font-medium transition-colors ${
              tab === t ? "border-primary text-primary" : "border-border"
            }`}
          >
            {t}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            logout();
            toast.success("Logged out");
          }}
          className="h-11 rounded-full border border-border px-5 text-sm font-medium hover:border-destructive hover:text-destructive"
        >
          Logout
        </button>
      </div>

      {tab === "Profile" && (
        <div className="glass mt-8 rounded-2xl p-6 sm:p-8">
          <h2 className="text-base font-semibold">Profile</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex gap-6">
              <dt className="w-28 text-muted-foreground">Name</dt>
              <dd>{user.name}</dd>
            </div>
            <div className="flex gap-6">
              <dt className="w-28 text-muted-foreground">Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div className="flex gap-6">
              <dt className="w-28 text-muted-foreground">Phone</dt>
              <dd>{user.phone || "Not added"}</dd>
            </div>
            <div className="flex gap-6">
              <dt className="w-28 text-muted-foreground">Orders</dt>
              <dd>{orders.length}</dd>
            </div>
          </dl>
        </div>
      )}

      {tab === "My Orders" && (
        <div className="mt-8 space-y-4">
          {orders.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <h2 className="text-base font-semibold">No orders yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Your order history will appear here once you place your first request.
              </p>
              <Link
                to="/shop"
                className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
              >
                Start shopping
              </Link>
            </div>
          ) : (
            orders.map((o) => (
              <article key={o.reference} className="rounded-2xl border border-border/60 bg-card p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{o.reference}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(o.createdAt).toLocaleDateString("en-KE", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium">
                    {o.status}
                  </span>
                </div>
                <ul className="mt-5 space-y-2 text-sm">
                  {o.items.map((i) => (
                    <li key={`${i.slug}-${i.option ?? ""}`} className="flex justify-between gap-4">
                      <span className="text-muted-foreground">
                        {i.name}
                        {i.option ? ` (${i.option})` : ""} × {i.qty}
                      </span>
                      <span>{formatKES(i.price * i.qty)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-between border-t border-border pt-4 text-sm font-semibold">
                  <span>Total</span>
                  <span>{formatKES(o.total)}</span>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Delivery to {o.customer.location}, {o.customer.county}
                </p>
              </article>
            ))
          )}
        </div>
      )}

      {tab === "Account Settings" && (
        <form onSubmit={onSave} className="glass mt-8 max-w-lg rounded-2xl p-6 sm:p-8">
          <h2 className="text-base font-semibold">Account settings</h2>
          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium">
                Full name
              </label>
              <input id="name" name="name" defaultValue={user.name} className={`${field} mt-2`} />
            </div>
            <div>
              <label htmlFor="phone" className="text-sm font-medium">
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={user.phone ?? ""}
                className={`${field} mt-2`}
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input id="email" value={user.email} readOnly className={`${field} mt-2 opacity-60`} />
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground"
          >
            Save changes
          </button>
        </form>
      )}
    </div>
  );
}
