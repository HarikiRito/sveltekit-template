<script lang="ts">
	import GallerySection from './gallery-section.svelte';
	import {
		Accordion,
		AccordionItem,
		AccordionTrigger,
		AccordionContent
	} from 'src/components/ui/accordion/index.js';
	import { Alert, AlertTitle, AlertDescription } from 'src/components/ui/alert/index.js';
	import {
		AlertDialog,
		AlertDialogTrigger,
		AlertDialogContent,
		AlertDialogHeader,
		AlertDialogTitle,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogCancel,
		AlertDialogAction
	} from 'src/components/ui/alert-dialog/index.js';
	import { Avatar, AvatarImage, AvatarFallback } from 'src/components/ui/avatar/index.js';
	import { Badge } from 'src/components/ui/badge/index.js';
	import {
		Breadcrumb,
		BreadcrumbList,
		BreadcrumbItem,
		BreadcrumbLink,
		BreadcrumbPage,
		BreadcrumbSeparator
	} from 'src/components/ui/breadcrumb/index.js';
	import { Button } from 'src/components/ui/button/index.js';
	import {
		ButtonGroup,
		ButtonGroupSeparator
	} from 'src/components/ui/button-group/index.js';
	import { Card, CardHeader, CardTitle, CardDescription, CardContent } from 'src/components/ui/card/index.js';
	import { Checkbox } from 'src/components/ui/checkbox/index.js';
	import InfoIcon from '@lucide/svelte/icons/info';

	let accordionValue = $state('item-1');
	let alertDialogOpen = $state(false);
	let checked = $state(true);
</script>

<GallerySection title="Accordion" description="Collapsible stacked sections, one open at a time.">
	<Accordion type="single" bind:value={accordionValue} class="max-w-md">
		<AccordionItem value="item-1">
			<AccordionTrigger>What is this template?</AccordionTrigger>
			<AccordionContent>A SvelteKit SPA starter with shadcn-svelte and Effect v4.</AccordionContent>
		</AccordionItem>
		<AccordionItem value="item-2">
			<AccordionTrigger>Is it themeable?</AccordionTrigger>
			<AccordionContent>Yes — light and dark tokens ship out of the box.</AccordionContent>
		</AccordionItem>
	</Accordion>
</GallerySection>

<GallerySection title="Alert" description="Inline status message with a title and description.">
	<Alert class="max-w-md">
		<InfoIcon />
		<AlertTitle>Heads up</AlertTitle>
		<AlertDescription>This is a default alert using the current theme tokens.</AlertDescription>
	</Alert>
</GallerySection>

<GallerySection title="Alert Dialog" description="Blocking confirmation for a destructive action.">
	<AlertDialog bind:open={alertDialogOpen}>
		<AlertDialogTrigger>
			{#snippet child({ props })}
				<Button variant="destructive" {...props}>Delete account</Button>
			{/snippet}
		</AlertDialogTrigger>
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
				<AlertDialogDescription>
					This action cannot be undone. This is a demo — nothing is actually deleted.
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel>Cancel</AlertDialogCancel>
				<AlertDialogAction onclick={() => (alertDialogOpen = false)}>Confirm</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
</GallerySection>

<GallerySection title="Avatar" description="Image with a text/initials fallback.">
	<Avatar>
		<AvatarImage src="https://github.com/shadcn.png" alt="Shadcn" />
		<AvatarFallback>SC</AvatarFallback>
	</Avatar>
	<Avatar>
		<AvatarFallback>VC</AvatarFallback>
	</Avatar>
</GallerySection>

<GallerySection title="Badge" description="Compact status/label pill in several variants.">
	<Badge>Default</Badge>
	<Badge variant="secondary">Secondary</Badge>
	<Badge variant="outline">Outline</Badge>
	<Badge variant="destructive">Destructive</Badge>
</GallerySection>

<GallerySection title="Breadcrumb" description="Hierarchical page path navigation.">
	<Breadcrumb>
		<BreadcrumbList>
			<BreadcrumbItem>
				<BreadcrumbLink href="/">Home</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbSeparator />
			<BreadcrumbItem>
				<BreadcrumbLink href="/components">Components</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbSeparator />
			<BreadcrumbItem>
				<BreadcrumbPage>Gallery</BreadcrumbPage>
			</BreadcrumbItem>
		</BreadcrumbList>
	</Breadcrumb>
</GallerySection>

<GallerySection title="Button" description="Primary action trigger in several variants and sizes.">
	<Button>Default</Button>
	<Button variant="secondary">Secondary</Button>
	<Button variant="outline">Outline</Button>
	<Button variant="ghost">Ghost</Button>
	<Button variant="destructive">Destructive</Button>
	<Button variant="link">Link</Button>
</GallerySection>

<GallerySection title="Button Group" description="Buttons composed together as one control.">
	<ButtonGroup>
		<Button variant="outline">Left</Button>
		<ButtonGroupSeparator />
		<Button variant="outline">Middle</Button>
		<ButtonGroupSeparator />
		<Button variant="outline">Right</Button>
	</ButtonGroup>
</GallerySection>

<GallerySection title="Card" description="Container for grouped content with header/body regions.">
	<Card class="w-full max-w-sm">
		<CardHeader>
			<CardTitle>Project</CardTitle>
			<CardDescription>A short description of the card content.</CardDescription>
		</CardHeader>
		<CardContent>
			<p class="text-sm">Cards compose Header, Title, Description, Content, Footer and Action.</p>
		</CardContent>
	</Card>
</GallerySection>

<GallerySection title="Checkbox" description="Binary toggle for forms and lists.">
	<label class="flex items-center gap-2 text-sm">
		<Checkbox bind:checked />
		Accept terms and conditions
	</label>
</GallerySection>
