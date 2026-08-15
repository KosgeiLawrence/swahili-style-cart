# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## Static build for cPanel

```bash
npm install
npm run build:spa
```

Writes a self-contained `dist/` folder (index.html, hashed JS/CSS, images,
favicon, robots.txt and an Apache `.htaccess`). Upload the *contents* of
`dist/` into `public_html` — no Node.js, backend or database needed at
runtime. The `.htaccess` rewrites deep links (/shop, /product/x) back to
index.html so client-side routing works.
