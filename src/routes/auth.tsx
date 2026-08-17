import { useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { isAdminEmail, useStore } from "@/lib/store";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Log In or Register | Swahili Design Lab" },
      {
        name: "description",
        content:
          "Log in to your Swahili Design Lab account or create one to track your sustainable fashion order requests.",
      },
      { property: "og:title", content: "Log In or Register | Swahili Design Lab" },
      { property: "og:description", content: "Access your Swahili Design Lab account." },
      { property: "og:url", content: "/auth" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/auth" }],
  }),
  component: AuthPage,
});

const field =
  "h-12 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none focus:border-primary";

function AuthPage() {
  const { login, register } = useStore();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");

    const result =
      mode === "login"
        ? login(email, password)
        : register({
            name: String(data.get("name") ?? ""),
            email,
            phone: String(data.get("phone") ?? ""),
            password,
          });

    if (!result.ok) {
      setError(result.error ?? "Something went wrong.");
      return;
    }
    toast.success(mode === "login" ? "Welcome back" : "Account created");
    navigate({ to: isAdminEmail(email) ? "/admin" : "/account" });
  };


  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-5 py-16 lg:px-8">
      <img
        src={logo}
        alt="Swahili Design Lab"
        loading="lazy"
        width={1152}
        height={576}
        className="h-12 w-auto"
      />
      <h1 className="editorial mt-8 text-3xl">
        {mode === "login" ? "Welcome back" : "Create your account"}
      </h1>
      <p className="mt-3 text-center text-sm text-muted-foreground">
        {mode === "login"
          ? "Log in to track your order requests."
          : "Save your details for faster order requests."}
      </p>

      <form onSubmit={onSubmit} className="mt-8 w-full rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8">
        <div className="space-y-4">
          {mode === "register" && (
            <div>
              <label htmlFor="name" className="text-sm font-medium">
                Full name
              </label>
              <input id="name" name="name" required autoComplete="name" className={`${field} mt-2`} />
            </div>
          )}
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={`${field} mt-2`}
            />
          </div>
          {mode === "register" && (
            <div>
              <label htmlFor="phone" className="text-sm font-medium">
                Phone number
              </label>
              <input id="phone" name="phone" type="tel" autoComplete="tel" className={`${field} mt-2`} />
            </div>
          )}
          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className={`${field} mt-2`}
            />
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground"
        >
          {mode === "login" ? "Log in" : "Create account"}
        </button>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError(null);
          }}
          className="mt-4 w-full text-sm text-muted-foreground hover:text-primary"
        >
          {mode === "login"
            ? "New here? Create an account"
            : "Already have an account? Log in"}
        </button>
      </form>
    </div>
  );
}
