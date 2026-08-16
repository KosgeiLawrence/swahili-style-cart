import { type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Mail, Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | Swahili Design Lab" },
      {
        name: "description",
        content:
          "Get in touch with Swahili Design Lab in Mombasa about orders, wholesale, collaborations or custom sustainable pieces.",
      },
      { property: "og:title", content: "Contact | Swahili Design Lab" },
      { property: "og:description", content: "Talk to the Swahili Design Lab studio in Mombasa." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

const field =
  "h-12 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none focus:border-primary";

function Contact() {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.currentTarget.reset();
    toast.success("Message sent — we'll get back to you shortly.");
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
      <p className="eyebrow">Contact</p>
      <h1 className="editorial mt-3 text-4xl sm:text-5xl">Talk to the studio.</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_20rem]">
        <form onSubmit={onSubmit} className="glass rounded-2xl p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="cname" className="text-sm font-medium">
                Name
              </label>
              <input id="cname" name="name" required className={`${field} mt-2`} />
            </div>
            <div>
              <label htmlFor="cemail" className="text-sm font-medium">
                Email
              </label>
              <input id="cemail" name="email" type="email" required className={`${field} mt-2`} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="cmsg" className="text-sm font-medium">
                Message
              </label>
              <textarea
                id="cmsg"
                name="message"
                rows={6}
                required
                className="mt-2 w-full rounded-xl border border-border bg-card p-4 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground"
          >
            Send message
          </button>
        </form>

        <aside className="space-y-4">
          {[
            { Icon: Mail, label: "hello@swahilidesignlab.co.ke" },
            { Icon: Phone, label: "+254 700 000 000" },
            { Icon: MapPin, label: "Studio visits by appointment, Mombasa" },
          ].map(({ Icon, label }) => (
            <div key={label} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-5">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-sm">{label}</p>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
