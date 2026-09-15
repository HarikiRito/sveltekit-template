<script lang="ts">
	import GallerySection from './gallery-section.svelte';
	import { Button } from 'src/components/ui/button/index.js';
	import {
		Dialog,
		DialogTrigger,
		DialogContent,
		DialogHeader,
		DialogTitle,
		DialogDescription,
		DialogFooter,
		DialogClose
	} from 'src/components/ui/dialog/index.js';
	import {
		DropdownMenu,
		DropdownMenuTrigger,
		DropdownMenuContent,
		DropdownMenuLabel,
		DropdownMenuSeparator,
		DropdownMenuItem
	} from 'src/components/ui/dropdown-menu/index.js';
	import { Input } from 'src/components/ui/input/index.js';
	import { Kbd } from 'src/components/ui/kbd/index.js';
	import { Label } from 'src/components/ui/label/index.js';
	import {
		Popover,
		PopoverTrigger,
		PopoverContent,
		PopoverTitle,
		PopoverDescription
	} from 'src/components/ui/popover/index.js';
	import { Progress } from 'src/components/ui/progress/index.js';
	import { RadioGroup, RadioGroupItem } from 'src/components/ui/radio-group/index.js';
	import { ScrollArea } from 'src/components/ui/scroll-area/index.js';
	import {
		Select,
		SelectTrigger,
		SelectContent,
		SelectItem,
		SelectValue
	} from 'src/components/ui/select/index.js';
	import { toast } from 'svelte-sonner';

	let dialogOpen = $state(false);
	let progress = $state(42);
	let density = $state('comfortable');
	let priority = $state('medium');

	function handleDropdownAction(action: string) {
		toast(`Row action: ${action}`);
	}
</script>

<GallerySection title="Dialog" description="Modal window for focused tasks, closable via overlay/Escape.">
	<Dialog bind:open={dialogOpen}>
		<DialogTrigger>
			{#snippet child({ props })}
				<Button {...props}>Edit profile</Button>
			{/snippet}
		</DialogTrigger>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Edit profile</DialogTitle>
				<DialogDescription>Update your display name. Demo only — no save.</DialogDescription>
			</DialogHeader>
			<Input placeholder="Display name" />
			<DialogFooter>
				<DialogClose>
					{#snippet child({ props })}
						<Button variant="outline" {...props}>Cancel</Button>
					{/snippet}
				</DialogClose>
				<Button onclick={() => (dialogOpen = false)}>Save</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</GallerySection>

<GallerySection title="Dropdown Menu" description="Contextual list of actions anchored to a trigger.">
	<DropdownMenu>
		<DropdownMenuTrigger>
			{#snippet child({ props })}
				<Button variant="outline" {...props}>Row actions</Button>
			{/snippet}
		</DropdownMenuTrigger>
		<DropdownMenuContent>
			<DropdownMenuLabel>Actions</DropdownMenuLabel>
			<DropdownMenuSeparator />
			<DropdownMenuItem onclick={() => handleDropdownAction('Edit')}>Edit</DropdownMenuItem>
			<DropdownMenuItem onclick={() => handleDropdownAction('Duplicate')}>Duplicate</DropdownMenuItem>
			<DropdownMenuItem variant="destructive" onclick={() => handleDropdownAction('Delete')}>
				Delete
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
</GallerySection>

<GallerySection title="Input" description="Single-line text field.">
	<Input placeholder="you@example.com" class="max-w-xs" />
</GallerySection>

<GallerySection title="Kbd" description="Keyboard shortcut hint.">
	<span class="text-sm">Press <Kbd>Enter</Kbd> to submit, <Kbd>Esc</Kbd> to cancel.</span>
</GallerySection>

<GallerySection title="Label" description="Accessible form field label.">
	<div class="flex flex-col gap-1.5">
		<Label for="gallery-label-input">Email</Label>
		<Input id="gallery-label-input" placeholder="you@example.com" class="max-w-xs" />
	</div>
</GallerySection>

<GallerySection title="Popover" description="Floating panel anchored to a trigger, for lightweight content.">
	<Popover>
		<PopoverTrigger>
			{#snippet child({ props })}
				<Button variant="outline" {...props}>Add note</Button>
			{/snippet}
		</PopoverTrigger>
		<PopoverContent>
			<PopoverTitle>Note</PopoverTitle>
			<PopoverDescription>A short note attached to this item.</PopoverDescription>
		</PopoverContent>
	</Popover>
</GallerySection>

<GallerySection title="Progress" description="Determinate progress indicator.">
	<div class="flex w-full max-w-xs items-center gap-3">
		<Progress value={progress} class="max-w-xs" />
		<span class="text-muted-foreground text-sm tabular-nums">{progress}%</span>
	</div>
</GallerySection>

<GallerySection title="Radio Group" description="Mutually exclusive single choice.">
	<RadioGroup bind:value={density} class="max-w-xs">
		<label class="flex items-center gap-2 text-sm">
			<RadioGroupItem value="comfortable" />
			Comfortable
		</label>
		<label class="flex items-center gap-2 text-sm">
			<RadioGroupItem value="compact" />
			Compact
		</label>
	</RadioGroup>
</GallerySection>

<GallerySection title="Scroll Area" description="Custom scrollbars over an overflowing region.">
	<ScrollArea class="h-32 w-64 rounded-md border p-4">
		{#each Array.from({ length: 15 }, (_, i) => i + 1) as line (line)}
			<p class="text-sm">Line {line} of scrollable content.</p>
		{/each}
	</ScrollArea>
</GallerySection>

<GallerySection title="Select" description="Dropdown for choosing one value from a list.">
	<Select type="single" bind:value={priority}>
		<SelectTrigger class="w-40">
			<SelectValue placeholder="Priority" />
		</SelectTrigger>
		<SelectContent>
			<SelectItem value="low">Low</SelectItem>
			<SelectItem value="medium">Medium</SelectItem>
			<SelectItem value="high">High</SelectItem>
		</SelectContent>
	</Select>
</GallerySection>
