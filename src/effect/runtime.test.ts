import { Effect } from 'effect';
import { EmptyTextError, TodoNotFoundError } from 'src/features/todos/todos.svelte';
import { describe, expect, it } from 'vitest';
import { run, runAsync, UnexpectedError } from './runtime';

describe('run', () => {
	it('returns ok:true with the success value', () => {
		expect(run(Effect.succeed(42))).toEqual({ ok: true, value: 42 });
	});

	it('returns ok:false with the original tagged error for a typed failure', () => {
		const error = new TodoNotFoundError({ id: 'x' });
		const result = run(Effect.fail(error));
		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.error).toBe(error);
			expect(result.error._tag).toBe('TodoNotFoundError');
		}
	});

	it('never throws for a defect, collapsing it into an UnexpectedError', () => {
		const dies = Effect.sync((): number => {
			throw new Error('boom');
		});
		expect(() => run(dies)).not.toThrow();
		const result = run(dies);
		expect(result.ok).toBe(false);
		if (!result.ok) expect(result.error).toBeInstanceOf(UnexpectedError);
	});

	it('returns ok:true for a void effect', () => {
		expect(run(Effect.void)).toEqual({ ok: true, value: undefined });
	});

	it('returns ok:false for an empty-text failure', () => {
		const result = run(Effect.fail(new EmptyTextError()));
		expect(result.ok).toBe(false);
	});
});

describe('runAsync', () => {
	it('returns ok:true with the success value', async () => {
		expect(await runAsync(Effect.succeed(42))).toEqual({ ok: true, value: 42 });
	});

	it('returns ok:false with the original tagged error for a typed failure', async () => {
		const error = new TodoNotFoundError({ id: 'x' });
		const result = await runAsync(Effect.fail(error));
		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.error).toBe(error);
			expect(result.error._tag).toBe('TodoNotFoundError');
		}
	});

	it('never rejects for a defect, collapsing it into an UnexpectedError', async () => {
		const dies = Effect.sync((): number => {
			throw new Error('boom');
		});
		await expect(runAsync(dies)).resolves.toBeDefined();
		const result = await runAsync(dies);
		expect(result.ok).toBe(false);
		if (!result.ok) expect(result.error).toBeInstanceOf(UnexpectedError);
	});

	it('returns ok:false with InterruptedError for an already-aborted signal', async () => {
		const controller = new AbortController();
		controller.abort();
		const result = await runAsync(Effect.never, { signal: controller.signal });
		expect(result.ok).toBe(false);
		if (!result.ok) expect(result.error._tag).toBe('InterruptedError');
	});

	it('returns ok:false with InterruptedError when aborted mid-flight', async () => {
		const controller = new AbortController();
		const pending = runAsync(Effect.never, { signal: controller.signal });
		controller.abort();
		const result = await pending;
		expect(result.ok).toBe(false);
		if (!result.ok) expect(result.error._tag).toBe('InterruptedError');
	});
});
