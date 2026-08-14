import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { formatKES, type Product } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore();
  const inStock = product.stock > 0;

  return (
    <article className="lift group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card">
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-4/5 overflow-hidden bg-sand"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={1024}
          height={1024}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        />
        <span className="glass absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-medium">
          {inStock ? `In stock · ${product.stock}` : "Made to order"}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-base font-semibold leading-snug">
          <Link to="/product/$slug" params={{ slug: product.slug }} className="hover:text-primary">
            {product.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.short}</p>
        <p className="mt-1 text-sm font-semibold">{formatKES(product.price)}</p>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => {
              addToCart(product.slug, 1);
              toast.success(`${product.name} added to cart`);
            }}
            className="flex-1 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Add to Cart
          </button>
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="rounded-full border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
