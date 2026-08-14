import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { CATEGORIES, collections, formatKES, type Product } from "@/lib/data";
import { emptyProduct } from "@/lib/catalog";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Listing Manager | Swahili Design Lab" },
      {
        name: "description",
        content:
          "Studio listing manager for Swahili Design Lab — add, edit and remove sustainable fashion products.",
      },
      { property: "og:title", content: "Listing Manager | Swahili Design Lab" },
      { property: "og:description", content: "Manage the Swahili Design Lab product listings." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/admin" }],
  }),
  component: AdminPage,
});

const field =
  "h-12 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none focus:border-primary";
const area =
  "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary";

function AdminPage() {
  const { ready, user, catalog, saveProduct, deleteProduct, resetCatalog } = useStore();
  const [draft, setDraft] = useState<Product | null>(null);
  const [originalSlug, setOriginalSlug] = useState<string | undefined>(undefined);

  if (!ready) return <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">Loading…</div>;

  if (!user?.isAdmin) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight">Studio access only</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Log in with the studio admin account to manage listings.
        </p>
        <Link
          to="/auth"
          className="mt-8 inline-flex h-12 items-center rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground"
        >
          Go to login
        </Link>
      </div>
    );
  }

  const startNew = () => {
    setDraft(emptyProduct());
    setOriginalSlug(undefined);
  };

  const startEdit = (p: Product) => {
    setDraft({ ...p, materials: [...p.materials] });
    setOriginalSlug(p.slug);
  };

  const submit = () => {
    if (!draft) return;
    const result = saveProduct(draft, originalSlug);
    if (!result.ok) {
      toast.error(result.error ?? "Could not save the listing.");
      return;
    }
    toast.success(originalSlug ? "Listing updated" : "Listing added");
    setDraft(null);
    setOriginalSlug(undefined);
  };

  const remove = (p: Product) => {
    deleteProduct(p.slug);
    if (originalSlug === p.slug) setDraft(null);
    toast.success(`${p.name} removed`);
  };

  const set = <K extends keyof Product>(key: K, value: Product[K]) =>
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Listing manager</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Signed in as {user.email}. Changes are saved to this browser only.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              resetCatalog();
              setDraft(null);
              toast.success("Catalogue reset to defaults");
            }}
            className="inline-flex h-12 items-center gap-2 rounded-full border border-border px-5 text-sm font-medium hover:border-primary hover:text-primary"
          >
            <RotateCcw className="h-4 w-4" aria-hidden /> Reset
          </button>
          <button
            type="button"
            onClick={startNew}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground"
          >
            <Plus className="h-4 w-4" aria-hidden /> New listing
          </button>
        </div>
      </header>

      {draft && (
        <section className="glass mt-10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold">
            {originalSlug ? `Editing ${originalSlug}` : "New listing"}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-2 block font-medium">Name</span>
              <input
                className={field}
                value={draft.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-2 block font-medium">Slug (URL)</span>
              <input
                className={field}
                value={draft.slug}
                onChange={(e) => set("slug", e.target.value)}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-2 block font-medium">Price (KES)</span>
              <input
                type="number"
                min={0}
                className={field}
                value={draft.price}
                onChange={(e) => set("price", Number(e.target.value))}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-2 block font-medium">Stock</span>
              <input
                type="number"
                min={0}
                className={field}
                value={draft.stock}
                onChange={(e) => set("stock", Number(e.target.value))}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-2 block font-medium">Category</span>
              <select
                className={field}
                value={draft.category}
                onChange={(e) => set("category", e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-2 block font-medium">Collection</span>
              <select
                className={field}
                value={draft.collection}
                onChange={(e) => set("collection", e.target.value)}
              >
                {collections.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-2 block font-medium">Image URL</span>
              <input
                className={field}
                placeholder="https://…"
                value={draft.image}
                onChange={(e) => set("image", e.target.value)}
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-2 block font-medium">Short description</span>
              <input
                className={field}
                value={draft.short}
                onChange={(e) => set("short", e.target.value)}
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-2 block font-medium">Full description</span>
              <textarea
                rows={4}
                className={area}
                value={draft.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-2 block font-medium">Materials (comma separated)</span>
              <input
                className={field}
                value={draft.materials.join(", ")}
                onChange={(e) =>
                  set(
                    "materials",
                    e.target.value
                      .split(",")
                      .map((m) => m.trim())
                      .filter(Boolean),
                  )
                }
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-2 block font-medium">Sustainability note</span>
              <textarea
                rows={3}
                className={area}
                value={draft.sustainability}
                onChange={(e) => set("sustainability", e.target.value)}
              />
            </label>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={submit}
              className="h-12 rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground"
            >
              Save listing
            </button>
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="h-12 rounded-full border border-border px-7 text-sm font-medium hover:border-primary hover:text-primary"
            >
              Cancel
            </button>
          </div>
        </section>
      )}

      <section className="mt-10 overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="hidden px-4 py-3 sm:table-cell">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="hidden px-4 py-3 sm:table-cell">Stock</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {catalog.map((p) => (
              <tr key={p.slug} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                  {p.category}
                </td>
                <td className="px-4 py-3">{formatKES(p.price)}</td>
                <td className="hidden px-4 py-3 sm:table-cell">{p.stock}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      aria-label={`Edit ${p.name}`}
                      onClick={() => startEdit(p)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:border-primary hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${p.name}`}
                      onClick={() => remove(p)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:border-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
