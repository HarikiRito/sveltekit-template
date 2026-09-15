import { Effect, Exit } from 'effect';

/** Runs an effect and returns its value, or `undefined` on any failure (typed, defect, or interrupt). Never throws. */
export function run<A, E>(effect: Effect.Effect<A, E>): A | undefined {
	const exit = Effect.runSyncExit(effect);
	return Exit.isSuccess(exit) ? exit.value : undefined;
}

/** Like `run`, but for `Effect<void, E>` — `undefined` is a valid success value, so this reports ok/fail as a boolean instead. */
export function runOk<E>(effect: Effect.Effect<void, E>): boolean {
	return Exit.isSuccess(Effect.runSyncExit(effect));
}
