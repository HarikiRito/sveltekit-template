# Structure

Folder layout and import conventions. See also [naming.md](naming.md).

- **No `src/lib`** — flat structure directly under `src/`
- **Single alias** — `src` maps to `./src`; every cross-module import uses `src/...`, never `$lib` or `@` aliases
- **Feature-folder pattern** — each feature lives at `src/features/<name>/`:
  - `<name>.svelte.ts` — reactive state factory (only when the feature has state), see [state.md](state.md)
  - `index.svelte` — the feature's full markup, local UI state, and event-handler wiring
- **Routes are pure delegation shells** — `+page.svelte` files contain no markup, no logic, no state; they only import and render a feature's `index.svelte`
- `src/components/ui/` — shadcn-svelte primitives (generated) plus optional `App*` wrappers, see [components.md](components.md)
- `src/services/` — data-access/persistence, return `Effect` values, see [error-handling.md](error-handling.md)
- `src/effect/` — shared Effect building blocks (tagged errors, runtime helpers)

## Tree

```
src/
  components/
    ui/                  # shadcn-svelte components + App* wrappers
      button/
      card/
      input/
      label/
      dialog/
      dropdown-menu/
      sonner/
      ...                # curated 30-component set, see components.md
      AppButton.svelte
      AppCard.svelte
      AppInput.svelte
      AppSonner.svelte
  features/
    todos/
      todos.svelte.ts     # createTodosStore()
      todos.svelte.test.ts
      index.svelte        # todos feature UI implementation
    home/
      index.svelte        # landing page UI implementation
    counter/
      counter.svelte.ts   # createCounterStore()
      counter.svelte.test.ts
    components/
      index.svelte        # component gallery UI implementation
  services/
    todos.service.ts       # localStorage persistence, returns Effect
  effect/
    errors.ts              # Data.TaggedError definitions
    runtime.ts              # runSyncExit + Exit/Cause match helper
    index.ts                # barrel
  utils.ts                  # re-export facade (cn from the cn package, bits-ui types)
  routes/
    +layout.svelte           # app shell + nav
    +layout.ts               # SPA config (ssr=false, prerender=true)
    +page.svelte             # delegates to features/home
    todos/
      +page.svelte           # delegates to features/todos
    components/
      +page.svelte           # delegates to features/components
  app.css                    # Tailwind v4 CSS-first config + shadcn tokens
biome.json
eslint.config.js
prettier.config.js
vite.config.ts               # adapter, alias, vitest config
tsconfig.json
```
