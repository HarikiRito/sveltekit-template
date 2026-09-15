<script lang="ts">
	import 'src/app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { page } from '$app/state';
	import AppSonner from 'src/components/ui/sonner/AppSonner.svelte';
	import AppThemeToggle from 'src/components/ui/AppThemeToggle.svelte';
	import { cn } from 'src/utils.js';

	// lucide has no brand/logo icons — inline mark for the GitHub link
	const githubMarkPath =
		'M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55v-1.94c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.7 1.25 3.36.95.1-.75.4-1.25.73-1.53-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.18-1.49 3.14-1.18 3.14-1.18.63 1.58.24 2.75.12 3.04.74.8 1.18 1.83 1.18 3.09 0 4.43-2.71 5.4-5.28 5.69.42.36.78 1.07.78 2.16v3.2c0 .3.2.66.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z';

	const { children } = $props();

	const navLinks = [
		{ href: '/', label: 'Home' },
		{ href: '/todos', label: 'Todos' },
		{ href: '/components', label: 'Components' }
	];

	function isActive(href: string) {
		return href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
	}
</script>

<ModeWatcher />

<nav
	class="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 border-b backdrop-blur"
>
	<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
		<ul class="flex items-center gap-6">
			{#each navLinks as link (link.href)}
				<li>
					<a
						href={link.href}
						class={cn(
							'text-sm font-medium tracking-wide uppercase transition-colors',
							isActive(link.href)
								? 'text-foreground'
								: 'text-muted-foreground hover:text-foreground'
						)}
					>
						{link.label}
					</a>
				</li>
			{/each}
		</ul>

		<div class="flex items-center gap-1">
			<AppThemeToggle />
			<a
				href="https://github.com"
				target="_blank"
				rel="noreferrer"
				class="text-muted-foreground hover:text-foreground inline-flex size-9 items-center justify-center transition-colors"
				aria-label="GitHub"
			>
				<svg viewBox="0 0 24 24" class="size-4" fill="currentColor" aria-hidden="true">
					<path d={githubMarkPath} />
				</svg>
			</a>
		</div>
	</div>
</nav>

<main class="mx-auto max-w-4xl px-4 py-10">
	{@render children()}
</main>

<AppSonner />
