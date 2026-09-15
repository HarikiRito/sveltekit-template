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

	toggle(id: string): Effect.Effect<void, TodoNotFoundError> {
		return Effect.suspend(() => {
			if (!this.todos.some((t) => t.id === id)) return Effect.fail(new TodoNotFoundError({ id }));
			this.todos = this.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
			return Effect.void;
		});
	}

	remove(id: string): Effect.Effect<void, TodoNotFoundError> {
		return Effect.suspend(() => {
			if (!this.todos.some((t) => t.id === id)) return Effect.fail(new TodoNotFoundError({ id }));
			this.todos = this.todos.filter((t) => t.id !== id);
			return Effect.void;
		});
	}

	clear(): Effect.Effect<void> {
		return Effect.sync(() => {
			this.todos = [];
		});
	}
}

export const TodosStore = new Store();
