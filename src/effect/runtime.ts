import { Cause, Effect, Exit, Option } from 'effect';

/** Runs an effect synchronously to an `Exit`, for the UI layer to branch on without try/catch. */
export function runSyncExit<A, E>(effect: Effect.Effect<A, E>): Exit.Exit<A, E> {
	return Effect.runSyncExit(effect);
}

/** Branches on an `Exit`, narrowing the failure to the effect's tagged error type. */
export function matchExit<A, E, R>(
	exit: Exit.Exit<A, E>,
	handlers: { onSuccess: (value: A) => R; onFailure: (error: E) => R }
): R {
	return Exit.match(exit, {
		onSuccess: handlers.onSuccess,
		// our effects only ever fail with a typed error (no defects/interrupts), so this is always present
		onFailure: (cause) => handlers.onFailure(Option.getOrThrow(Cause.findErrorOption(cause)))
	});
}
