<script lang="ts">
	export let gameRoom: Room<IGameState> | null;

	import { ProgressRadial, clipboard } from '@skeletonlabs/skeleton';
	import type { IGameState } from '@tictac/shared';
	import type { Room } from 'colyseus.js';
	import { getToastStore } from '@skeletonlabs/skeleton';

	const toast = getToastStore();
</script>

<div class="h-full flex flex-col justify-center items-center gap-3">
	<div class="flex gap-3">
		<div>Waiting for another player...</div>
		<ProgressRadial width="w-6" meter="stroke-primary-500" track="stroke-primary-500/30" strokeLinecap="butt" />
	</div>
	{#if gameRoom}
		<button
			class="btn variant-ghost-primary"
			use:clipboard={window.location.origin + `/rooms/${gameRoom?.id}`}
			on:click={() =>
				toast.trigger({
					message: 'URL copied to clipboard',
					background: 'variant-filled-primary',
				})}
		>
			Invite
		</button>
	{/if}
</div>
