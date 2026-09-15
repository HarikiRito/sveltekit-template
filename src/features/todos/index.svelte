<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { run, runOk } from 'src/effect/runtime';
	import { createTodosStore, type Todo } from 'src/features/todos/todos.svelte';
	import { TodosService } from 'src/services/todos.service';
	import { Card } from 'src/components/ui/card/index.js';
	import { Badge } from 'src/components/ui/badge/index.js';
	import { Separator } from 'src/components/ui/separator/index.js';
	import { Label } from 'src/components/ui/label/index.js';
	import { Input } from 'src/components/ui/input/index.js';
	import { Button } from 'src/components/ui/button/index.js';
	import { Checkbox } from 'src/components/ui/checkbox/index.js';
	import {
		AlertDialog,
		AlertDialogAction,
		AlertDialogCancel,
		AlertDialogContent,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogHeader,
		AlertDialogTitle
	} from 'src/components/ui/alert-dialog/index.js';
	import { cn } from 'src/utils.js';

	const initialLoad = run(TodosService.load());
	if (initialLoad === undefined) toast.error('Could not load saved todos');
	const store = createTodosStore(initialLoad ?? []);

	let text = $state('');
	let clearOpen = $state(false);

	function persist() {
		if (!runOk(TodosService.save(store.todos))) toast.error('Failed to save todos to local storage');
	}

	function handleAdd() {
		const todo = run(store.add(text));
		if (!todo) {
			toast.error('Todo text cannot be empty');
			return;
		}
		text = '';
		toast.success(`Added "${todo.text}"`);
		persist();
	}

	function handleToggle(id: string) {
		if (!runOk(store.toggle(id))) {
			toast.error('Could not update todo');
			return;
		}
		const todo = store.todos.find((t: Todo) => t.id === id);
		toast.success(todo?.done ? 'Marked as done' : 'Marked as active');
		persist();
	}

	function handleRemove(id: string) {
		if (!runOk(store.remove(id))) {
			toast.error('Could not delete todo');
			return;
		}
		toast.success('Todo deleted');
		persist();
	}

	function confirmClearAll() {
		// clear() cannot fail: its error type is `never`
		runOk(store.clear());
		toast.success('All todos cleared');
		persist();
	}
</script>

<Card class="mx-auto flex w-full max-w-lg flex-col gap-4 p-6">
	<div class="flex items-center justify-between gap-3">
		<h1 class="text-2xl font-bold">Todos</h1>
		<div class="flex items-center gap-2">
			<Badge variant="outline">{store.remaining} remaining</Badge>
			<Badge variant="secondary">{store.completed} completed</Badge>
		</div>
	</div>

	<div class="flex items-end gap-2">
		<div class="flex flex-1 flex-col gap-1.5">
			<Label for="new-todo">New todo</Label>
			<Input
				id="new-todo"
				placeholder="What needs doing?"
				bind:value={text}
				onkeydown={(e) => e.key === 'Enter' && handleAdd()}
			/>
		</div>
		<Button onclick={handleAdd}>Add</Button>
	</div>

	<Separator />

	{#if store.todos.length === 0}
		<p class="text-muted-foreground text-sm">No todos yet. Add one above.</p>
	{:else}
		<ul class="flex flex-col gap-2">
			{#each store.todos as todo (todo.id)}
				<li class="flex items-center gap-3">
					<Checkbox
						bind:checked={() => todo.done, () => handleToggle(todo.id)}
						aria-label={todo.done ? 'Mark as active' : 'Mark as done'}
					/>
					<span class={cn('flex-1 text-sm', todo.done && 'text-muted-foreground line-through')}>
						{todo.text}
					</span>
					<Button
						variant="ghost"
						size="sm"
						onclick={() => handleRemove(todo.id)}
						aria-label={`Delete "${todo.text}"`}
					>
						Delete
					</Button>
				</li>
			{/each}
		</ul>

		<Separator />

		<div class="flex justify-end">
			<Button variant="outline" onclick={() => (clearOpen = true)}>Clear all</Button>
		</div>
	{/if}
</Card>

<AlertDialog bind:open={clearOpen}>
	<AlertDialogContent>
		<AlertDialogHeader>
			<AlertDialogTitle>Clear all todos?</AlertDialogTitle>
			<AlertDialogDescription>This removes every task and can't be undone.</AlertDialogDescription>
		</AlertDialogHeader>
		<AlertDialogFooter>
			<AlertDialogCancel>Cancel</AlertDialogCancel>
			<AlertDialogAction variant="destructive" onclick={confirmClearAll}>Clear all</AlertDialogAction>
		</AlertDialogFooter>
	</AlertDialogContent>
</AlertDialog>
