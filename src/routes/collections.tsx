import { createFileRoute, Link } from "@tanstack/react-router";
import { collections, products } from "@/lib/data";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections | Swahili Design Lab" },
      {
        name: "description",
        content:
          "Explore Swahili Design Lab collections: Upcycled Fashion, Sustainable Bags, Reimagined Textiles and Limited Editions.",
      },
      { property: "og:title", content: "Collections | Swahili Design Lab" },
      {
        property: "og:description",
        content: "Upcycled Fashion, Sustainable Bags, Reimagined Textiles and Limited Editions.",
      },
      { property: "og:url", content: "/collections" },
    ],
    links: [{ rel: "canonical", href: "/collections" }],
  }),
  component: Collections,
});

function Collections() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <p className="eyebrow">Collections</p>
      <h1 className="editorial mt-3 text-4xl sm:text-5xl">Four ways to wear the change.</h1>
      <p className="mt-4 max-w-xl text-sm text-muted-foreground">
        Each collection begins with a material problem and ends with something worth keeping.
      </p>

      <div className="mt-12 space-y-14">
        {collections.map((c, i) => {
          const count = products.filter((p) => p.collection === c.slug).length;
          return (
            <section
              key={c.slug}
              className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${
                i % 2 ? "lg:[&>div:first-child]:order-2" : ""
              }`}
            >
              <div className="overflow-hidden rounded-3xl bg-sand">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  width={1024}
                  height={1280}
                  className="aspect-4/3 w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div>
                <p className="eyebrow">{count} pieces</p>
                <h2 className="editorial mt-3 text-3xl sm:text-4xl">{c.name}</h2>
                <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                  {c.blurb}
                </p>
                <Link
                  to="/shop"
                  search={{ collection: c.slug }}
                  className="mt-7 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
                >
                  Shop {c.name}
                </Link>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
