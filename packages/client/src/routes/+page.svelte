<script lang="ts">
	import { goto } from '$app/navigation';
	import { joinLobby, leaveLobby, lobbyRooms } from '$lib/lobby';
	import { getClient } from '$lib/util';
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import { NUM_PLAYERS } from '../../../shared/config';
	import { onDestroy, onMount } from 'svelte';

	const client = getClient();
	let tabSet: number = 0;

	const createPublic = () => {
		goto('/rooms/create');
	};

	const createPrivate = () => {
		goto('/rooms/create?private=true');
	};

	const join = (id: string) => {
		goto('/rooms/' + id);
	};

	onMount(async () => {
		await joinLobby(client);
	});

	onDestroy(async () => {
		await leaveLobby();
	});
</script>

<TabGroup justify="justify-center">
	<Tab bind:group={tabSet} name="joinTab" value={0}>Join</Tab>
	<Tab bind:group={tabSet} name="spectateTab" value={1}>Spectate</Tab>

	<svelte:fragment slot="panel">
		<div class="table-container mb-3">
			<table class="table table-hover table-compact">
				<thead>
					<tr>
						<th>ID</th>
						<th>Created By</th>
					</tr>
				</thead>
				<tbody>
					{#if tabSet === 0}
						{#each $lobbyRooms.filter((r) => r.clients < NUM_PLAYERS) as room}
							<tr class="cursor-pointer" on:click={() => join(room.roomId)}>
								<td>{room.roomId}</td>
								<td>...</td>
							</tr>
						{:else}
							<tr>
								<td colspan={2}>No Games to Join</td>
							</tr>
						{/each}
					{:else}
						{#each $lobbyRooms.filter((r) => r.clients >= NUM_PLAYERS) as room}
							<tr class="cursor-pointer" on:click={() => join(room.roomId)}>
								<td>{room.roomId}</td>
								<td>...</td>
							</tr>
						{:else}
							<tr>
								<td colspan={2}>No Games to Spectate</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</svelte:fragment>
</TabGroup>

<div class="flex justify-center gap-3">
	<button class="btn variant-ghost-primary" on:click={createPublic}>Create Public</button>
	<button class="btn variant-ghost-secondary" on:click={createPrivate}>Create Private</button>
</div>
