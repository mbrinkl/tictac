<script lang="ts">
	export let data: { slug: string; isPrivate: boolean };

	import clsx from 'clsx';
	import type { Room } from 'colyseus.js';
	import { ProgressRadial, clipboard } from '@skeletonlabs/skeleton';
	import { isValidMove, type IGameState, GameStatus } from '../../../../../shared';
	import PlayerInfo from './PlayerInfo.svelte';
	import { getClient } from '$lib/util';
	import { reconnectToken } from '$lib/gameStore';
	import { onDestroy } from 'svelte';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';

	let gameRoom: Room<IGameState> | null = null;
	let state: IGameState | null = null;
	let err: any;

	const toastStore = getToastStore();
	const client = getClient();

	const t: ToastSettings = {
		message: 'URL copied to clipboard',
		background: 'variant-filled-primary',
	};

	const join = async () => {
		try {
			if ($reconnectToken) {
				gameRoom = await client.reconnect($reconnectToken);
			} else if (data.slug === 'create') {
				const opts: { isPrivate: boolean } = { isPrivate: data.isPrivate };
				gameRoom = await client.create<IGameState>('battle', opts);
				history.replaceState(null, '', `/rooms/${gameRoom.id}`);
			} else {
				gameRoom = await client.joinById(data.slug);
			}
			$reconnectToken = gameRoom.reconnectionToken;
			gameRoom.onStateChange((newState) => {
				state = newState;
			});
		} catch (error) {
			err = error;
		}
	};

	const onCellClick = (index: number) => {
		gameRoom?.send('cell_click', index);
	};

	onDestroy(() => {
		$reconnectToken = null;
		gameRoom?.leave();
	});

	join();
</script>

<a class="absolute top-5 left-5" href="/">Back</a>

{#if err}
	<div>{err}</div>
{:else if !gameRoom || !state || state.players.size !== 2}
	<div class="h-full flex flex-col justify-center items-center gap-3">
		<div class="flex gap-3">
			<div>Waiting for another player...</div>
			<ProgressRadial width="w-6" meter="stroke-primary-500" track="stroke-primary-500/30" strokeLinecap="butt" />
		</div>
		{#if gameRoom}
			<button
				class="btn variant-ghost-primary"
				use:clipboard={window.location.origin + `/rooms/${gameRoom?.id}`}
				on:click={() => toastStore.trigger(t)}
			>
				Invite
			</button>
		{/if}
	</div>
{:else}
	{@const player = state.players.get(gameRoom.sessionId)}
	{@const [p1, p2] = Array.from(state.players.values())}
	{@const isActive = state.activePlayerId === player?.id}

	{#if state.status === GameStatus.Draw}
		<div>Draw</div>
	{:else if state.status === GameStatus.WinP0}
		<div>P0 wins</div>
	{:else if state.status === GameStatus.WinP1}
		<div>P1 wins</div>
	{/if}

	<div class={clsx('wrapper', isActive && 'active')}>
		<div class="player-info">
			<PlayerInfo player={p1} isClient={player?.id === p1.id} isActive={state.activePlayerId === p1.id} />
			<PlayerInfo player={p2} isClient={player?.id === p2.id} isActive={state.activePlayerId === p2.id} />
		</div>
		<div class="board">
			{#each state.board as value, index}
				{@const isValid = isValidMove(index, state.board)}
				<button class={clsx('cell', isValid && isActive && 'valid')} on:click={() => onCellClick(index)}>
					{value}
				</button>
			{/each}
		</div>
	</div>
{/if}

<style>
	.wrapper {
		border: 2px solid yellow;
		border-radius: 5%;
		padding: 10px;
	}

	.active {
		border-color: lime;
	}

	.player-info {
		display: flex;
		justify-content: space-between;
	}

	.board {
		display: grid;
		grid-gap: 4px;
		background-color: white;
		grid-template-columns: repeat(3, 1fr);
		grid-auto-rows: minmax(100px, auto);
		width: 300px;
	}

	.cell {
		background-color: gray;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
	}

	.valid {
		cursor: pointer;
	}

	.valid:hover {
		background-color: purple;
	}
</style>
