<script lang="ts">
	import { setContext } from 'svelte';
	import { Client } from 'colyseus.js';
	import { dev } from '$app/environment';
	import { initializeStores, Toast } from '@skeletonlabs/skeleton';
	import '../app.pcss';

	initializeStores();

	const { origin, protocol, hostname } = window.location;
	const serverUrl = dev ? `${protocol}//${hostname}:${2567}` : origin;

	const client = new Client(serverUrl);
	setContext('client', client);
</script>

<svelte:head>
	<title>TicTacToe</title>
	<meta name="description" content="TicTacToe with Coylseus" />
</svelte:head>

<Toast />

<div class="container mx-auto px-4 py-3 h-screen">
	<slot />
</div>
