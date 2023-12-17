<script lang="ts">
	export let board: string[];
	export let isActive: boolean;
	export let onCellClick: (index: number) => void;

	import clsx from 'clsx';
	import { isValidMove } from '@tictac/shared';
</script>

<div class="w-[300px] grid grid-cols-3 auto-rows-[minmax(100px,auto)] gap-1 bg-gray-500">
	{#each board as value, index}
		{@const clickable = isActive && isValidMove(index, board)}
		<div
			class={clsx('bg-gray-300 flex items-center justify-center', clickable && 'cursor-pointer hover:bg-primary-300')}
			role={clickable ? 'button' : 'none'}
			on:click={clickable ? () => onCellClick(index) : undefined}
		>
			<span class="text-xl text-primary-500 font-bold">{value}</span>
		</div>
	{/each}
</div>
