import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Swahili Design Lab | Circular Design Studio in Nairobi" },
      {
        name: "description",
        content:
          "Swahili Design Lab is a Nairobi design studio and marketplace building sustainable fashion through creative reuse, circular materials and fair, small-run production.",
      },
      {
        property: "og:title",
        content: "About Swahili Design Lab | Circular Design Studio in Nairobi",
      },
      {
        property: "og:description",
        content: "A Nairobi studio building sustainable fashion through creative reuse.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="eyebrow">Our story</p>
          <h1 className="editorial mt-3 text-4xl sm:text-5xl lg:text-6xl">
            A studio built around what others throw away.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Swahili Design Lab began in Nairobi with a simple observation: the material we need is
            already here. Offcuts from tailoring workshops, retired sailcloth from the coast,
            second-hand denim arriving by the bale — all of it capable of becoming something
            better.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Today we work with a network of designers and makers to turn those materials into
            clothing, bags, accessories and home pieces. Everything is produced in small runs so we
            only make what people actually want, and every maker is paid fairly for skilled hand
            work.
          </p>
        </div>
        <div className="overflow-hidden rounded-3xl bg-sand">
          <img
            src={hero}
            alt="A Swahili Design Lab piece made from reclaimed textiles"
            loading="lazy"
            width={1280}
            height={1600}
            className="w-full object-cover"
          />
        </div>
      </div>

      <div className="mt-20 grid gap-6 sm:grid-cols-3">
        {[
          {
            h: "Circularity first",
            p: "We start with existing material and design around its limits, rather than ordering new cloth to fit a sketch.",
          },
          {
            h: "Made to be kept",
            p: "Reinforced seams, honest hardware and repairable construction, so pieces stay in use for years.",
          },
          {
            h: "Made with people",
            p: "Designers, tailors and weavers across Kenya, paid fairly and credited for their craft.",
          },
        ].map((c) => (
          <div key={c.h} className="glass rounded-2xl p-7">
            <h2 className="text-base font-semibold">{c.h}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.p}</p>
          </div>
        ))}
      </div>

      <div className="ambient glass mt-20 rounded-3xl px-6 py-14 text-center sm:px-16">
        <h2 className="editorial text-3xl sm:text-4xl">Wear the Change.</h2>
        <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground">
          Explore our collection of sustainable designs and support a new generation of responsible
          fashion.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground"
        >
          Shop Sustainable Fashion
        </Link>
      </div>
    </div>
  );
}
