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

The Svelte layer is the only place effects actually run, via `run`/`runOk` in `src/effect/runtime.ts`. A component calls a store/service method and passes the returned effect straight to one of these — no per-call-site success/failure branching:

```ts
function toAppError<E extends AppError>(cause: Cause.Cause<E>): AppError {
  // findErrorOption is None for a defect/interrupt (no typed error in the cause) — never throw, synthesize instead.
  return Option.getOrElse(Cause.findErrorOption(cause), () => new UnexpectedError({ cause }));
}

export function run<A, E extends AppError>(effect: Effect.Effect<A, E>): A | undefined {
  const exit = Effect.runSyncExit(effect);
  if (Exit.isSuccess(exit)) return exit.value;
  toast.error(messageFor(toAppError(exit.cause)));
  return undefined;
}
```

`run` returns the success value, or `undefined` after reporting a toast on failure — including defects and interrupts, which it collapses into `UnexpectedError` rather than ever throwing. Call sites read as a single line plus a guard:

```ts
const todo = run(store.add(addText, { priority: addPriority as Priority }));
if (!todo) return;
addText = '';
toast.success(`Added "${todo.text}"`);
persist();
```

`Effect<void, E>` is ambiguous under `run` — `undefined` is both "succeeded with no value" and "failed". `runOk` is the `void`-returning variant: it reports the same way but returns a `boolean`, so `toggle`/`remove`/`update` call sites guard on it directly:

```ts
if (!runOk(store.toggle(id))) return;
const todo = store.todos.find((t) => t.id === id);
toast.success(todo?.done ? 'Marked as done' : 'Marked as active');
persist();
```

Failure messages live in one place, `messageFor`, an exhaustive switch on `._tag` (ESLint's `switch-exhaustiveness-check` fails the build if a new tag isn't mapped):

```ts
export function messageFor(error: AppError): string {
  switch (error._tag) {
    case 'EmptyTextError':
      return 'Todo text cannot be empty';
    case 'StorageParseError':
      return 'Could not load saved todos';
    case 'StorageWriteError':
      return 'Failed to save todos to local storage';
    case 'TodoNotFoundError':
      return `Todo not found (${error.id})`;
    case 'UnexpectedError':
      return 'Something unexpected went wrong';
  }
}
```

Success toasts stay at the call site (they're context-specific — "Added", "Marked as done", "Todo deleted"); failure toasts always come from `messageFor` via `run`/`runOk`, never written inline.

## Adding a new error type

1. Add a `Data.TaggedError` class to `src/effect/errors.ts` and add it to the `AppError` union, with a payload field for any context the caller needs (e.g. `{ id: string }`)
2. Return it from the failing branch of the service/store method's `Effect.Effect<A, E>` signature
3. Add a case to `messageFor` in `src/effect/runtime.ts` — the exhaustiveness check won't let you skip this
