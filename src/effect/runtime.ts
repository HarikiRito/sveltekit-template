import { Cause, Data, Effect, Exit, Option } from 'effect';

export type Result<A, E> =
	| { readonly ok: true; readonly value: A }
	| { readonly ok: false; readonly error: E };

export class UnexpectedError extends Data.TaggedError('UnexpectedError')<{
	readonly cause: unknown;
}> {}

/** Runs an effect synchronously. Defects/interrupts collapse into `UnexpectedError`. Never throws. */
export function run<A, E>(effect: Effect.Effect<A, E>): Result<A, E | UnexpectedError> {
	const exit = Effect.runSyncExit(effect);
	if (Exit.isSuccess(exit)) return { ok: true, value: exit.value };

	const error = Cause.findErrorOption(exit.cause).pipe(
		Option.getOrElse(() => new UnexpectedError({ cause: exit.cause }))
	);
	return { ok: false, error };
}
