import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { formatKES, getProduct } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | Swahili Design Lab" },
      {
        name: "description",
        content:
          "Place an order request with Swahili Design Lab. Our team confirms availability, delivery and payment with you directly.",
      },
      { property: "og:title", content: "Checkout | Swahili Design Lab" },
      { property: "og:description", content: "Place your order request in one simple step." },
      { property: "og:url", content: "/checkout" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/checkout" }],
  }),
  component: Checkout,
});

const field =
  "h-12 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none focus:border-primary";

function Checkout() {
  const { cart, subtotal, placeOrder, user, ready } = useStore();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const lines = cart
    .map((i) => ({ item: i, product: getProduct(i.slug) }))
    .filter((l) => l.product);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (lines.length === 0) return;
    setSubmitting(true);
    const data = new FormData(e.currentTarget);
    const order = placeOrder({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      location: String(data.get("location") ?? ""),
      county: String(data.get("county") ?? ""),
      notes: String(data.get("notes") ?? ""),
    });
    navigate({ to: "/order/$reference", params: { reference: order.reference } });
  };

  if (ready && lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center lg:px-8">
        <h1 className="editorial text-3xl">Your cart is empty</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Add a piece to your cart before placing an order request.
        </p>
        <Link
          to="/shop"
          className="mt-7 inline-flex rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground"
        >
          Go to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
      <p className="eyebrow">Checkout</p>
      <h1 className="editorial mt-3 text-4xl sm:text-5xl">Place your order request</h1>
      <p className="mt-4 max-w-xl text-sm text-muted-foreground">
        No payment is taken here. Share your details and our team will contact you to confirm
        availability, delivery and payment.
      </p>

      <form onSubmit={onSubmit} className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full name
              </label>
              <input
                id="name"
                name="name"
                required
                defaultValue={user?.name ?? ""}
                autoComplete="name"
                className={`${field} mt-2`}
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                defaultValue={user?.email ?? ""}
                autoComplete="email"
                className={`${field} mt-2`}
              />
            </div>
            <div>
              <label htmlFor="phone" className="text-sm font-medium">
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                defaultValue={user?.phone ?? ""}
                autoComplete="tel"
                placeholder="07xx xxx xxx"
                className={`${field} mt-2`}
              />
            </div>
            <div>
              <label htmlFor="location" className="text-sm font-medium">
                Delivery location
              </label>
              <input
                id="location"
                name="location"
                required
                placeholder="Estate, street or pickup point"
                className={`${field} mt-2`}
              />
            </div>
            <div>
              <label htmlFor="county" className="text-sm font-medium">
                County / City
              </label>
              <input
                id="county"
                name="county"
                required
                placeholder="Mombasa"
                className={`${field} mt-2`}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Additional delivery notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                placeholder="Landmarks, preferred delivery time, sizing questions…"
                className="mt-2 w-full rounded-xl border border-border bg-card p-4 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <aside className="glass h-fit rounded-2xl p-6 lg:sticky lg:top-28">
          <h2 className="text-base font-semibold">Order summary</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {lines.map(({ item, product }) => (
              <li key={`${item.slug}-${item.option ?? ""}`} className="flex justify-between gap-4">
                <span className="text-muted-foreground">
                  {product!.name}
                  {item.option ? ` (${item.option})` : ""} × {item.qty}
                </span>
                <span>{formatKES(product!.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex justify-between border-t border-border pt-4 text-base font-semibold">
            <span>Total estimated</span>
            <span>{formatKES(subtotal)}</span>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            Place Order
          </button>
          <p className="mt-3 text-xs text-muted-foreground">
            Your details are used only to fulfil this order.
          </p>
        </aside>
      </form>
    </div>
  );
}
