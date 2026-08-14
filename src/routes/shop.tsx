import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { CATEGORIES, collections } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

type ShopSearch = {
  collection?: string | undefined;
  q?: string | undefined;
  category?: string | undefined;
};

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    collection: typeof search["collection"] === "string" ? search["collection"] : undefined,
    category: typeof search["category"] === "string" ? search["category"] : undefined,
    q: typeof search["q"] === "string" ? search["q"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop Sustainable Fashion | Swahili Design Lab" },
      {
        name: "description",
        content:
          "Browse upcycled bags, clothing, accessories and home pieces from Swahili Design Lab. Sustainable products made in Kenya, priced in KES.",
      },
      { property: "og:title", content: "Shop Sustainable Fashion | Swahili Design Lab" },
      {
        property: "og:description",
        content: "Upcycled bags, clothing, accessories and home pieces made in Kenya.",
      },
      { property: "og:url", content: "/shop" },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  component: Shop,
});

const selectClass =
  "h-11 w-full rounded-full border border-border bg-card px-4 text-sm outline-none focus:border-primary";

function Shop() {
  const initial = Route.useSearch();
  const [q, setQ] = useState(initial.q ?? "");
  const [category, setCategory] = useState(initial.category ?? "all");
  const [collection, setCollection] = useState(initial.collection ?? "all");
  const [maxPrice, setMaxPrice] = useState(8000);
  const [sort, setSort] = useState("featured");

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = catalog.filter((p) => {
      const matchesTerm =
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.collection.replace(/-/g, " ").includes(term) ||
        p.short.toLowerCase().includes(term);
      const matchesCategory = category === "all" || p.category === category;
      const matchesCollection = collection === "all" || p.collection === collection;
      return matchesTerm && matchesCategory && matchesCollection && p.price <= maxPrice;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [q, category, collection, maxPrice, sort]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <p className="eyebrow">Marketplace</p>
      <h1 className="editorial mt-3 text-4xl sm:text-5xl">Shop</h1>
      <p className="mt-4 max-w-xl text-sm text-muted-foreground">
        Every piece is made in small runs from reclaimed, natural or recycled materials.
      </p>

      <div className="glass mt-9 rounded-2xl p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-5">
          <div className="relative lg:col-span-2">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <label className="sr-only" htmlFor="search">
              Search products
            </label>
            <input
              id="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by product, category or collection"
              className="h-11 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="sr-only" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={selectClass}
            >
              <option value="all">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="sr-only" htmlFor="collection">
              Collection
            </label>
            <select
              id="collection"
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
              className={selectClass}
            >
              <option value="all">All collections</option>
              {collections.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="sr-only" htmlFor="sort">
              Sort by
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className={selectClass}
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to high</option>
              <option value="price-desc">Price: High to low</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <label htmlFor="price" className="whitespace-nowrap text-xs font-medium">
            Up to KES {maxPrice.toLocaleString()}
          </label>
          <input
            id="price"
            type="range"
            min={1000}
            max={8000}
            step={100}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </div>

      {results.length === 0 ? (
        <div className="glass mt-14 rounded-2xl p-14 text-center">
          <h2 className="text-lg font-semibold">No products found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different search term, category or price range.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
