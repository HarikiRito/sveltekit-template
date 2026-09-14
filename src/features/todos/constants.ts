export const PRIORITIES = ['low', 'medium', 'high'] as const;
export type Priority = (typeof PRIORITIES)[number];

export const priorityLabel: Record<Priority, string> = {
	low: 'Low',
	medium: 'Medium',
	high: 'High'
};

export const priorityBadgeVariant: Record<Priority, 'outline' | 'secondary' | 'destructive'> = {
	low: 'outline',
	medium: 'secondary',
	high: 'destructive'
};

export const priorityRank: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

/** Falls back to "?" for an empty/unassigned name. */
export function initialsFor(name: string): string {
	const trimmed = name.trim();
	if (!trimmed) return '?';
	return trimmed
		.split(/\s+/)
		.map((part) => part[0])
		.join('')
		.slice(0, 2)
		.toUpperCase();
}
