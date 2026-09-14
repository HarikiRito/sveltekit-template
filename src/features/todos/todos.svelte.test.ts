import { Cause, Effect, Exit, Option } from 'effect';
import { describe, expect, it } from 'vitest';
import { createTodosStore } from './todos.svelte';

function failureOf<A, E>(exit: Exit.Exit<A, E>): E {
	if (!Exit.isFailure(exit)) throw new Error('expected a failed Exit');
	return Option.getOrThrow(Cause.findErrorOption(exit.cause));
}

describe('createTodosStore', () => {
	it('starts empty with no initial todos', () => {
		const store = createTodosStore();
		expect(store.todos.length).toBe(0);
		expect(store.remaining).toBe(0);
		expect(store.completed).toBe(0);
	});

	it('add() adds a valid todo and succeeds with it', () => {
		const store = createTodosStore();
		const exit = Effect.runSyncExit(store.add('Buy milk'));
		expect(Exit.isSuccess(exit)).toBe(true);
		expect(store.todos.length).toBe(1);
		expect(store.remaining).toBe(1);
		expect(store.completed).toBe(0);
		if (Exit.isSuccess(exit)) {
			expect(exit.value.text).toBe('Buy milk');
			expect(exit.value.done).toBe(false);
		}
	});

	it('add() fails with EmptyTextError for empty string without mutation', () => {
		const store = createTodosStore();
		Effect.runSync(store.add('Buy milk'));
		const exit = Effect.runSyncExit(store.add(''));
		expect(failureOf(exit)._tag).toBe('EmptyTextError');
		expect(store.todos.length).toBe(1);
	});

	it('add() fails with EmptyTextError for whitespace-only string', () => {
		const store = createTodosStore();
		const exit = Effect.runSyncExit(store.add('   '));
		expect(failureOf(exit)._tag).toBe('EmptyTextError');
	});

	it('toggle() marks a todo done and updates derived counts', () => {
		const store = createTodosStore();
		const todo = Effect.runSync(store.add('Buy milk'));
		const exit = Effect.runSyncExit(store.toggle(todo.id));
		expect(Exit.isSuccess(exit)).toBe(true);
		expect(store.todos[0].done).toBe(true);
		expect(store.remaining).toBe(0);
		expect(store.completed).toBe(1);
	});

	it('toggle() fails with TodoNotFoundError for an unknown id', () => {
		const store = createTodosStore();
		const exit = Effect.runSyncExit(store.toggle('missing-id'));
		const error = failureOf(exit);
		expect(error._tag).toBe('TodoNotFoundError');
		expect(error.id).toBe('missing-id');
	});

	it('remove() removes a todo', () => {
		const store = createTodosStore();
		Effect.runSync(store.add('Buy milk'));
		const todo2 = Effect.runSync(store.add('Walk dog'));
		const exit = Effect.runSyncExit(store.remove(todo2.id));
		expect(Exit.isSuccess(exit)).toBe(true);
		expect(store.todos.length).toBe(1);
		expect(store.todos[0].text).toBe('Buy milk');
	});

	it('remove() fails with TodoNotFoundError for an unknown id', () => {
		const store = createTodosStore();
		Effect.runSync(store.add('Buy milk'));
		const exit = Effect.runSyncExit(store.remove('missing-id'));
		expect(failureOf(exit)._tag).toBe('TodoNotFoundError');
		expect(store.todos.length).toBe(1);
	});

	it('update() applies a patch to the matching todo', () => {
		const store = createTodosStore();
		const todo = Effect.runSync(store.add('Buy milk', { priority: 'low' }));
		const exit = Effect.runSyncExit(store.update(todo.id, { text: 'Buy oat milk' }));
		expect(Exit.isSuccess(exit)).toBe(true);
		expect(store.todos[0].text).toBe('Buy oat milk');
	});

	it('update() fails with TodoNotFoundError for an unknown id', () => {
		const store = createTodosStore();
		const exit = Effect.runSyncExit(store.update('missing-id', { text: 'x' }));
		const error = failureOf(exit);
		expect(error._tag).toBe('TodoNotFoundError');
		expect(error.id).toBe('missing-id');
	});

	it('update() with a partial patch leaves other fields intact', () => {
		const store = createTodosStore();
		const todo = Effect.runSync(
			store.add('Buy milk', { priority: 'low', description: 'from the store', assignee: 'Al' })
		);
		Effect.runSync(store.update(todo.id, { priority: 'high' }));
		const updated = store.todos[0];
		expect(updated.priority).toBe('high');
		expect(updated.text).toBe('Buy milk');
		expect(updated.description).toBe('from the store');
		expect(updated.assignee).toBe('Al');
		expect(updated.done).toBe(false);
	});

	it('clear() removes all todos and cannot fail', () => {
		const store = createTodosStore();
		Effect.runSync(store.add('Buy milk'));
		Effect.runSync(store.add('Walk dog'));
		const exit = Effect.runSyncExit(store.clear());
		expect(Exit.isSuccess(exit)).toBe(true);
		expect(store.todos.length).toBe(0);
		expect(store.remaining).toBe(0);
		expect(store.completed).toBe(0);
	});

	it('add, toggle, remove, and clear all work together in sequence', () => {
		const store = createTodosStore();

		const first = Effect.runSync(store.add('Buy milk'));
		expect(store.todos.length).toBe(1);
		expect(store.remaining).toBe(1);
		expect(store.completed).toBe(0);

		Effect.runSync(store.add('Walk dog'));
		expect(store.todos.length).toBe(2);
		expect(store.remaining).toBe(2);

		Effect.runSync(store.toggle(first.id));
		expect(store.todos.find((t) => t.id === first.id)?.done).toBe(true);
		expect(store.remaining).toBe(1);
		expect(store.completed).toBe(1);

		const secondTodo = store.todos.find((t) => t.text === 'Walk dog');
		expect(secondTodo).toBeDefined();
		if (!secondTodo) return;
		Effect.runSync(store.remove(secondTodo.id));
		expect(store.todos.length).toBe(1);

		const errExit = Effect.runSyncExit(store.add(''));
		expect(failureOf(errExit)._tag).toBe('EmptyTextError');
		expect(store.todos.length).toBe(1);

		Effect.runSync(store.clear());
		expect(store.todos.length).toBe(0);
		expect(store.remaining).toBe(0);
		expect(store.completed).toBe(0);
	});
});
