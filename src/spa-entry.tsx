/**
 * Client-only entry used by the static SPA build (`bun run build:spa`).
 * Produces a plain dist/ folder that can be uploaded straight to cPanel.
 */
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";

import "./styles.css";
import { getRouter } from "./router";

const router = getRouter();

const el = document.getElementById("root");
if (el) {
  createRoot(el).render(<RouterProvider router={router} />);
}
