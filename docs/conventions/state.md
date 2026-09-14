# State

Svelte 5 runes and the store-factory pattern. See [error-handling.md](error-handling.md) for how mutations report failure.

- State uses Svelte 5 runes — `$state` for mutable values, `$derived` for computed values
- Each feature with state exposes a `createXStore()` factory, instantiated per-component (not a module-level singleton)
- The factory returns a plain object of getters plus mutation methods — never the raw `$state` variable

```ts
export function createMyStore(initial = 0) {
  let count = $state(initial);
  const doubled = $derived(count * 2);

  function increment() {
    count += 1;
    return /* Effect value, see error-handling.md */;
  }

  return {
    get count() { return count; },
    get doubled() { return doubled; },
    increment
  };
}
```

- Mutation methods return `Effect` values rather than throwing or returning raw results — see [error-handling.md](error-handling.md) for the full pattern, tagged errors, and how the UI runs/matches them.
