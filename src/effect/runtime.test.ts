import { Effect } from 'effect';
import { describe, expect, it } from 'vitest';
import { EmptyTextError, TodoNotFoundError } from './errors';
import { messageFor, run, runOk } from './runtime';

describe('run', () => {
	it('returns the success value', () => {
		expect(run(Effect.succeed(42))).toBe(42);
	});

	it('returns undefined for a typed failure', () => {
		expect(run(Effect.fail(new EmptyTextError()))).toBeUndefined();
	});

	it('never throws for a defect, and still returns undefined', () => {
		const dies = Effect.sync((): number => {
			throw new Error('boom');
		});
		expect(() => run(dies)).not.toThrow();
		expect(run(dies)).toBeUndefined();
	});
});

describe('runOk', () => {
	it('returns true on success', () => {
		expect(runOk(Effect.void)).toBe(true);
	});

	it('returns false on typed failure', () => {
		expect(runOk(Effect.fail(new TodoNotFoundError({ id: 'x' })))).toBe(false);
	});

	it('never throws for a defect, and still returns false', () => {
		const dies = Effect.sync((): void => {
			throw new Error('boom');
		});
		expect(() => runOk(dies)).not.toThrow();
		expect(runOk(dies)).toBe(false);
	});
});

describe('messageFor', () => {
	it('maps every tagged error to a non-empty message', () => {
		expect(messageFor(new EmptyTextError())).not.toBe('');
		expect(messageFor(new TodoNotFoundError({ id: 'x' }))).toContain('x');
	});
});
