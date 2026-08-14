import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { CATEGORIES, formatKES, type Collection, type Product } from "@/lib/data";
import { emptyProduct } from "@/lib/catalog";
import { emptyCollection, NAV_TARGETS, type SiteContent } from "@/lib/site";
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

type Tab = "listings" | "collections" | "content" | "menu";

const TABS: { id: Tab; label: string }[] = [
  { id: "listings", label: "Listings" },
  { id: "collections", label: "Collections" },
  { id: "content", label: "Landing page" },
  { id: "menu", label: "Menu" },
];

function AdminPage() {
  const {
    ready,
    user,
    catalog,
    saveProduct,
    deleteProduct,
    resetCatalog,
    siteCollections,
    saveCollection,
    deleteCollection,
    resetCollections,
    site,
    saveSite,
    resetSite,
  } = useStore();
  const [tab, setTab] = useState<Tab>("listings");
  const [draft, setDraft] = useState<Product | null>(null);
  const [originalSlug, setOriginalSlug] = useState<string | undefined>(undefined);
  const [colDraft, setColDraft] = useState<Collection | null>(null);
  const [colOriginal, setColOriginal] = useState<string | undefined>(undefined);

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
              if (tab === "listings") {
                resetCatalog();
                setDraft(null);
                toast.success("Catalogue reset to defaults");
              } else if (tab === "collections") {
                resetCollections();
                setColDraft(null);
                toast.success("Collections reset to defaults");
              } else {
                resetSite();
                toast.success("Page content reset to defaults");
              }
            }}
            className="inline-flex h-12 items-center gap-2 rounded-full border border-border px-5 text-sm font-medium hover:border-primary hover:text-primary"
          >
            <RotateCcw className="h-4 w-4" aria-hidden /> Reset
          </button>
          {tab === "listings" && (
            <button
              type="button"
              onClick={startNew}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground"
            >
              <Plus className="h-4 w-4" aria-hidden /> New listing
            </button>
          )}
          {tab === "collections" && (
            <button
              type="button"
              onClick={() => {
                setColDraft(emptyCollection());
                setColOriginal(undefined);
              }}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground"
            >
              <Plus className="h-4 w-4" aria-hidden /> New collection
            </button>
          )}
        </div>
      </header>

      <nav className="mt-8 flex flex-wrap gap-2" aria-label="Admin sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`h-10 rounded-full px-5 text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-primary text-primary-foreground"
                : "border border-border hover:border-primary hover:text-primary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "content" && <ContentEditor site={site} onSave={saveSite} />}
      {tab === "menu" && <MenuEditor site={site} onSave={saveSite} />}

      {tab === "collections" && (
        <CollectionsEditor
          collections={siteCollections}
          draft={colDraft}
          originalSlug={colOriginal}
          setDraft={setColDraft}
          onEdit={(c) => {
            setColDraft({ ...c });
            setColOriginal(c.slug);
          }}
          onSubmit={() => {
            if (!colDraft) return;
            const res = saveCollection(colDraft, colOriginal);
            if (!res.ok) {
              toast.error(res.error ?? "Could not save.");
              return;
            }
            toast.success(colOriginal ? "Collection updated" : "Collection added");
            setColDraft(null);
            setColOriginal(undefined);
          }}
          onDelete={(c) => {
            deleteCollection(c.slug);
            toast.success(`${c.name} removed`);
          }}
        />
      )}

      {tab === "listings" && draft && (
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
                {siteCollections.map((c) => (
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

      {tab === "listings" && (
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
      )}
    </div>
  );
}

/* ----------------------------- landing content ---------------------------- */

const TEXT_FIELDS: { key: keyof SiteContent; label: string; long?: boolean }[] = [
  { key: "heroEyebrow", label: "Hero eyebrow" },
  { key: "heroTitle", label: "Hero headline", long: true },
  { key: "heroSubtitle", label: "Hero subtitle", long: true },
  { key: "heroPrimaryLabel", label: "Hero primary button" },
  { key: "heroSecondaryLabel", label: "Hero secondary button" },
  { key: "heroImage", label: "Hero image URL (blank = default)" },
  { key: "heroCardTitle", label: "Hero card title" },
  { key: "heroCardText", label: "Hero card text" },
  { key: "collectionsEyebrow", label: "Collections eyebrow" },
  { key: "collectionsTitle", label: "Collections heading" },
  { key: "featuredEyebrow", label: "Featured eyebrow" },
  { key: "featuredTitle", label: "Featured heading" },
  { key: "philosophyEyebrow", label: "Philosophy eyebrow" },
  { key: "philosophyTitle", label: "Philosophy heading" },
  { key: "philosophyBody1", label: "Philosophy paragraph 1", long: true },
  { key: "philosophyBody2", label: "Philosophy paragraph 2", long: true },
  { key: "closingTitle", label: "Closing heading" },
  { key: "closingText", label: "Closing text", long: true },
  { key: "closingButton", label: "Closing button" },
];

function ContentEditor({
  site,
  onSave,
}: {
  site: SiteContent;
  onSave: (s: SiteContent) => void;
}) {
  const [form, setForm] = useState<SiteContent>(site);

  const set = (key: keyof SiteContent, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <section className="glass mt-8 rounded-2xl p-6">
      <h2 className="text-lg font-semibold">Landing page content</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {TEXT_FIELDS.map((f) => (
          <label key={String(f.key)} className={`block text-sm ${f.long ? "sm:col-span-2" : ""}`}>
            <span className="mb-2 block font-medium">{f.label}</span>
            {f.long ? (
              <textarea
                rows={3}
                className={area}
                value={String(form[f.key] ?? "")}
                onChange={(e) => set(f.key, e.target.value)}
              />
            ) : (
              <input
                className={field}
                value={String(form[f.key] ?? "")}
                onChange={(e) => set(f.key, e.target.value)}
              />
            )}
          </label>
        ))}
      </div>

      <h3 className="mt-8 text-sm font-semibold">Impact stats</h3>
      <div className="mt-4 space-y-3">
        {form.impact.map((row, i) => (
          <div key={i} className="grid gap-3 sm:grid-cols-[10rem_1fr]">
            <input
              className={field}
              value={row.stat}
              aria-label={`Stat ${i + 1}`}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  impact: prev.impact.map((r, j) =>
                    j === i ? { ...r, stat: e.target.value } : r,
                  ),
                }))
              }
            />
            <input
              className={field}
              value={row.label}
              aria-label={`Stat label ${i + 1}`}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  impact: prev.impact.map((r, j) =>
                    j === i ? { ...r, label: e.target.value } : r,
                  ),
                }))
              }
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          onSave(form);
          toast.success("Landing page updated");
        }}
        className="mt-6 h-12 rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground"
      >
        Save content
      </button>
    </section>
  );
}

/* --------------------------------- menu ---------------------------------- */

function MenuEditor({ site, onSave }: { site: SiteContent; onSave: (s: SiteContent) => void }) {
  const [form, setForm] = useState<SiteContent>(site);

  return (
    <section className="glass mt-8 rounded-2xl p-6">
      <h2 className="text-lg font-semibold">Navigation menu</h2>
      <div className="mt-6 space-y-3">
        {form.menu.map((item, i) => (
          <div key={i} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <input
              className={field}
              aria-label={`Menu label ${i + 1}`}
              value={item.label}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  menu: p.menu.map((m, j) => (j === i ? { ...m, label: e.target.value } : m)),
                }))
              }
            />
            <select
              className={field}
              aria-label={`Menu link ${i + 1}`}
              value={item.to}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  menu: p.menu.map((m, j) => (j === i ? { ...m, to: e.target.value } : m)),
                }))
              }
            >
              {NAV_TARGETS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label={`Move ${item.label} up`}
                disabled={i === 0}
                onClick={() =>
                  setForm((p) => {
                    const menu = [...p.menu];
                    const prev = menu[i - 1]!;
                    menu[i - 1] = menu[i]!;
                    menu[i] = prev;
                    return { ...p, menu };
                  })
                }
                className="h-12 rounded-full border border-border px-4 text-sm disabled:opacity-40"
              >
                ↑
              </button>
              <button
                type="button"
                aria-label={`Remove ${item.label}`}
                onClick={() =>
                  setForm((p) => ({ ...p, menu: p.menu.filter((_, j) => j !== i) }))
                }
                className="flex h-12 w-12 items-center justify-center rounded-full border border-border hover:border-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setForm((p) => ({ ...p, menu: [...p.menu, { label: "New link", to: "/shop" }] }))}
        className="mt-4 inline-flex h-11 items-center gap-2 rounded-full border border-border px-5 text-sm font-medium hover:border-primary hover:text-primary"
      >
        <Plus className="h-4 w-4" aria-hidden /> Add menu item
      </button>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-2 block font-medium">Header button label</span>
          <input
            className={field}
            value={form.ctaLabel}
            onChange={(e) => setForm((p) => ({ ...p, ctaLabel: e.target.value }))}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-2 block font-medium">Header button link</span>
          <select
            className={field}
            value={form.ctaTo}
            onChange={(e) => setForm((p) => ({ ...p, ctaTo: e.target.value }))}
          >
            {NAV_TARGETS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="button"
        onClick={() => {
          onSave(form);
          toast.success("Menu updated");
        }}
        className="mt-6 h-12 rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground"
      >
        Save menu
      </button>
    </section>
  );
}

/* ------------------------------ collections ------------------------------- */

function CollectionsEditor({
  collections,
  draft,
  originalSlug,
  setDraft,
  onEdit,
  onSubmit,
  onDelete,
}: {
  collections: Collection[];
  draft: Collection | null;
  originalSlug: string | undefined;
  setDraft: (c: Collection | null) => void;
  onEdit: (c: Collection) => void;
  onSubmit: () => void;
  onDelete: (c: Collection) => void;
}) {
  return (
    <>
      {draft && (
        <section className="glass mt-8 rounded-2xl p-6">
          <h2 className="text-lg font-semibold">
            {originalSlug ? `Editing ${originalSlug}` : "New collection"}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-2 block font-medium">Name</span>
              <input
                className={field}
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-2 block font-medium">Slug (URL)</span>
              <input
                className={field}
                value={draft.slug}
                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-2 block font-medium">Image URL</span>
              <input
                className={field}
                placeholder="https://…"
                value={draft.image}
                onChange={(e) => setDraft({ ...draft, image: e.target.value })}
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-2 block font-medium">Blurb</span>
              <textarea
                rows={3}
                className={area}
                value={draft.blurb}
                onChange={(e) => setDraft({ ...draft, blurb: e.target.value })}
              />
            </label>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onSubmit}
              className="h-12 rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground"
            >
              Save collection
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
              <th className="px-4 py-3">Collection</th>
              <th className="hidden px-4 py-3 sm:table-cell">Slug</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((c) => (
              <tr key={c.slug} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{c.slug}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      aria-label={`Edit ${c.name}`}
                      onClick={() => onEdit(c)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:border-primary hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${c.name}`}
                      onClick={() => onDelete(c)}
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
    </>
  );
}
