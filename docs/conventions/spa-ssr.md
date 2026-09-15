# SPA ↔ SSR Toggle

The app ships as an SPA by default. To switch to SSR, change exactly **two files**.

**`vite.config.ts`** — swap the adapter:

```diff
- import adapter from '@sveltejs/adapter-static';
+ import adapter from '@sveltejs/adapter-node';
  // ...
-   adapter: adapter({ fallback: '200.html' }),
+   adapter: adapter(),
```

**`src/routes/+layout.ts`** — flip the flags:

```diff
- export const ssr = false;
- export const prerender = true;
+ export const ssr = true;
+ export const prerender = false;
```

To revert to SPA mode, undo those two changes.
