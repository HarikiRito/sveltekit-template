# State

Svelte 5 runes and the page-scoped singleton store pattern. See [error-handling.md](error-handling.md) for how mutations report failure.

- State uses Svelte 5 runes — `$state` for mutable values, `$derived` for computed values
- One store per page: a **class**, instantiated once, exported as a single module-level instance named in PascalCase (`TodosStore`) — call sites read like a namespace (`TodosStore.todos`), not a factory, not instantiated per component
- The class itself (`Store`) is module-private and never exported — instantiation isn't a consumer concern, only the one instance is
- Class, not object literal — `$derived` is only legal as a class field or a variable declaration; an object-literal property can't hold it. That's the deciding reason for the class shape.
- **Why an instance, not a `static` class**: Svelte rejects `static x = $state(...)` at compile time (`state_invalid_placement` — `$state` is only legal as a variable-declaration initializer, a class field, or a first assignment to a class field in the constructor). A static class would need a module-level `$state` object plus a wall of static get/set accessors forwarding to it. The named instance gives the identical `TodosStore.todos` call site with none of that. Verified against Svelte 5.56.4.
- State and derived values are plain public properties. No getter-wrapper object, nothing to re-export — consumers read `TodosStore.x` directly.
- Defaults are plain literals written directly on the fields — no `initialState()` factory, no init guards. `reset()` reassigns those same literals field by field.
- UI draft state (input text, dialog open flags, etc.) lives in the store too — that's what makes `reset()` meaningful
- Mutation methods return `Effect` values instead of throwing or returning raw results — see [error-handling.md](error-handling.md) for the full pattern, tagged errors, and how the UI runs/matches them

```ts
class Store {
	todos = $state<Todo[]>([]);
	text = $state('');
	clearOpen = $state(false);

	remaining = $derived(this.todos.filter((t) => !t.done).length);
	completed = $derived(this.todos.length - this.remaining);

	init(todos: Todo[]): void {
		this.todos = todos;
	}

	reset(): void {
		this.todos = [];
		this.text = '';
		this.clearOpen = false;
	}

	add(text: string): Effect.Effect<Todo, EmptyTextError> {
		return Effect.suspend(() => {
			const trimmed = text.trim();
			if (!trimmed) return Effect.fail(new EmptyTextError());

			const todo: Todo = { id: crypto.randomUUID(), text: trimmed, done: false };
			this.todos = [...this.todos, todo];
			return Effect.succeed(todo);
		});
	}
}

export const TodosStore = new Store();
```

## Lifecycle

The page's root feature component owns init/reset, in `onMount`:

```ts
onMount(() => {
	const res = run(TodosService.load());
	if (!res.ok) toast.error('Could not load saved todos');
	TodosStore.init(res.ok ? res.value : []);
	return () => TodosStore.reset();
});
```

- `init()` seeds the store from loaded data on mount
- `reset()` restores defaults on unmount (the `onMount` cleanup return, fired when the page's root component unmounts)

## Gotchas

- `Effect.gen(function* () {})` generators are **not** arrow functions, so `this` is not lexically bound inside them. Use `Effect.suspend(() => ...)` / `Effect.sync(() => ...)` arrows for store methods instead — never `const self = this`.
- Module-level store state is safe here only because the app runs with `ssr=false` — under SSR it would leak state across requests. See [spa-ssr.md](spa-ssr.md).
