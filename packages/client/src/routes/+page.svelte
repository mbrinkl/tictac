<script lang="ts">
	import clsx from 'clsx';
	import { Client, Room, type RoomAvailable } from 'colyseus.js';
	import { goto } from '$app/navigation';
	import { isValidMove, type IGameState } from '../../../shared';
	import { joinLobby, lobbyRooms } from '$lib/lobby';
	import PlayerInfo from './playerInfo.svelte';

	let gameRoom: Room<IGameState> | null = null;
	let state: IGameState | null = null;

	const client = new Client('ws://localhost:2567');

	const create = async () => {
		gameRoom = await client.create('battle');
		setupGameRoom(gameRoom);
	};

	const join = async (id: string) => {
		gameRoom = await client.joinById(id);
		setupGameRoom(gameRoom);
	};

	const setupGameRoom = (room: Room<IGameState>) => {
		room.onStateChange((newState) => {
			state = newState;
		});
	};

	const onCellClick = (index: number) => {
		gameRoom?.send('cell_click', index);
	};

	joinLobby(client);

	// const player = state.players.get(room.sessionId);

	// const players = Array.from(state.players.values());
	// const p1 = players[0];
	// const p2 = players.length > 1 ? players[1] : undefined;
	// const isActive = state.activePlayerId === player?.id;

	// if (!p2) {
	// 	return <div>Waiting for p2...</div>;
	// }
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div>
	DN:
	{#each $lobbyRooms as room}
		<button on:click={() => join(room.roomId)}>{room.name}</button>
	{/each}
</div>
<button on:click={create}>Join</button>

{#if gameRoom && state}
	<div class={clsx('wrapper', true && 'active')}>
		<div class="player-info">
			<PlayerInfo player={Array.from(state.players.values())[0]} isClient={true} />
			<!-- <PlayerInfo player={p1} isClient={player?.id === p1.id} isActive={state.activePlayerId === p1.id} />
			{p2 && <PlayerInfo player={p2} isClient={player?.id === p2.id} isActive={state.activePlayerId === p2.id} />} -->
		</div>
		<div class="board">
			{#each state.board as value, index}
				{@const isValid = isValidMove(index, state.board)}
				<div class={clsx('cell', isValid && true && 'valid')} on:click={() => onCellClick(index)}>
					{value}
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	:global(html),
	:global(body) {
		background-color: darkgray;
	}

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
		grid-template-columns: repeat(3, 1fr);
		grid-auto-rows: minmax(100px, auto);
		width: 300px;
	}

	.cell {
		border: 2px solid gray;
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
