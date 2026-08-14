import { createFileRoute, Link } from "@tanstack/react-router";
import { Recycle, Scissors, Sprout } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { collections } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Swahili Design Lab | Sustainable Fashion & Circular Design" },
      {
        name: "description",
        content:
          "Discover sustainable fashion, upcycled products and innovative designs from Swahili Design Lab. Shop consciously designed products created with sustainability and circularity in mind.",
      },
      {
        property: "og:title",
        content: "Swahili Design Lab | Sustainable Fashion & Circular Design",
      },
      {
        property: "og:description",
        content:
          "Sustainable fashion, upcycled bags and reimagined textiles designed and made in Kenya.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const impact = [
  { Icon: Recycle, stat: "3.2 tonnes", label: "Textile waste diverted from landfill" },
  { Icon: Scissors, stat: "40+", label: "Designers and makers in the studio network" },
  { Icon: Sprout, stat: "92%", label: "Of materials reclaimed, natural or recycled" },
];

function Index() {
  const { catalog } = useStore();
  const featured = catalog.slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="ambient">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <div className="rise">
            <p className="eyebrow">Nairobi · Circular design studio</p>
            <h1 className="editorial mt-5 text-[2.6rem] sm:text-6xl lg:text-[4.25rem]">
              Sustainable Fashion, Designed With Purpose.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Discover thoughtfully designed fashion and lifestyle pieces created through
              creativity, circularity and responsible design.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Shop Collection
              </Link>
              <Link
                to="/about"
                className="rounded-full border border-border px-7 py-3.5 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
              >
                Explore Our Story
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl bg-sand">
              <img
                src={hero}
                alt="Model wearing an upcycled patchwork jacket by Swahili Design Lab"
                width={1280}
                height={1600}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="glass absolute -bottom-5 left-4 max-w-[15rem] rounded-2xl p-4 sm:left-6">
              <p className="text-xs font-semibold">Reworked Patchwork Shirt Jacket</p>
              <p className="mt-1 text-xs text-muted-foreground">
                One of one, cut from reclaimed indigo cloth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Collections</p>
            <h2 className="editorial mt-3 text-3xl sm:text-4xl">Made from what already exists.</h2>
          </div>
          <Link to="/collections" className="text-sm font-medium text-primary hover:underline">
            View all collections
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((c) => (
            <Link
              key={c.slug}
              to="/shop"
              search={{ collection: c.slug }}
              className="lift group relative block overflow-hidden rounded-2xl bg-sand"
            >
              <img
                src={c.image}
                alt={c.name}
                loading="lazy"
                width={1024}
                height={1280}
                className="aspect-3/4 w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="glass absolute inset-x-3 bottom-3 rounded-xl p-4">
                <h3 className="text-sm font-semibold">{c.name}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-sand/60 py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Featured</p>
              <h2 className="editorial mt-3 text-3xl sm:text-4xl">This season in the studio.</h2>
            </div>
            <Link to="/shop" className="text-sm font-medium text-primary hover:underline">
              Shop all products
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="eyebrow">Our philosophy</p>
            <h2 className="editorial mt-3 text-3xl sm:text-4xl lg:text-5xl">
              Fashion That Gives Materials Another Life.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              Swahili Design Lab works with sustainable materials, creative reuse, responsible
              production and innovative design. Every piece begins with something that already
              exists — deadstock cloth, retired sailcloth, pre-loved denim, workshop offcuts.
            </p>
            <p>
              Our designers rebuild those materials into pieces made to be kept, repaired and worn
              for years. Production happens in small runs, in Nairobi, with makers paid fairly for
              skilled hand work.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {impact.map(({ Icon, stat, label }) => (
            <div key={label} className="glass rounded-2xl p-7">
              <Icon className="h-5 w-5 text-primary" />
              <p className="editorial mt-6 text-3xl">{stat}</p>
              <p className="mt-2 text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-8 lg:px-8">
        <div className="ambient glass overflow-hidden rounded-3xl px-6 py-16 text-center sm:px-16">
          <h2 className="editorial text-4xl sm:text-5xl">Wear the Change.</h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground">
            Explore our collection of sustainable designs and support a new generation of
            responsible fashion.
          </p>
          <Link
            to="/shop"
            className="mt-9 inline-flex rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Shop Sustainable Fashion
          </Link>
        </div>
      </section>
    </>
  );
}
