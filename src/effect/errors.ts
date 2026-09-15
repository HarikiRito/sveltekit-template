import { Data } from 'effect';

export class EmptyTextError extends Data.TaggedError('EmptyTextError') {}

export class StorageParseError extends Data.TaggedError('StorageParseError')<{
	readonly cause: unknown;
}> {}

export class StorageWriteError extends Data.TaggedError('StorageWriteError')<{
	readonly cause: unknown;
}> {}

export class TodoNotFoundError extends Data.TaggedError('TodoNotFoundError')<{
	readonly id: string;
}> {}

/** What a defect or interrupt collapses into — there's no typed error to narrow to. */
export class UnexpectedError extends Data.TaggedError('UnexpectedError')<{
	readonly cause: unknown;
}> {}

export type AppError =
	| EmptyTextError
	| StorageParseError
	| StorageWriteError
	| TodoNotFoundError
	| UnexpectedError;
