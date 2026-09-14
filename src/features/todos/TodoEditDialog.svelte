<script lang="ts">
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle
	} from 'src/components/ui/dialog/index.js';
	import { Label } from 'src/components/ui/label/index.js';
	import { Input } from 'src/components/ui/input/index.js';
	import { Textarea } from 'src/components/ui/textarea/index.js';
	import { Button } from 'src/components/ui/button/index.js';
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue
	} from 'src/components/ui/select/index.js';
	import { PRIORITIES, priorityLabel, type Priority } from './constants';
	import type { Todo, TodoPatch } from './todos.svelte';

	let {
		open = $bindable(false),
		todo,
		onSave
	}: {
		open?: boolean;
		todo: Todo | null;
		onSave: (patch: TodoPatch) => void;
	} = $props();

	let text = $state('');
	let priority = $state('medium');
	let description = $state('');
	let assignee = $state('');

	$effect(() => {
		if (open && todo) {
			text = todo.text;
			priority = todo.priority ?? 'medium';
			description = todo.description ?? '';
			assignee = todo.assignee ?? '';
		}
	});

	function handleSave() {
		onSave({
			text,
			priority: priority as Priority,
			description: description.trim() || undefined,
			assignee: assignee.trim() || undefined
		});
		open = false;
	}
</script>

<Dialog bind:open>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>Edit task</DialogTitle>
			<DialogDescription>Update details and save your changes.</DialogDescription>
		</DialogHeader>

		<div class="flex flex-col gap-4">
			<div class="flex flex-col gap-1.5">
				<Label for="edit-text">Task</Label>
				<Input id="edit-text" bind:value={text} />
			</div>

			<div class="flex flex-col gap-1.5">
				<Label for="edit-priority">Priority</Label>
				<Select type="single" bind:value={priority}>
					<SelectTrigger id="edit-priority" class="w-full">
						<SelectValue placeholder="Priority" />
					</SelectTrigger>
					<SelectContent>
						{#each PRIORITIES as p (p)}
							<SelectItem value={p} label={priorityLabel[p]}>{priorityLabel[p]}</SelectItem>
						{/each}
					</SelectContent>
				</Select>
			</div>

			<div class="flex flex-col gap-1.5">
				<Label for="edit-assignee">Assignee</Label>
				<Input id="edit-assignee" bind:value={assignee} placeholder="Unassigned" />
			</div>

			<div class="flex flex-col gap-1.5">
				<Label for="edit-description">Description</Label>
				<Textarea id="edit-description" bind:value={description} placeholder="Add more detail…" />
			</div>
		</div>

		<DialogFooter>
			<Button variant="outline" onclick={() => (open = false)}>Cancel</Button>
			<Button onclick={handleSave}>Save changes</Button>
		</DialogFooter>
	</DialogContent>
</Dialog>
