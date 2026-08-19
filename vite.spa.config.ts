/**
 * Standalone static SPA build config.
 *
 *   bun run build:spa   ->  dist/  (index.html + assets, no server needed)
 *
 * Upload the contents of dist/ to cPanel public_html. The generated
 * dist/.htaccess rewrites deep links back to index.html for client routing.
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const htaccess = `# Swahili Design Lab - static SPA (cPanel)
Options -MultiViews
RewriteEngine On
RewriteBase /

# Serve existing files and folders as-is
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# Everything else falls back to the SPA shell
RewriteRule . /index.html [L]

# Always revalidate the SPA shell so a deployment cannot keep pointing at an
# older hashed JavaScript bundle. Hashed assets remain safely cacheable below.
<FilesMatch "^(index\.html|\.htaccess)$">
  Header set Cache-Control "no-cache, no-store, must-revalidate"
  Header set Pragma "no-cache"
  Header set Expires "0"
</FilesMatch>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>
`;

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    tailwindcss(),
    tsConfigPaths(),
    {
      name: "sdl-emit-htaccess",
      closeBundle() {
        writeFileSync(resolve(process.cwd(), "dist/.htaccess"), htaccess);
      },
    },
  ],
  resolve: {
    alias: { "@": resolve(process.cwd(), "src") },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "@tanstack/react-router"],
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
  },
});
