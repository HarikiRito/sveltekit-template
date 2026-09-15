import { Cause, Data, Effect, Exit, Option } from 'effect';

export type Result<A, E> =
	| { readonly ok: true; readonly value: A }
	| { readonly ok: false; readonly error: E };

export class UnexpectedError extends Data.TaggedError('UnexpectedError')<{
	readonly cause: unknown;
}> {}

export class InterruptedError extends Data.TaggedError('InterruptedError') {}

function toResult<A, E>(exit: Exit.Exit<A, E>): Result<A, E | UnexpectedError | InterruptedError> {
	if (Exit.isSuccess(exit)) return { ok: true, value: exit.value };

	const error = Cause.findErrorOption(exit.cause).pipe(
		Option.getOrElse(() =>
			Cause.hasInterrupts(exit.cause)
				? new InterruptedError()
				: new UnexpectedError({ cause: exit.cause })
		)
	);
	return { ok: false, error };
}

/** Runs an effect synchronously. Defects/interrupts collapse into `UnexpectedError`. Never throws. */
export function run<A, E>(effect: Effect.Effect<A, E>): Result<A, E | UnexpectedError> {
	// a sync effect can't be interrupted from outside, so InterruptedError never actually occurs here
	return toResult(Effect.runSyncExit(effect)) as Result<A, E | UnexpectedError>;
}

/** Runs an effect asynchronously; an aborted `signal` yields `InterruptedError` instead of rejecting. */
export async function runAsync<A, E>(
	effect: Effect.Effect<A, E>,
	options?: { readonly signal?: AbortSignal }
): Promise<Result<A, E | UnexpectedError | InterruptedError>> {
	return toResult(await Effect.runPromiseExit(effect, options));
}
