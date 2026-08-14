import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | Swahili Design Lab" },
      {
        name: "description",
        content:
          "The terms that apply when you place an order request with Swahili Design Lab, including pricing, availability, delivery and returns.",
      },
      { property: "og:title", content: "Terms & Conditions | Swahili Design Lab" },
      { property: "og:description", content: "Ordering, pricing, delivery and returns." },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: Terms,
});

const sections = [
  {
    h: "Orders are requests",
    p: "Placing an order on this site creates an order request, not a completed sale. Our team will contact you to confirm availability, delivery and payment before anything is dispatched.",
  },
  {
    h: "Pricing",
    p: "All prices are shown in Kenyan Shillings (KES) and exclude delivery unless stated. Delivery is quoted when we confirm your order.",
  },
  {
    h: "Availability",
    p: "Many pieces are one of one or made in small runs. If an item sells out before we reach you, we will offer an alternative or cancel the request at no cost.",
  },
  {
    h: "Returns",
    p: "Unworn pieces can be returned within 14 days of delivery in their original condition. Made-to-order and custom pieces are final sale.",
  },
];

function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 lg:px-8">
      <p className="eyebrow">Legal</p>
      <h1 className="editorial mt-3 text-4xl">Terms &amp; Conditions</h1>
      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <section key={s.h}>
            <h2 className="text-lg font-semibold">{s.h}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.p}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
