<script lang="ts">
	import GallerySection from './gallery-section.svelte';
	import { Separator } from 'src/components/ui/separator/index.js';
	import {
		Sheet,
		SheetTrigger,
		SheetContent,
		SheetHeader,
		SheetTitle,
		SheetDescription,
		SheetFooter,
		SheetClose
	} from 'src/components/ui/sheet/index.js';
	import { Skeleton } from 'src/components/ui/skeleton/index.js';
	import { Button } from 'src/components/ui/button/index.js';
	import { toast } from 'svelte-sonner';
	import { Switch } from 'src/components/ui/switch/index.js';
	import {
		Table,
		TableHeader,
		TableBody,
		TableRow,
		TableHead,
		TableCell
	} from 'src/components/ui/table/index.js';
	import { Tabs, TabsList, TabsTrigger, TabsContent } from 'src/components/ui/tabs/index.js';
	import { Textarea } from 'src/components/ui/textarea/index.js';
	import { Toggle } from 'src/components/ui/toggle/index.js';
	import {
		Tooltip,
		TooltipTrigger,
		TooltipContent,
		TooltipProvider
	} from 'src/components/ui/tooltip/index.js';

	let sheetOpen = $state(false);
	let showCompleted = $state(true);
	let tab = $state('list');
	let pressed = $state(false);

	const rows = [
		{ name: 'Write docs', status: 'Done' },
		{ name: 'Ship theme', status: 'In progress' }
	];
</script>

<GallerySection title="Separator" description="Thin visual divider between sections of content.">
	<div class="flex w-full max-w-xs flex-col gap-3">
		<p class="text-sm">Section one</p>
		<Separator />
		<p class="text-sm">Section two</p>
	</div>
</GallerySection>

<GallerySection title="Sheet" description="Side panel that slides in over the page.">
	<Sheet bind:open={sheetOpen}>
		<SheetTrigger>
			{#snippet child({ props })}
				<Button variant="outline" {...props}>Open detail</Button>
			{/snippet}
		</SheetTrigger>
		<SheetContent>
			<SheetHeader>
				<SheetTitle>Item detail</SheetTitle>
				<SheetDescription>Slides in from the side. Demo only.</SheetDescription>
			</SheetHeader>
			<SheetFooter>
				<SheetClose>
					{#snippet child({ props })}
						<Button variant="outline" {...props}>Close</Button>
					{/snippet}
				</SheetClose>
			</SheetFooter>
		</SheetContent>
	</Sheet>
</GallerySection>

<GallerySection title="Skeleton" description="Loading placeholder for content that hasn't arrived yet.">
	<div class="flex flex-col gap-2">
		<Skeleton class="h-4 w-48" />
		<Skeleton class="h-4 w-36" />
	</div>
</GallerySection>

<GallerySection title="Sonner" description="Toast notifications rendered in a corner stack.">
	<Button variant="outline" onclick={() => toast.success('Saved successfully')}>
		Fire a toast
	</Button>
</GallerySection>

<GallerySection title="Switch" description="Binary on/off toggle.">
	<label class="flex items-center gap-2 text-sm">
		<Switch bind:checked={showCompleted} />
		Show completed
	</label>
</GallerySection>

<GallerySection title="Table" description="Tabular rows/columns for structured data.">
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead>Task</TableHead>
				<TableHead>Status</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each rows as row (row.name)}
				<TableRow>
					<TableCell>{row.name}</TableCell>
					<TableCell>{row.status}</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
</GallerySection>

<GallerySection title="Tabs" description="Switch between related views without leaving the page.">
	<Tabs bind:value={tab} class="w-full max-w-sm">
		<TabsList>
			<TabsTrigger value="list">List</TabsTrigger>
			<TabsTrigger value="table">Table</TabsTrigger>
		</TabsList>
		<TabsContent value="list">List view content.</TabsContent>
		<TabsContent value="table">Table view content.</TabsContent>
	</Tabs>
</GallerySection>

<GallerySection title="Textarea" description="Multi-line text field.">
	<Textarea placeholder="Description" class="max-w-sm" />
</GallerySection>

<GallerySection title="Toggle" description="Pressed/unpressed single button toggle.">
	<Toggle bind:pressed variant="outline">Bold</Toggle>
</GallerySection>

<GallerySection title="Tooltip" description="Hover/focus hint anchored to a trigger.">
	<TooltipProvider>
		<Tooltip>
			<TooltipTrigger>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>Hover me</Button>
				{/snippet}
			</TooltipTrigger>
			<TooltipContent>Helpful hint text</TooltipContent>
		</Tooltip>
	</TooltipProvider>
</GallerySection>
