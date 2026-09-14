import { Effect } from 'effect';

export function createCounterStore(initial = 0) {
	let count = $state(initial);
	const doubled = $derived(count * 2);

	function increment(): Effect.Effect<number> {
		return Effect.sync(() => {
			count += 1;
			return count;
		});
	}

	function decrement(): Effect.Effect<number> {
		return Effect.sync(() => {
			count -= 1;
			return count;
		});
	}

	function reset(): Effect.Effect<void> {
		return Effect.sync(() => {
			count = initial;
		});
	}

	return {
		get count() {
			return count;
		},
		get doubled() {
			return doubled;
		},
		increment,
		decrement,
		reset
	};
}
