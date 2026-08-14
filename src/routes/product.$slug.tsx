import { useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Minus, Plus, Leaf } from "lucide-react";
import { collectionName, formatKES, getProduct } from "@/lib/data";
import { useStore } from "@/lib/store";
import ProductCard from "@/components/ProductCard";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Product unavailable | Swahili Design Lab" }, { name: "robots", content: "noindex" }],
      };
    }
    const p = loaderData.product;
    return {
      meta: [
        { title: `${p.name} | Swahili Design Lab` },
        { name: "description", content: `${p.short} ${formatKES(p.price)}.` },
        { property: "og:title", content: `${p.name} | Swahili Design Lab` },
        { property: "og:description", content: p.short },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/product/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/product/${params.slug}` }],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addToCart, catalog } = useStore();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [option, setOption] = useState(product.options?.values[0]);

  const related = catalog
    .filter((p) => p.slug !== product.slug && p.collection === product.collection)
    .slice(0, 4);

  const add = () => {
    addToCart(product.slug, qty, option);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
        <Link to="/shop" className="hover:text-primary">
          Shop
        </Link>
        <span className="px-2">/</span>
        <span>{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="overflow-hidden rounded-3xl bg-sand">
          <img
            src={product.image}
            alt={product.name}
            width={1024}
            height={1024}
            className="w-full object-cover"
          />
        </div>

        <div>
          <p className="eyebrow">{collectionName(product.collection)}</p>
          <h1 className="editorial mt-3 text-3xl sm:text-4xl">{product.name}</h1>
          <p className="mt-4 text-xl font-semibold">{formatKES(product.price)}</p>
          <p className="mt-1 text-sm text-primary">
            {product.stock > 0 ? `${product.stock} available` : "Made to order"}
          </p>

          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {product.options && (
            <div className="mt-8">
              <p className="text-sm font-medium">{product.options.label}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.options.values.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setOption(v)}
                    className={`h-11 min-w-14 rounded-full border px-4 text-sm font-medium transition-colors ${
                      option === v ? "border-primary text-primary" : "border-border"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex h-12 items-center rounded-full border border-border">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((n) => Math.max(1, n - 1))}
                className="flex h-12 w-12 items-center justify-center"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm font-medium">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((n) => n + 1)}
                className="flex h-12 w-12 items-center justify-center"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={add}
              className="h-12 flex-1 rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 sm:flex-none"
            >
              Add to Cart
            </button>
            <button
              type="button"
              onClick={() => {
                add();
                navigate({ to: "/checkout" });
              }}
              className="h-12 rounded-full border border-border px-7 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
            >
              Order Now
            </button>
          </div>

          <dl className="mt-10 space-y-4 border-t border-border pt-8 text-sm">
            <div className="flex gap-6">
              <dt className="w-32 shrink-0 text-muted-foreground">Materials</dt>
              <dd>{product.materials.join(", ")}</dd>
            </div>
            <div className="flex gap-6">
              <dt className="w-32 shrink-0 text-muted-foreground">Category</dt>
              <dd>{product.category}</dd>
            </div>
          </dl>

          <div className="glass mt-8 rounded-2xl p-6">
            <Leaf className="h-5 w-5 text-primary" />
            <h2 className="mt-4 text-base font-semibold">Why This Product Is Sustainable</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {product.sustainability}
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="editorial text-2xl sm:text-3xl">More from this collection</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
