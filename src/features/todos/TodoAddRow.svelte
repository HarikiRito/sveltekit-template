<script lang="ts">
	import PlusIcon from '@lucide/svelte/icons/plus';
	import { Label } from 'src/components/ui/label/index.js';
	import { Input } from 'src/components/ui/input/index.js';
	import { Button } from 'src/components/ui/button/index.js';
	import { ButtonGroup } from 'src/components/ui/button-group/index.js';
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectValue
	} from 'src/components/ui/select/index.js';
	import { Kbd } from 'src/components/ui/kbd/index.js';
	import { PRIORITIES, priorityLabel } from './constants';

	let {
		value = $bindable(''),
		priority = $bindable('medium'),
		onAdd
	}: {
		value?: string;
		priority?: string;
		onAdd: () => void;
	} = $props();

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') onAdd();
	}
</script>

<div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
	<div class="flex flex-1 flex-col gap-1.5">
		<Label for="todo-input">New task</Label>
		<ButtonGroup class="w-full">
			<Input
				id="todo-input"
				placeholder="What needs to be done?"
				bind:value
				onkeydown={handleKeydown}
			/>
			<Select type="single" bind:value={priority}>
				<SelectTrigger class="w-32">
					<SelectValue placeholder="Priority" />
				</SelectTrigger>
				<SelectContent>
					{#each PRIORITIES as p (p)}
						<SelectItem value={p} label={priorityLabel[p]}>{priorityLabel[p]}</SelectItem>
					{/each}
				</SelectContent>
			</Select>
			<Button onclick={onAdd}>
				<PlusIcon />
				Add
			</Button>
		</ButtonGroup>
	</div>
	<p class="text-muted-foreground flex items-center gap-1.5 text-xs">
		Press <Kbd>⏎</Kbd> to add
	</p>
</div>
