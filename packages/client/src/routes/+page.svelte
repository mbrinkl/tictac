<script lang="ts">
	import { goto } from '$app/navigation';
	import { joinLobby, lobbyRooms } from '$lib/lobby';
	import { getClient } from '$lib/util';
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';

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

	joinLobby(client);
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

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
					{:else}
						<tr>
							<td colspan={2}>No Games to Spectate</td>
						</tr>
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
