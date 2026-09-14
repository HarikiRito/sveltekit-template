<script lang="ts">
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import ListIcon from '@lucide/svelte/icons/list';
	import TableIcon from '@lucide/svelte/icons/table';
	import ArrowUpDownIcon from '@lucide/svelte/icons/arrow-up-down';
	import { matchExit, runSyncExit } from 'src/effect';
	import { createTodosStore, type Todo, type TodoPatch } from 'src/features/todos/todos.svelte';
	import { TodosService } from 'src/services/todos.service';
	import {
		Breadcrumb,
		BreadcrumbItem,
		BreadcrumbLink,
		BreadcrumbList,
		BreadcrumbPage,
		BreadcrumbSeparator
	} from 'src/components/ui/breadcrumb/index.js';
	import { Badge } from 'src/components/ui/badge/index.js';
	import { Progress } from 'src/components/ui/progress/index.js';
	import { Card } from 'src/components/ui/card/index.js';
	import { Separator } from 'src/components/ui/separator/index.js';
	import { Label } from 'src/components/ui/label/index.js';
	import { Switch } from 'src/components/ui/switch/index.js';
	import { Toggle } from 'src/components/ui/toggle/index.js';
	import { RadioGroup, RadioGroupItem } from 'src/components/ui/radio-group/index.js';
	import { Skeleton } from 'src/components/ui/skeleton/index.js';
	import { Button } from 'src/components/ui/button/index.js';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs/index.js';
	import { priorityRank, type Priority } from 'src/features/todos/constants';
	import TodoAddRow from 'src/features/todos/TodoAddRow.svelte';
	import TodoListView from 'src/features/todos/TodoListView.svelte';
	import TodoTableView from 'src/features/todos/TodoTableView.svelte';
	import TodoEditDialog from 'src/features/todos/TodoEditDialog.svelte';
	import TodoDetailSheet from 'src/features/todos/TodoDetailSheet.svelte';
	import TodoDeleteAlert from 'src/features/todos/TodoDeleteAlert.svelte';

	const initialTodos = matchExit(runSyncExit(TodosService.load()), {
		onSuccess: (loaded) => loaded,
		onFailure: (error) => {
			toast.error(`Could not load saved todos (${error._tag})`);
			return [];
		}
	});

	const store = createTodosStore(initialTodos);

	let loading = $state(true);
	let addText = $state('');
	let addPriority = $state('medium');
	let activeView = $state('list');
	let showCompleted = $state(true);
	let density = $state('comfortable');
	let sortByPriority = $state(false);

	let editOpen = $state(false);
	let editingTodo = $state<Todo | null>(null);

	let sheetOpen = $state(false);
	let viewingTodo = $state<Todo | null>(null);

	let deleteOpen = $state(false);
	let deleteTarget = $state<Todo | null>(null);

	let clearOpen = $state(false);

	onMount(() => {
		const timer = setTimeout(() => (loading = false), 400);
		return () => clearTimeout(timer);
	});

	const total = $derived(store.todos.length);
	const completionPct = $derived(total === 0 ? 0 : Math.round((store.completed / total) * 100));

	const sortedTodos = $derived(
		sortByPriority
			? [...store.todos].sort(
					(a, b) =>
						priorityRank[a.priority ?? 'medium'] - priorityRank[b.priority ?? 'medium']
				)
			: store.todos
	);

	const activeTodos = $derived(sortedTodos.filter((t) => !t.done));
	const completedTodos = $derived(sortedTodos.filter((t) => t.done));
	const visibleCompleted = $derived(showCompleted ? completedTodos : []);
	const tableTodos = $derived(showCompleted ? sortedTodos : activeTodos);

	function persist() {
		matchExit(runSyncExit(TodosService.save(store.todos)), {
			onSuccess: () => undefined,
			onFailure: () => {
				toast.error('Failed to save todos to local storage');
			}
		});
	}

	function handleAdd() {
		matchExit(runSyncExit(store.add(addText, { priority: addPriority as Priority })), {
			onSuccess: (todo) => {
				addText = '';
				toast.success(`Added "${todo.text}"`);
				persist();
			},
			onFailure: () => {
				toast.error('Todo text cannot be empty');
			}
		});
	}

	function handleToggle(id: string) {
		matchExit(runSyncExit(store.toggle(id)), {
			onSuccess: () => {
				const todo = store.todos.find((t) => t.id === id);
				toast.success(todo?.done ? 'Marked as done' : 'Marked as active');
				persist();
			},
			onFailure: (error) => {
				toast.error(`Todo not found (${error.id})`);
			}
		});
	}

	function handleUpdate(id: string, patch: TodoPatch) {
		matchExit(runSyncExit(store.update(id, patch)), {
			onSuccess: () => {
				toast.success('Todo updated');
				persist();
			},
			onFailure: (error) => {
				toast.error(`Todo not found (${error.id})`);
			}
		});
	}

	function openView(todo: Todo) {
		viewingTodo = todo;
		sheetOpen = true;
	}

	function openEdit(todo: Todo) {
		editingTodo = todo;
		editOpen = true;
	}

	function requestDelete(todo: Todo) {
		deleteTarget = todo;
		deleteOpen = true;
	}

	function confirmDelete() {
		if (!deleteTarget) return;
		matchExit(runSyncExit(store.remove(deleteTarget.id)), {
			onSuccess: () => {
				toast.success('Todo deleted');
				persist();
			},
			onFailure: (error) => {
				toast.error(`Todo not found (${error.id})`);
			}
		});
		deleteTarget = null;
	}

	function confirmClearAll() {
		matchExit(runSyncExit(store.clear()), {
			onSuccess: () => {
				toast.success('All todos cleared');
				persist();
			},
			// clear() cannot fail: its error type is `never`
			onFailure: () => undefined
		});
	}

</script>

<div class="flex flex-col gap-6">
	<Breadcrumb>
		<BreadcrumbList>
			<BreadcrumbItem>
				<BreadcrumbLink href="/">Home</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbSeparator />
			<BreadcrumbItem>
				<BreadcrumbPage>Todos</BreadcrumbPage>
			</BreadcrumbItem>
		</BreadcrumbList>
	</Breadcrumb>

	<div class="flex flex-col gap-3">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<div>
				<h1 class="text-3xl font-bold">Todos</h1>
				<p class="text-muted-foreground mt-1 text-sm">Plan, track, and finish your tasks.</p>
			</div>
			<div class="flex items-center gap-2">
				<Badge variant="outline">{store.remaining} remaining</Badge>
				<Badge variant="secondary">{store.completed} completed</Badge>
			</div>
		</div>

		<div class="flex items-center gap-3">
			<Progress value={completionPct} class="flex-1" />
			<span class="text-muted-foreground w-10 text-right text-xs">{completionPct}%</span>
		</div>
	</div>

	<Card class="p-4">
		<TodoAddRow bind:value={addText} bind:priority={addPriority} onAdd={handleAdd} />
	</Card>

	<Card class="p-4">
		<div class="flex flex-col gap-4">
			<div class="flex flex-wrap items-center justify-between gap-4">
				<div class="flex items-center gap-2">
					<Switch id="show-completed" bind:checked={showCompleted} />
					<Label for="show-completed">Show completed</Label>
				</div>

				<Toggle
					pressed={sortByPriority}
					onPressedChange={(value) => {
						sortByPriority = value;
					}}
					variant="outline"
					size="sm"
					aria-label="Sort by priority"
				>
					<ArrowUpDownIcon />
					Sort by priority
				</Toggle>

				<RadioGroup bind:value={density} class="flex w-auto flex-row gap-4">
					<div class="flex items-center gap-2">
						<RadioGroupItem value="comfortable" id="density-comfortable" />
						<Label for="density-comfortable">Comfortable</Label>
					</div>
					<div class="flex items-center gap-2">
						<RadioGroupItem value="compact" id="density-compact" />
						<Label for="density-compact">Compact</Label>
					</div>
				</RadioGroup>
			</div>

			<Separator />

			{#if loading}
				<div class="flex flex-col gap-3">
					<Skeleton class="h-10 w-full" />
					<Skeleton class="h-10 w-full" />
					<Skeleton class="h-10 w-3/4" />
				</div>
			{:else}
				<Tabs bind:value={activeView}>
					<TabsList>
						<TabsTrigger value="list">
							<ListIcon />
							List
						</TabsTrigger>
						<TabsTrigger value="table">
							<TableIcon />
							Table
						</TabsTrigger>
					</TabsList>

					<TabsContent value="list">
						<TodoListView
							{activeTodos}
							completedTodos={visibleCompleted}
							{density}
							onToggle={handleToggle}
							onView={openView}
							onEdit={openEdit}
							onDelete={requestDelete}
						/>
					</TabsContent>

					<TabsContent value="table">
						<TodoTableView
							todos={tableTodos}
							onToggle={handleToggle}
							onView={openView}
							onEdit={openEdit}
							onDelete={requestDelete}
						/>
					</TabsContent>
				</Tabs>
			{/if}
		</div>
	</Card>

	{#if store.todos.length > 0}
		<div class="flex justify-end">
			<Button variant="outline" onclick={() => (clearOpen = true)}>Clear all</Button>
		</div>
	{/if}
</div>

<TodoEditDialog
	bind:open={editOpen}
	todo={editingTodo}
	onSave={(patch) => editingTodo && handleUpdate(editingTodo.id, patch)}
/>

<TodoDetailSheet
	bind:open={sheetOpen}
	todo={viewingTodo}
	onEdit={() => viewingTodo && openEdit(viewingTodo)}
/>

<TodoDeleteAlert
	bind:open={deleteOpen}
	title="Delete this task?"
	description={deleteTarget ? `"${deleteTarget.text}" will be permanently removed.` : ''}
	onConfirm={confirmDelete}
/>

<TodoDeleteAlert
	bind:open={clearOpen}
	title="Clear all todos?"
	description="This removes every task and can't be undone."
	confirmLabel="Clear all"
	onConfirm={confirmClearAll}
/>
