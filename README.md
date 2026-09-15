# SvelteKit Base Template

A lean, reusable SvelteKit SPA template. Ships as an SPA by default with a documented SSR toggle. Demonstrates idiomatic Svelte 5 (runes), a fully themed shadcn-svelte component set, Effect-based typed error handling, and a hybrid lint stack.

## Stack

- **Svelte 5** — runes-based reactive state
- **SvelteKit 2** — SPA via `adapter-static`
- **Tailwind CSS v4** — CSS-first config (`@import "tailwindcss"`, no `tailwind.config.js`)
- **shadcn-svelte** — neutral default theme, curated component set
- **cn** — official shadcn class-merge package (replaces clsx + tailwind-merge)
- **Effect v4** (`effect@4.0.0-rc.115`) — typed error handling, zero `try-catch` in `src/`
- **Biome + ESLint/Prettier hybrid** — Biome for TS/JS/JSON/CSS, ESLint + prettier-plugin-svelte for `.svelte`
- **Vitest** — unit tests for stores and services

## Quickstart

pnpm is mandatory — enforced by `only-allow` (`npm install` / `yarn install` will fail). Pin: `pnpm@12.4.1`, Node `>= 24`.

```bash
corepack enable
corepack prepare pnpm@12.4.1 --activate

pnpm install
pnpm dev
```

## Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | start dev server |
| `pnpm build` | build SPA (outputs `build/200.html`) |
| `pnpm preview` | preview production build |
| `pnpm lint` | Biome check (TS/JS) + ESLint check (Svelte) |
| `pnpm lint:fix` | auto-fix lint issues |
| `pnpm format` | Prettier format `.svelte` files |
| `pnpm type:check` | TypeScript strict check |
| `pnpm ci:lint` | CI lint gate (Biome CI + ESLint) |
| `pnpm test` | run Vitest unit tests |

## Documentation

All conventions live in [`docs/index.md`](docs/index.md).
