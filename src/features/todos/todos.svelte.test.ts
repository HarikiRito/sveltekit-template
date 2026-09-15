import { Cause, Effect, Exit, Option } from 'effect';
import { beforeEach, describe, expect, it } from 'vitest';
import { TodosStore } from './todos.svelte';

function failureOf<A, E>(exit: Exit.Exit<A, E>): E {
	if (!Exit.isFailure(exit)) throw new Error('expected a failed Exit');
	const error = Cause.findErrorOption(exit.cause);
	if (Option.isNone(error)) throw new Error('expected a typed error, got a defect/interrupt');
	return error.value;
}

describe('TodosStore', () => {
	beforeEach(() => TodosStore.reset());

	it('starts empty with no initial todos', () => {
		expect(TodosStore.todos.length).toBe(0);
		expect(TodosStore.remaining).toBe(0);
		expect(TodosStore.completed).toBe(0);
	});

	it('add() adds a valid todo and succeeds with it', () => {
		const exit = Effect.runSyncExit(TodosStore.add('Buy milk'));
		expect(Exit.isSuccess(exit)).toBe(true);
		expect(TodosStore.todos.length).toBe(1);
		expect(TodosStore.remaining).toBe(1);
		expect(TodosStore.completed).toBe(0);
		if (Exit.isSuccess(exit)) {
			expect(exit.value.text).toBe('Buy milk');
			expect(exit.value.done).toBe(false);
		}
	});

	it('add() fails with EmptyTextError for empty string without mutation', () => {
		Effect.runSync(TodosStore.add('Buy milk'));
		const exit = Effect.runSyncExit(TodosStore.add(''));
		expect(failureOf(exit)._tag).toBe('EmptyTextError');
		expect(TodosStore.todos.length).toBe(1);
	});

	it('add() fails with EmptyTextError for whitespace-only string', () => {
		const exit = Effect.runSyncExit(TodosStore.add('   '));
		expect(failureOf(exit)._tag).toBe('EmptyTextError');
	});

	it('toggle() marks a todo done and updates derived counts', () => {
		const todo = Effect.runSync(TodosStore.add('Buy milk'));
		const exit = Effect.runSyncExit(TodosStore.toggle(todo.id));
		expect(Exit.isSuccess(exit)).toBe(true);
		expect(TodosStore.todos[0].done).toBe(true);
		expect(TodosStore.remaining).toBe(0);
		expect(TodosStore.completed).toBe(1);
	});

	it('toggle() fails with TodoNotFoundError for an unknown id', () => {
		const exit = Effect.runSyncExit(TodosStore.toggle('missing-id'));
		const error = failureOf(exit);
		expect(error._tag).toBe('TodoNotFoundError');
		expect(error.id).toBe('missing-id');
	});

	it('remove() removes a todo', () => {
		Effect.runSync(TodosStore.add('Buy milk'));
		const todo2 = Effect.runSync(TodosStore.add('Walk dog'));
		const exit = Effect.runSyncExit(TodosStore.remove(todo2.id));
		expect(Exit.isSuccess(exit)).toBe(true);
		expect(TodosStore.todos.length).toBe(1);
		expect(TodosStore.todos[0].text).toBe('Buy milk');
	});

	it('remove() fails with TodoNotFoundError for an unknown id', () => {
		Effect.runSync(TodosStore.add('Buy milk'));
		const exit = Effect.runSyncExit(TodosStore.remove('missing-id'));
		expect(failureOf(exit)._tag).toBe('TodoNotFoundError');
		expect(TodosStore.todos.length).toBe(1);
	});

	it('clear() removes all todos and cannot fail', () => {
		Effect.runSync(TodosStore.add('Buy milk'));
		Effect.runSync(TodosStore.add('Walk dog'));
		const exit = Effect.runSyncExit(TodosStore.clear());
		expect(Exit.isSuccess(exit)).toBe(true);
		expect(TodosStore.todos.length).toBe(0);
		expect(TodosStore.remaining).toBe(0);
		expect(TodosStore.completed).toBe(0);
	});

	it('add, toggle, remove, and clear all work together in sequence', () => {
		const first = Effect.runSync(TodosStore.add('Buy milk'));
		expect(TodosStore.todos.length).toBe(1);
		expect(TodosStore.remaining).toBe(1);
		expect(TodosStore.completed).toBe(0);

		Effect.runSync(TodosStore.add('Walk dog'));
		expect(TodosStore.todos.length).toBe(2);
		expect(TodosStore.remaining).toBe(2);

		Effect.runSync(TodosStore.toggle(first.id));
		expect(TodosStore.todos.find((t) => t.id === first.id)?.done).toBe(true);
		expect(TodosStore.remaining).toBe(1);
		expect(TodosStore.completed).toBe(1);

		const secondTodo = TodosStore.todos.find((t) => t.text === 'Walk dog');
		expect(secondTodo).toBeDefined();
		if (!secondTodo) return;
		Effect.runSync(TodosStore.remove(secondTodo.id));
		expect(TodosStore.todos.length).toBe(1);

		const errExit = Effect.runSyncExit(TodosStore.add(''));
		expect(failureOf(errExit)._tag).toBe('EmptyTextError');
		expect(TodosStore.todos.length).toBe(1);

		Effect.runSync(TodosStore.clear());
		expect(TodosStore.todos.length).toBe(0);
		expect(TodosStore.remaining).toBe(0);
		expect(TodosStore.completed).toBe(0);
	});

	it('init() seeds todos and recomputes remaining/completed', () => {
		TodosStore.init([
			{ id: '1', text: 'Buy milk', done: false },
			{ id: '2', text: 'Walk dog', done: true }
		]);
		expect(TodosStore.todos.length).toBe(2);
		expect(TodosStore.remaining).toBe(1);
		expect(TodosStore.completed).toBe(1);
	});

	it('reset() clears todos, text, and clearOpen back to defaults', () => {
		TodosStore.init([{ id: '1', text: 'Buy milk', done: false }]);
		TodosStore.text = 'draft';
		TodosStore.clearOpen = true;

		TodosStore.reset();

		expect(TodosStore.todos).toEqual([]);
		expect(TodosStore.text).toBe('');
		expect(TodosStore.clearOpen).toBe(false);
	});
});
