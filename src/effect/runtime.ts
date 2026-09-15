import { Cause, Effect, Exit, Option } from 'effect';
// UI coupling accepted here so call sites stay free of toast imports/logic.
import { toast } from 'svelte-sonner';
import { type AppError, UnexpectedError } from './errors';

function toAppError<E extends AppError>(cause: Cause.Cause<E>): AppError {
	// findErrorOption is None for a defect/interrupt (no typed error in the cause) — never throw, synthesize instead.
	return Option.getOrElse(Cause.findErrorOption(cause), () => new UnexpectedError({ cause }));
}

export function messageFor(error: AppError): string {
	switch (error._tag) {
		case 'EmptyTextError':
			return 'Todo text cannot be empty';
		case 'StorageParseError':
			return 'Could not load saved todos';
		case 'StorageWriteError':
			return 'Failed to save todos to local storage';
		case 'TodoNotFoundError':
			return `Todo not found (${error.id})`;
		case 'UnexpectedError':
			return 'Something unexpected went wrong';
	}
}

/** Runs an effect and returns its value, or `undefined` + a toast on failure. Never throws. */
export function run<A, E extends AppError>(effect: Effect.Effect<A, E>): A | undefined {
	const exit = Effect.runSyncExit(effect);
	if (Exit.isSuccess(exit)) return exit.value;
	toast.error(messageFor(toAppError(exit.cause)));
	return undefined;
}

/** Like `run`, but for `Effect<void, E>` — `undefined` is a valid success value, so this reports ok/fail as a boolean instead. */
export function runOk<E extends AppError>(effect: Effect.Effect<void, E>): boolean {
	const exit = Effect.runSyncExit(effect);
	if (Exit.isSuccess(exit)) return true;
	toast.error(messageFor(toAppError(exit.cause)));
	return false;
}
