import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Swahili Design Lab" },
      {
        name: "description",
        content:
          "How Swahili Design Lab collects, uses and protects the personal information you share when placing an order request.",
      },
      { property: "og:title", content: "Privacy Policy | Swahili Design Lab" },
      { property: "og:description", content: "How we handle your personal information." },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: Privacy,
});

const sections = [
  {
    h: "What we collect",
    p: "When you place an order request we collect your name, email address, phone number and delivery location. If you create an account, those details are stored in your own browser so you don't have to re-enter them.",
  },
  {
    h: "How we use it",
    p: "Your details are used only to confirm availability, arrange delivery and agree payment for the order you requested. We do not sell or rent your information to anyone.",
  },
  {
    h: "How long we keep it",
    p: "Order records are kept for as long as needed to fulfil the order and meet Kenyan record-keeping obligations. You can ask us to delete your details at any time.",
  },
  {
    h: "Your choices",
    p: "You can request a copy of the information we hold, ask for corrections, or ask us to delete it by writing to hello@swahilidesignlab.co.ke.",
  },
];

function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14 lg:px-8">
      <p className="eyebrow">Legal</p>
      <h1 className="editorial mt-3 text-4xl">Privacy Policy</h1>
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
