import { Effect } from 'effect';
import { describe, expect, it } from 'vitest';
import { createCounterStore } from './counter.svelte';

describe('createCounterStore', () => {
	it('starts at 0 by default', () => {
		const store = createCounterStore();
		expect(store.count).toBe(0);
		expect(store.doubled).toBe(0);
	});

	it('starts at specified initial value', () => {
		const store = createCounterStore(5);
		expect(store.count).toBe(5);
		expect(store.doubled).toBe(10);
	});

	it('increment() increases count and succeeds with the new count', () => {
		const store = createCounterStore();
		const value = Effect.runSync(store.increment());
		expect(value).toBe(1);
		expect(store.count).toBe(1);
		expect(store.doubled).toBe(2);
	});

	it('decrement() decreases count and succeeds with the new count', () => {
		const store = createCounterStore();
		Effect.runSync(store.increment());
		const value = Effect.runSync(store.decrement());
		expect(value).toBe(0);
		expect(store.count).toBe(0);
		expect(store.doubled).toBe(0);
	});

	it('reset() returns to initial value', () => {
		const store = createCounterStore(3);
		Effect.runSync(store.increment());
		Effect.runSync(store.increment());
		expect(store.count).toBe(5);
		Effect.runSync(store.reset());
		expect(store.count).toBe(3);
		expect(store.doubled).toBe(6);
	});

	it('doubled always equals count * 2', () => {
		const store = createCounterStore();
		Effect.runSync(store.increment());
		Effect.runSync(store.increment());
		expect(store.count).toBe(2);
		expect(store.doubled).toBe(4);
		Effect.runSync(store.decrement());
		expect(store.count).toBe(1);
		expect(store.doubled).toBe(2);
		Effect.runSync(store.reset());
		expect(store.count).toBe(0);
		expect(store.doubled).toBe(0);
	});
});
