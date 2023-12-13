<script lang="ts">
	export let data: { slug: string; isPrivate: boolean };

	import clsx from 'clsx';
	import type { Room } from 'colyseus.js';
	import { ProgressRadial, clipboard } from '@skeletonlabs/skeleton';
	import {
		isValidMove,
		type IGameState,
		GameStatus,
		type IGameRoomCreateOptions,
		type IGameRoomJoinOptions,
		CELL_CLICK_COMMAND,
	} from '../../../../../shared';
	import PlayerInfo from './PlayerInfo.svelte';
	import { getClient } from '$lib/util';
	import { reconnectionStore } from '$lib/gameStore';
	import { onDestroy, onMount } from 'svelte';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';

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
			if (data.slug === 'create') {
				const opts: IGameRoomCreateOptions = { isPrivate: data.isPrivate, name: 'Jake' };
				gameRoom = await client.create<IGameState>('game', opts);
				goto(`/rooms/${gameRoom.id}`, { replaceState: true });
			} else if ($reconnectionStore?.roomId === data.slug) {
				gameRoom = await client.reconnect($reconnectionStore.token);
			} else {
				const opts: IGameRoomJoinOptions = { name: 'Noob' };
				gameRoom = await client.joinById(data.slug, opts);
			}
			$reconnectionStore = { roomId: gameRoom.id, token: gameRoom.reconnectionToken };
			state = gameRoom.state;
			gameRoom.onStateChange((newState) => {
				state = newState;
			});
		} catch (error) {
			err = error;
		}
	};

	const onCellClick = (index: number) => {
		gameRoom?.send(CELL_CLICK_COMMAND, index);
	};

	onMount(async () => {
		await join();
	});

	onDestroy(async () => {
		$reconnectionStore = null;
		await gameRoom?.leave();
	});
</script>

<a class="anchor" href="/">Back</a>

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

	<div class="flex justify-center m-3">
		<div class="board bg-gray-500">
			{#each state.board as value, index}
				{@const clickable = isActive && isValidMove(index, state.board)}
				<div
					class={clsx(
						'bg-gray-300 flex items-center justify-center',
						clickable && 'cursor-pointer hover:bg-primary-300',
					)}
					role={clickable ? 'button' : 'none'}
					on:click={() => onCellClick(index)}
				>
					<span class="text-xl text-primary-500 font-bold">{value}</span>
				</div>
			{/each}
		</div>
	</div>
	<div class="flex justify-between">
		<PlayerInfo player={p1} isClient={player?.id === p1.id} isActive={state.activePlayerId === p1.id} />
		<PlayerInfo player={p2} isClient={player?.id === p2.id} isActive={state.activePlayerId === p2.id} />
	</div>
{/if}

<style>
	.board {
		display: grid;
		grid-gap: 4px;
		grid-template-columns: repeat(3, 1fr);
		grid-auto-rows: minmax(100px, auto);
		width: 300px;
	}
</style>
