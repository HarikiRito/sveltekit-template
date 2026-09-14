<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		title,
		description,
		children
	}: { title: string; description: string; children: Snippet } = $props();
</script>

<section class="flex flex-col gap-3 border-b pb-8 last:border-b-0">
	<div>
		<h2 class="text-xl font-semibold tracking-tight">{title}</h2>
		<p class="text-muted-foreground text-sm">{description}</p>
	</div>
	<div class="flex flex-wrap items-start gap-4">
		{@render children()}
	</div>
</section>
