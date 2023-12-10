<script lang="ts">
	export let data: { slug: string; isPrivate: boolean };

	import clsx from 'clsx';
	import type { Room } from 'colyseus.js';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { isValidMove, type IGameState } from '../../../../../shared';
	import PlayerInfo from './PlayerInfo.svelte';
	import { getClient } from '$lib/util';
	import { onDestroy } from 'svelte';

	let gameRoom: Room<IGameState>;
	let state: IGameState;
	let err: any;

	const client = getClient();

	const join = async () => {
		try {
			if (data.slug === 'create') {
				const opts: { isPrivate: boolean } = { isPrivate: data.isPrivate };
				gameRoom = await client.create<IGameState>('battle', opts);
				history.replaceState(null, '', `/rooms/${gameRoom.id}`);
			} else {
				gameRoom = await client.joinById(data.slug);
			}
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
		gameRoom?.leave();
	});

	join();
</script>

<a href="/">Back</a>

{#if err}
	<div>{err}</div>
{:else if !gameRoom || !state || state.players.size !== 2}
	<div class="flex flex-col justify-center items-center gap-3">
		<div>Waiting on p2...</div>
		<ProgressRadial width="w-10" meter="stroke-primary-500" track="stroke-primary-500/30" strokeLinecap="butt" />
	</div>
{:else}
	{@const player = state.players.get(gameRoom.sessionId)}
	{@const [p1, p2] = Array.from(state.players.values())}
	{@const isActive = state.activePlayerId === player?.id}
	<div class={clsx('wrapper', isActive && 'active')}>
		<div class="player-info">
			<PlayerInfo player={p1} isClient={player?.id === p1.id} isActive={state.activePlayerId === p1.id} />
			<PlayerInfo player={p2} isClient={player?.id === p2.id} isActive={state.activePlayerId === p2.id} />
		</div>
		<div class="board">
			{#each state.board as value, index}
				{@const isValid = isValidMove(index, state.board)}
				<div class={clsx('cell', isValid && isActive && 'valid')} on:click={() => onCellClick(index)}>
					{value}
				</div>
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
