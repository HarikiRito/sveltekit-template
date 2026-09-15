import { Data, Effect } from 'effect';
import type { Todo } from 'src/features/todos/todos.svelte';

export class StorageParseError extends Data.TaggedError('StorageParseError')<{
	readonly cause: unknown;
}> {}

export class StorageWriteError extends Data.TaggedError('StorageWriteError')<{
	readonly cause: unknown;
}> {}

const KEY = 'todos';

export const TodosService = {
	load(): Effect.Effect<Todo[], StorageParseError> {
		return Effect.gen(function* () {
			const raw = yield* Effect.try({
				try: () => localStorage.getItem(KEY),
				catch: (cause) => new StorageParseError({ cause })
			});
			if (!raw) return [];

			const parsed = yield* Effect.try({
				try: (): unknown => JSON.parse(raw),
				catch: (cause) => new StorageParseError({ cause })
			});

			if (!Array.isArray(parsed)) return yield* new StorageParseError({ cause: parsed });
			return parsed as Todo[];
		});
	},

	save(todos: Todo[]): Effect.Effect<void, StorageWriteError> {
		return Effect.try({
			try: () => localStorage.setItem(KEY, JSON.stringify(todos)),
			catch: (cause) => new StorageWriteError({ cause })
		});
	}
};
