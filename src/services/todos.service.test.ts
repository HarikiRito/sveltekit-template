import { Cause, Effect, Exit, Option } from 'effect';
import type { Todo } from 'src/features/todos/todos.svelte';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TodosService } from './todos.service';

function failureOf<A, E>(exit: Exit.Exit<A, E>): E {
	if (!Exit.isFailure(exit)) throw new Error('expected a failed Exit');
	const error = Cause.findErrorOption(exit.cause);
	if (Option.isNone(error)) throw new Error('expected a typed error, got a defect/interrupt');
	return error.value;
}

function stubLocalStorage(overrides: Partial<Storage> = {}) {
	const store = new Map<string, string>();
	const stub: Storage = {
		getItem: (key: string) => store.get(key) ?? null,
		setItem: (key: string, value: string) => {
			store.set(key, value);
		},
		removeItem: (key: string) => {
			store.delete(key);
		},
		clear: () => store.clear(),
		key: () => null,
		get length() {
			return store.size;
		},
		...overrides
	};
	Object.defineProperty(globalThis, 'localStorage', { value: stub, configurable: true });
}

describe('TodosService', () => {
	const originalLocalStorage = globalThis.localStorage;

	beforeEach(() => {
		stubLocalStorage();
	});

	afterEach(() => {
		Object.defineProperty(globalThis, 'localStorage', {
			value: originalLocalStorage,
			configurable: true
		});
	});

	it('load() returns [] when storage is empty', () => {
		const exit = Effect.runSyncExit(TodosService.load());
		expect(Exit.isSuccess(exit)).toBe(true);
		if (Exit.isSuccess(exit)) expect(exit.value).toEqual([]);
	});

	it('load() returns parsed todos for valid JSON', () => {
		const todos: Todo[] = [{ id: '1', text: 'Buy milk', done: false }];
		localStorage.setItem('todos', JSON.stringify(todos));
		const exit = Effect.runSyncExit(TodosService.load());
		expect(Exit.isSuccess(exit)).toBe(true);
		if (Exit.isSuccess(exit)) expect(exit.value).toEqual(todos);
	});

	it('load() fails with StorageParseError for malformed JSON', () => {
		localStorage.setItem('todos', '{not valid json');
		const exit = Effect.runSyncExit(TodosService.load());
		expect(failureOf(exit)._tag).toBe('StorageParseError');
	});

	it('load() fails with StorageParseError for non-array JSON', () => {
		localStorage.setItem('todos', JSON.stringify({ not: 'an array' }));
		const exit = Effect.runSyncExit(TodosService.load());
		expect(failureOf(exit)._tag).toBe('StorageParseError');
	});

	it('load() fails with StorageParseError when getItem throws', () => {
		stubLocalStorage({
			getItem: () => {
				throw new Error('SecurityError');
			}
		});
		const exit = Effect.runSyncExit(TodosService.load());
		expect(failureOf(exit)._tag).toBe('StorageParseError');
	});

	it('save() writes serialized todos to storage', () => {
		const todos: Todo[] = [{ id: '1', text: 'Buy milk', done: false }];
		const exit = Effect.runSyncExit(TodosService.save(todos));
		expect(Exit.isSuccess(exit)).toBe(true);
		expect(localStorage.getItem('todos')).toBe(JSON.stringify(todos));
	});

	it('save() fails with StorageWriteError when setItem throws', () => {
		stubLocalStorage({
			setItem: () => {
				throw new Error('QuotaExceededError');
			}
		});
		const exit = Effect.runSyncExit(TodosService.save([]));
		expect(failureOf(exit)._tag).toBe('StorageWriteError');
	});
});
