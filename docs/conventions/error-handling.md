# Error handling

Effect-based typed error handling. See [../index.md](../index.md) for the full convention list and [state.md](state.md) for the store pattern that returns these effects.

- **`effect@4.0.0-rc.115`**, exact pin — v4 is prerelease-only (no stable release yet); pin exactly, never `^`/`~`, and don't upgrade without re-checking the rc API
- No `try`/`catch` anywhere in `src/` — synchronous throwing APIs (`JSON.parse`, `localStorage`) are wrapped with `Effect.try`; services and stores return `Effect` values instead of throwing
- Tagged errors live in `src/effect/errors.ts`, built with `Data.TaggedError`

```ts
export class TodoNotFoundError extends Data.TaggedError('TodoNotFoundError')<{
  readonly id: string;
}> {}
```

## Services and stores return Effects

`src/services/todos.service.ts` wraps `localStorage`/`JSON.parse` with `Effect.try`, mapping thrown values to a tagged error:

```ts
load(): Effect.Effect<Todo[], StorageParseError> {
  return Effect.gen(function* () {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = yield* Effect.try({
      try: (): unknown => JSON.parse(raw),
      catch: (cause) => new StorageParseError({ cause })
    });
    if (!Array.isArray(parsed)) return yield* new StorageParseError({ cause: parsed });
    return parsed as Todo[];
  });
}
```

`src/features/todos/todos.svelte.ts` follows the same shape — `createTodosStore()` methods return `Effect` values instead of throwing or returning a raw result:

- `add(text)` → `Effect.Effect<Todo, EmptyTextError>`
- `toggle(id)` / `remove(id)` → `Effect.Effect<void, TodoNotFoundError>`
- `clear()` → `Effect.Effect<void>` — no failure mode, so no error type

## UI executes at the edge

The Svelte layer is the only place effects actually run, via the helpers in `src/effect/runtime.ts`:

```ts
export function runSyncExit<A, E>(effect: Effect.Effect<A, E>): Exit.Exit<A, E> {
  return Effect.runSyncExit(effect);
}

export function matchExit<A, E, R>(
  exit: Exit.Exit<A, E>,
  handlers: { onSuccess: (value: A) => R; onFailure: (error: E) => R }
): R {
  return Exit.match(exit, {
    onSuccess: handlers.onSuccess,
    onFailure: (cause) => handlers.onFailure(Option.getOrThrow(Cause.findErrorOption(cause)))
  });
}
```

A component calls a store/service method, runs the returned effect with `runSyncExit`, then branches with `matchExit` — `onFailure` receives the narrowed tagged error (by `._tag`), no `try`/`catch` needed:

```ts
matchExit(runSyncExit(store.add(inputText)), {
  onSuccess: () => (inputText = ''),
  onFailure: (error) => {
    if (error._tag === 'EmptyTextError') toast.error('Todo text cannot be empty');
  }
});
```

## Adding a new error type

1. Add a `Data.TaggedError` class to `src/effect/errors.ts`, with a payload field for any context the caller needs (e.g. `{ id: string }`)
2. Return it from the failing branch of the service/store method's `Effect.Effect<A, E>` signature
3. Handle it in the UI's `matchExit` `onFailure`, switching on `._tag`
