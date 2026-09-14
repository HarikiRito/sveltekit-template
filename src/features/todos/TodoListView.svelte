<script lang="ts">
	import InboxIcon from '@lucide/svelte/icons/inbox';
	import { ScrollArea } from 'src/components/ui/scroll-area/index.js';
	import {
		Accordion,
		AccordionContent,
		AccordionItem,
		AccordionTrigger
	} from 'src/components/ui/accordion/index.js';
	import { Alert, AlertDescription, AlertTitle } from 'src/components/ui/alert/index.js';
	import { Checkbox } from 'src/components/ui/checkbox/index.js';
	import { Badge } from 'src/components/ui/badge/index.js';
	import { Avatar, AvatarFallback } from 'src/components/ui/avatar/index.js';
	import { cn } from 'src/utils.js';
	import { priorityBadgeVariant, priorityLabel, initialsFor } from './constants';
	import TodoRowActions from './TodoRowActions.svelte';
	import type { Todo } from './todos.svelte';

	let {
		activeTodos,
		completedTodos,
		density,
		onToggle,
		onView,
		onEdit,
		onDelete
	}: {
		activeTodos: Todo[];
		completedTodos: Todo[];
		density: string;
		onToggle: (id: string) => void;
		onView: (todo: Todo) => void;
		onEdit: (todo: Todo) => void;
		onDelete: (todo: Todo) => void;
	} = $props();
</script>

{#snippet row(todo: Todo)}
	<li class={cn('flex items-center gap-3', density === 'compact' ? 'py-1.5' : 'py-3')}>
		<Checkbox
			checked={todo.done}
			onCheckedChange={() => onToggle(todo.id)}
			aria-label={`Mark "${todo.text}" as ${todo.done ? 'active' : 'done'}`}
		/>
		<Avatar size="sm">
			<AvatarFallback>{initialsFor(todo.assignee ?? '')}</AvatarFallback>
		</Avatar>
		<button
			type="button"
			class={cn(
				'flex-1 text-left text-sm',
				todo.done && 'text-muted-foreground line-through'
			)}
			onclick={() => onView(todo)}
		>
			{todo.text}
		</button>
		{#if todo.priority}
			<Badge variant={priorityBadgeVariant[todo.priority]}>{priorityLabel[todo.priority]}</Badge>
		{/if}
		<TodoRowActions
			onView={() => onView(todo)}
			onEdit={() => onEdit(todo)}
			onDelete={() => onDelete(todo)}
		/>
	</li>
{/snippet}

{#if activeTodos.length === 0 && completedTodos.length === 0}
	<Alert>
		<InboxIcon />
		<AlertTitle>No todos yet</AlertTitle>
		<AlertDescription>Add your first task above to get started.</AlertDescription>
	</Alert>
{:else}
	<ScrollArea class="h-72 pr-3">
		{#if activeTodos.length === 0}
			<p class="text-muted-foreground py-6 text-center text-sm">All caught up.</p>
		{:else}
			<ul class="divide-y">
				{#each activeTodos as todo (todo.id)}
					{@render row(todo)}
				{/each}
			</ul>
		{/if}
	</ScrollArea>

	{#if completedTodos.length > 0}
		<Accordion type="single">
			<AccordionItem value="completed">
				<AccordionTrigger>Completed ({completedTodos.length})</AccordionTrigger>
				<AccordionContent>
					<ul class="divide-y">
						{#each completedTodos as todo (todo.id)}
							{@render row(todo)}
						{/each}
					</ul>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	{/if}
{/if}
