<script lang="ts">
	export let data: { slug: string; isPrivate: boolean };

	import type { Room } from 'colyseus.js';
	import {
		type IGameState,
		GameStatus,
		type IGameRoomCreateOptions,
		type IGameRoomJoinOptions,
		CELL_CLICK_COMMAND,
	} from '@tictac/shared';
	import PlayerInfo from './PlayerInfo.svelte';
	import { getClient } from '$lib/util';
	import { reconnectionStore, playerName } from '$lib/gameStore';
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import UpdateNickname from '$lib/components/UpdateNickname.svelte';
	import WaitingForPlayer from './WaitingForPlayer.svelte';
	import Board from './Board.svelte';

	let gameRoom: Room<IGameState> | null = null;
	let state: IGameState | null = null;
	let err: any;

	const client = getClient();

	const join = async () => {
		try {
			if (!$playerName) {
				return;
			}

			if (data.slug === 'create') {
				const opts: IGameRoomCreateOptions = { isPrivate: data.isPrivate, name: $playerName };
				gameRoom = await client.create<IGameState>('game', opts);
				goto(`/rooms/${gameRoom.id}`, { replaceState: true });
			} else if ($reconnectionStore?.roomId === data.slug) {
				gameRoom = await client.reconnect($reconnectionStore.token);
			} else {
				const opts: IGameRoomJoinOptions = { name: $playerName };
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
{:else if !$playerName}
	<UpdateNickname onSubmit={join} />
{:else if !gameRoom || !state || state.players.size !== 2}
	<WaitingForPlayer {gameRoom} />
{:else}
	{@const player = state.players.get(gameRoom.sessionId)}
	{@const isActive = state.activePlayerId === player?.id}

	{#if state.status === GameStatus.Finished && state.winnerId === -1}
		<div>Draw</div>
	{:else if state.status === GameStatus.Finished}
		<div>P{state.winnerId} wins</div>
	{:else if state.status === GameStatus.TimedOut}
		<div>P{state.winnerId} wins, timeout</div>
	{:else if state.status === GameStatus.Forfeited}
		<div>P{state.winnerId} wins, forfeit</div>
	{/if}

	<div class="flex justify-center m-3">
		<Board board={state.board} {isActive} {onCellClick} />
	</div>
	<div class="flex justify-between">
		{#each Array.from(state.players.values()) as p}
			<PlayerInfo
				player={p}
				isClient={player?.id === p.id}
				isActive={state.activePlayerId === p.id}
				gameStatus={state.status}
			/>
		{/each}
	</div>
{/if}
