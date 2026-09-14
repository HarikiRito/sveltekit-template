<script lang="ts">
	import {
		Sheet,
		SheetContent,
		SheetDescription,
		SheetFooter,
		SheetHeader,
		SheetTitle
	} from 'src/components/ui/sheet/index.js';
	import { Badge } from 'src/components/ui/badge/index.js';
	import { Avatar, AvatarFallback } from 'src/components/ui/avatar/index.js';
	import { Separator } from 'src/components/ui/separator/index.js';
	import { Button } from 'src/components/ui/button/index.js';
	import { priorityBadgeVariant, priorityLabel, initialsFor } from './constants';
	import type { Todo } from './todos.svelte';

	let {
		open = $bindable(false),
		todo,
		onEdit
	}: {
		open?: boolean;
		todo: Todo | null;
		onEdit: () => void;
	} = $props();
</script>

<Sheet bind:open>
	<SheetContent>
		<SheetHeader>
			<SheetTitle>{todo?.text ?? 'Task detail'}</SheetTitle>
			<SheetDescription>{todo?.done ? 'Completed' : 'In progress'}</SheetDescription>
		</SheetHeader>

		{#if todo}
			<div class="flex flex-col gap-4 px-4">
				<div class="flex items-center gap-3">
					<Avatar>
						<AvatarFallback>{initialsFor(todo.assignee ?? '')}</AvatarFallback>
					</Avatar>
					<div class="flex flex-col">
						<span class="text-sm font-medium">{todo.assignee ?? 'Unassigned'}</span>
						<span class="text-muted-foreground text-xs">Assignee</span>
					</div>
				</div>

				<Separator />

				<div class="flex items-center gap-2">
					{#if todo.priority}
						<Badge variant={priorityBadgeVariant[todo.priority]}>
							{priorityLabel[todo.priority]}
						</Badge>
					{/if}
					<Badge variant={todo.done ? 'secondary' : 'outline'}>
						{todo.done ? 'Completed' : 'Active'}
					</Badge>
				</div>

				<div class="flex flex-col gap-1.5">
					<span class="text-sm font-medium">Description</span>
					<p class="text-muted-foreground text-sm">
						{todo.description || 'No description added.'}
					</p>
				</div>
			</div>
		{/if}

		<SheetFooter>
			<Button
				variant="outline"
				onclick={() => {
					open = false;
					onEdit();
				}}
			>
				Edit task
			</Button>
		</SheetFooter>
	</SheetContent>
</Sheet>
