import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { formatKES } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/order/$reference")({
  head: ({ params }) => ({
    meta: [
      { title: `Order ${params.reference} | Swahili Design Lab` },
      { name: "description", content: "Your Swahili Design Lab order request has been received." },
      { property: "og:title", content: "Order Received | Swahili Design Lab" },
      { property: "og:description", content: "Your order request has been received." },
      { property: "og:url", content: `/order/${params.reference}` },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: `/order/${params.reference}` }],
  }),
  component: OrderPage,
});

function OrderPage() {
  const { reference } = Route.useParams();
  const { orders, ready } = useStore();
  const order = orders.find((o) => o.reference === reference);

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
      <div className="glass rounded-3xl p-8 sm:p-12">
        <CheckCircle2 className="h-9 w-9 text-primary" />
        <h1 className="editorial mt-6 text-3xl sm:text-4xl">Order Received</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Thank you for your order! Your order has been received successfully. Our team will contact
          you shortly to confirm your order, availability, delivery details and payment
          arrangements.
        </p>

        <div className="mt-8 rounded-2xl border border-border bg-card p-5">
          <p className="eyebrow">Order reference</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{reference}</p>
        </div>

        {order ? (
          <>
            <ul className="mt-8 space-y-3 text-sm">
              {order.items.map((i) => (
                <li key={`${i.slug}-${i.option ?? ""}`} className="flex justify-between gap-4">
                  <span className="text-muted-foreground">
                    {i.name}
                    {i.option ? ` (${i.option})` : ""} × {i.qty}
                  </span>
                  <span>{formatKES(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-border pt-4 text-base font-semibold">
              <span>Total estimated</span>
              <span>{formatKES(order.total)}</span>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              We'll be in touch on <span className="font-medium text-foreground">{order.customer.phone}</span>{" "}
              and <span className="font-medium text-foreground">{order.customer.email}</span>. Delivery
              to {order.customer.location}, {order.customer.county}.
            </p>
          </>
        ) : (
          ready && (
            <p className="mt-8 text-sm text-muted-foreground">
              Order details for this reference aren't stored on this device. Our team still has your
              request — quote the reference above when we call.
            </p>
          )
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/shop"
            className="rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground"
          >
            Continue shopping
          </Link>
          <Link
            to="/account"
            className="rounded-full border border-border px-7 py-3 text-sm font-medium hover:border-primary hover:text-primary"
          >
            View my orders
          </Link>
        </div>
      </div>
    </div>
  );
}
