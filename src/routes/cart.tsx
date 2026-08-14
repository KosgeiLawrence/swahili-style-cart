import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatKES, getProduct } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart | Swahili Design Lab" },
      {
        name: "description",
        content:
          "Review the sustainable pieces in your Swahili Design Lab cart before placing your order request.",
      },
      { property: "og:title", content: "Your Cart | Swahili Design Lab" },
      { property: "og:description", content: "Review your cart and place an order request." },
      { property: "og:url", content: "/cart" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/cart" }],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, setQty, removeFromCart, subtotal, ready } = useStore();

  const lines = cart
    .map((i) => ({ item: i, product: getProduct(i.slug) }))
    .filter((l) => l.product);

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
      <p className="eyebrow">Cart</p>
      <h1 className="editorial mt-3 text-4xl sm:text-5xl">Your selection</h1>

      {ready && lines.length === 0 ? (
        <div className="glass mt-12 rounded-2xl p-14 text-center">
          <h2 className="text-lg font-semibold">Your cart is empty</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse the shop and add a piece you'd like us to reserve for you.
          </p>
          <Link
            to="/shop"
            className="mt-7 inline-flex rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]">
          <ul className="space-y-4">
            {lines.map(({ item, product }) => (
              <li
                key={`${item.slug}-${item.option ?? ""}`}
                className="flex gap-4 rounded-2xl border border-border/60 bg-card p-4 sm:gap-6 sm:p-5"
              >
                <Link
                  to="/product/$slug"
                  params={{ slug: item.slug }}
                  className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-sand sm:h-28 sm:w-28"
                >
                  <img
                    src={product!.image}
                    alt={product!.name}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="h-full w-full object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-sm font-semibold sm:text-base">{product!.name}</h2>
                      {item.option && (
                        <p className="mt-1 text-xs text-muted-foreground">Size {item.option}</p>
                      )}
                      <p className="mt-1 text-sm font-medium">{formatKES(product!.price)}</p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove ${product!.name}`}
                      onClick={() => removeFromCart(item.slug, item.option)}
                      className="text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex h-10 items-center rounded-full border border-border">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => setQty(item.slug, item.qty - 1, item.option)}
                        className="flex h-10 w-10 items-center justify-center"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-7 text-center text-sm">{item.qty}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setQty(item.slug, item.qty + 1, item.option)}
                        className="flex h-10 w-10 items-center justify-center"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-sm font-semibold">
                      {formatKES(product!.price * item.qty)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="glass h-fit rounded-2xl p-6 lg:sticky lg:top-28">
            <h2 className="text-base font-semibold">Order summary</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatKES(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Delivery</dt>
                <dd className="text-muted-foreground">Confirmed on contact</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
                <dt>Total</dt>
                <dd>{formatKES(subtotal)}</dd>
              </div>
            </dl>
            <Link
              to="/checkout"
              className="mt-6 block rounded-full bg-primary px-6 py-3 text-center text-sm font-medium text-primary-foreground"
            >
              Proceed to order
            </Link>
            <Link
              to="/shop"
              className="mt-3 block rounded-full border border-border px-6 py-3 text-center text-sm font-medium hover:border-primary hover:text-primary"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
