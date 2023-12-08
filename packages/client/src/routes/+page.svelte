<script lang="ts">
	import { goto } from '$app/navigation';
	import { joinLobby, lobbyRooms } from '$lib/lobby';
	import { getClient } from '$lib/util';

	const client = getClient();

	const create = () => {
		goto('/rooms/create');
	};

	const join = (id: string) => {
		goto('/rooms/' + id);
	};

	joinLobby(client);
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="table-container mb-3">
	<table class="table table-hover table-compact">
		<thead>
			<tr>
				<th>ID</th>
				<th>Created By</th>
			</tr>
		</thead>
		<tbody>
			{#each $lobbyRooms as room}
				<tr class="cursor-pointer" on:click={() => join(room.roomId)}>
					<td>{room.roomId}</td>
					<td>...</td>
				</tr>
			{:else}
				<tr>
					<td colspan={2}>No Games to Join</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<div class="flex justify-center">
	<button class="btn variant-ghost-primary" on:click={create}>Create</button>
</div>
