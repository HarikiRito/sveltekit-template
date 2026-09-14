<script lang="ts">
	import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
	import EyeIcon from '@lucide/svelte/icons/eye';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import { Button } from 'src/components/ui/button/index.js';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from 'src/components/ui/dropdown-menu/index.js';

	let {
		onView,
		onEdit,
		onDelete
	}: {
		onView: () => void;
		onEdit: () => void;
		onDelete: () => void;
	} = $props();
</script>

<div class="flex items-center gap-1">
	<DropdownMenu>
		<DropdownMenuTrigger>
			{#snippet child({ props })}
				<Button variant="ghost" size="icon-sm" aria-label="More actions" {...props}>
					<EllipsisIcon />
				</Button>
			{/snippet}
		</DropdownMenuTrigger>
		<DropdownMenuContent align="end">
			<DropdownMenuItem onclick={onView}>
				<EyeIcon />
				View detail
			</DropdownMenuItem>
			<DropdownMenuItem onclick={onEdit}>
				<PencilIcon />
				Edit
			</DropdownMenuItem>
			<DropdownMenuSeparator />
			<DropdownMenuItem variant="destructive" onclick={onDelete}>
				<Trash2Icon />
				Delete
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
</div>
