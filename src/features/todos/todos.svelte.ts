import { Effect } from 'effect';
import { EmptyTextError, TodoNotFoundError } from 'src/effect';
import type { Priority } from './constants';

export interface Todo {
	id: string;
	text: string;
	done: boolean;
	priority?: Priority;
	description?: string;
	assignee?: string;
}

export interface NewTodoInput {
	priority?: Priority;
	description?: string;
	assignee?: string;
}

export type TodoPatch = Partial<Omit<Todo, 'id'>>;

export function createTodosStore(initial: Todo[] = []) {
	let todos = $state<Todo[]>(initial);

	const remaining = $derived(todos.filter((t) => !t.done).length);
	const completed = $derived(todos.length - remaining);

	function add(text: string, extra: NewTodoInput = {}): Effect.Effect<Todo, EmptyTextError> {
		return Effect.gen(function* () {
			const trimmed = text.trim();
			if (!trimmed) return yield* new EmptyTextError();

			const todo: Todo = { id: crypto.randomUUID(), text: trimmed, done: false, ...extra };
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

	// text/priority/description/assignee only — id and done stay under the store's control
	function update(id: string, patch: TodoPatch): Effect.Effect<void, TodoNotFoundError> {
		return Effect.gen(function* () {
			if (!todos.some((t) => t.id === id)) return yield* new TodoNotFoundError({ id });
			todos = todos.map((t) => (t.id === id ? { ...t, ...patch } : t));
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
		update,
		remove,
		clear
	};
}
