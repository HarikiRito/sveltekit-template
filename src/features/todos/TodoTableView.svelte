<script lang="ts">
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from 'src/components/ui/table/index.js';
	import { Checkbox } from 'src/components/ui/checkbox/index.js';
	import { Badge } from 'src/components/ui/badge/index.js';
	import { Avatar, AvatarFallback } from 'src/components/ui/avatar/index.js';
	import { cn } from 'src/utils.js';
	import { priorityBadgeVariant, priorityLabel, initialsFor } from './constants';
	import TodoRowActions from './TodoRowActions.svelte';
	import type { Todo } from './todos.svelte';

	let {
		todos,
		onToggle,
		onView,
		onEdit,
		onDelete
	}: {
		todos: Todo[];
		onToggle: (id: string) => void;
		onView: (todo: Todo) => void;
		onEdit: (todo: Todo) => void;
		onDelete: (todo: Todo) => void;
	} = $props();
</script>

{#if todos.length === 0}
	<p class="text-muted-foreground py-6 text-center text-sm">No todos to show.</p>
{:else}
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead class="w-10"></TableHead>
				<TableHead>Task</TableHead>
				<TableHead>Priority</TableHead>
				<TableHead>Assignee</TableHead>
				<TableHead class="text-right">Actions</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each todos as todo (todo.id)}
				<TableRow>
					<TableCell>
						<Checkbox
							checked={todo.done}
							onCheckedChange={() => onToggle(todo.id)}
							aria-label={`Toggle "${todo.text}"`}
						/>
					</TableCell>
					<TableCell class={cn(todo.done && 'text-muted-foreground line-through')}>
						{todo.text}
					</TableCell>
					<TableCell>
						{#if todo.priority}
							<Badge variant={priorityBadgeVariant[todo.priority]}>
								{priorityLabel[todo.priority]}
							</Badge>
						{/if}
					</TableCell>
					<TableCell>
						<div class="flex items-center gap-2">
							<Avatar size="sm">
								<AvatarFallback>{initialsFor(todo.assignee ?? '')}</AvatarFallback>
							</Avatar>
							<span class="text-sm">{todo.assignee ?? 'Unassigned'}</span>
						</div>
					</TableCell>
					<TableCell class="text-right">
						<div class="flex justify-end">
							<TodoRowActions
								onView={() => onView(todo)}
								onEdit={() => onEdit(todo)}
								onDelete={() => onDelete(todo)}
							/>
						</div>
					</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
{/if}
