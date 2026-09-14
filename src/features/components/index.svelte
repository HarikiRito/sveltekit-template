<script lang="ts">
	import GallerySection1 from './gallery-section-1.svelte';
	import GallerySection2 from './gallery-section-2.svelte';
	import GallerySection3 from './gallery-section-3.svelte';
</script>

<div class="flex flex-col gap-10">
	<div class="flex flex-col gap-2">
		<h1 class="text-4xl font-bold tracking-tight">Components</h1>
		<p class="text-muted-foreground max-w-2xl text-lg">
			All 30 installed shadcn-svelte primitives, each with a live, working example.
		</p>
	</div>

	<div class="flex flex-col gap-8">
		<GallerySection1 />
		<GallerySection2 />
		<GallerySection3 />
	</div>
</div>
