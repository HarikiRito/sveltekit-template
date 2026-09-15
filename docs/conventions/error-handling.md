# Error handling

Effect-based typed error handling. See [../index.md](../index.md) for the full convention list and [state.md](state.md) for the store pattern that returns these effects.

- **`effect@4.0.0-rc.115`**, exact pin — v4 is prerelease-only (no stable release yet); pin exactly, never `^`/`~`, and don't upgrade without re-checking the rc API
- No `try`/`catch` anywhere in `src/` — synchronous throwing APIs (`JSON.parse`, `localStorage`) are wrapped with `Effect.try`; services and stores return `Effect` values instead of throwing
- Tagged errors live with the module that raises them, built with `Data.TaggedError` — not in a shared registry. `src/effect/` doesn't know any app error type exists.

```ts
// src/features/todos/todos.svelte.ts
export class TodoNotFoundError extends Data.TaggedError('TodoNotFoundError')<{
  readonly id: string;
}> {}
```

## Services and stores return Effects

`src/services/todos.service.ts` defines its own `StorageParseError`/`StorageWriteError` and wraps `localStorage`/`JSON.parse` with `Effect.try`, mapping thrown values to them:

```ts
export class StorageParseError extends Data.TaggedError('StorageParseError')<{
  readonly cause: unknown;
}> {}

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

`src/features/todos/todos.svelte.ts` defines `EmptyTextError`/`TodoNotFoundError` next to the module-private `Store` class (exported as the singleton instance `TodosStore`), whose methods return `Effect` values instead of throwing or returning a raw result:

- `add(text)` → `Effect.Effect<Todo, EmptyTextError>`
- `toggle(id)` / `remove(id)` → `Effect.Effect<void, TodoNotFoundError>`
- `clear()` → `Effect.Effect<void>` — no failure mode, so no error type

`todos.service.ts` imports `type Todo` from `todos.svelte.ts` with a type-only import, so no runtime import cycle exists between the two error-owning modules.

## `src/effect/` is a generic, defect-safe runner only

The Svelte layer is the only place effects actually run, via `run` in `src/effect/runtime.ts`. `run` returns a Rust-style tagged `Result` instead of throwing or returning `A | undefined` — `void` successes need a real `ok: true` case too, so a bare `A | undefined` can't tell "succeeded with `undefined`" apart from "failed". `run` is fully generic over the error type — no shared error-union constraint, no knowledge of any app error, no `toast` import:

```ts
export type Result<A, E> =
  | { readonly ok: true; readonly value: A }
  | { readonly ok: false; readonly error: E };

export class UnexpectedError extends Data.TaggedError('UnexpectedError')<{
  readonly cause: unknown;
}> {}

export function run<A, E>(effect: Effect.Effect<A, E>): Result<A, E | UnexpectedError> {
  const exit = Effect.runSyncExit(effect);
  if (Exit.isSuccess(exit)) return { ok: true, value: exit.value };

  const error = Cause.findErrorOption(exit.cause).pipe(
    Option.getOrElse(() => new UnexpectedError({ cause: exit.cause }))
  );
  return { ok: false, error };
}
```

`Effect.runSyncExit` never throws, even for a defect or interrupt — it always resolves to an `Exit`. A typed failure has a real `E` in its `Cause`, found via `Cause.findErrorOption`; a defect or interrupt has no typed `E`, so `Option.getOrElse` falls back to wrapping the whole `Cause` in `UnexpectedError`. `UnexpectedError` is infrastructure, not a feature error — it belongs in `src/effect/`, not with the feature errors. Either way `run` returns, never throws.

## Reporting happens at the call site

`run` doesn't know what a failure means, so it doesn't report anything — each call site in `src/features/todos/index.svelte` reports its own context-appropriate toast by checking `res.ok`:

```ts
const res = run(store.add(text));
if (!res.ok) {
  toast.error('Todo text cannot be empty');
  return;
}
text = '';
toast.success(`Added "${res.value.text}"`);
persist();
```

```ts
const res = run(store.toggle(id));
if (!res.ok) {
  toast.error('Could not update todo');
  return;
}
const todo = store.todos.find((t) => t.id === id);
toast.success(todo?.done ? 'Marked as done' : 'Marked as active');
persist();
```

Success toasts stay at the call site, same as before. Failure toasts move there too — every failure path still produces a toast, but the copy is written where the failure is handled, not funneled through a shared switch.

## Adding a new error type

1. Add a `Data.TaggedError` class in the module that raises it (store or service), not in `src/effect/`
2. Return it from the failing branch of that method's `Effect.Effect<A, E>` signature
3. At each call site that can hit the new failure, add a `toast.error(...)` with copy appropriate to that context
