<script lang="ts">
	import { Button } from 'src/components/ui/button/index.js';
	import { Card, CardHeader, CardTitle, CardDescription } from 'src/components/ui/card/index.js';
	import { Badge } from 'src/components/ui/badge/index.js';

	const stack = [
		'Svelte 5 runes',
		'SvelteKit 2 SPA',
		'Tailwind v4',
		'shadcn-svelte',
		'cn',
		'Effect v4',
		'Biome + ESLint',
		'Vitest'
	];

	const features = [
		{
			title: 'Runes-first state',
			description: 'Feature stores built on Svelte 5 $state/$derived, no legacy stores syntax.'
		},
		{
			title: 'shadcn-svelte components',
			description: '30 curated primitives under src/components/ui, themed with the neutral token set.'
		},
		{
			title: 'Effect v4 error handling',
			description: 'Tagged errors and Exit/Cause matching in src/effect — zero try/catch in src.'
		}
	];
</script>

<div class="flex flex-col gap-12">
	<div class="flex flex-col gap-4">
		<h1 class="text-5xl font-bold tracking-tight text-balance">SvelteKit Base Template</h1>
		<p class="text-muted-foreground max-w-2xl text-lg text-balance">
			A lean SvelteKit SPA starter with Svelte 5 runes, shadcn-svelte, Effect v4, and Tailwind v4 —
			themed, typed, and ready to extend.
		</p>
		<div class="flex flex-wrap gap-2 pt-2">
			{#each stack as item (item)}
				<Badge variant="secondary">{item}</Badge>
			{/each}
		</div>
		<div class="flex gap-3 pt-4">
			<Button href="/todos">View Todos Demo</Button>
			<Button href="/components" variant="outline">Browse Components</Button>
		</div>
	</div>

	<div class="grid gap-4 sm:grid-cols-3">
		{#each features as feature (feature.title)}
			<Card>
				<CardHeader>
					<CardTitle>{feature.title}</CardTitle>
					<CardDescription>{feature.description}</CardDescription>
				</CardHeader>
			</Card>
		{/each}
	</div>
</div>
