import { Data, Effect } from 'effect';

export class EmptyTextError extends Data.TaggedError('EmptyTextError') {}

export class TodoNotFoundError extends Data.TaggedError('TodoNotFoundError')<{
	readonly id: string;
}> {}

export interface Todo {
	id: string;
	text: string;
	done: boolean;
}

export function createTodosStore(initial: Todo[] = []) {
	let todos = $state<Todo[]>(initial);

	const remaining = $derived(todos.filter((t) => !t.done).length);
	const completed = $derived(todos.length - remaining);

	function add(text: string): Effect.Effect<Todo, EmptyTextError> {
		return Effect.gen(function* () {
			const trimmed = text.trim();
			if (!trimmed) return yield* new EmptyTextError();

			const todo: Todo = { id: crypto.randomUUID(), text: trimmed, done: false };
			todos = [...todos, todo];
			return todo;
		});
	}

	function toggle(id: string): Effect.Effect<void, TodoNotFoundError> {
		return Effect.gen(function* () {
			if (!todos.some((t) => t.id === id)) return yield* new TodoNotFoundError({ id });
			todos = todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
		});
	}

	function remove(id: string): Effect.Effect<void, TodoNotFoundError> {
		return Effect.gen(function* () {
			if (!todos.some((t) => t.id === id)) return yield* new TodoNotFoundError({ id });
			todos = todos.filter((t) => t.id !== id);
		});
	}

	function clear(): Effect.Effect<void> {
		return Effect.sync(() => {
			todos = [];
		});
	}

	return {
		get todos() {
			return todos;
		},
		get remaining() {
			return remaining;
		},
		get completed() {
			return completed;
		},
		add,
		toggle,
		remove,
		clear
	};
}
