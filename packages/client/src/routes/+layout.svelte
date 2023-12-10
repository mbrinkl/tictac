<script lang="ts">
	import '../app.pcss';
	import { setContext } from 'svelte';
	import { Client } from 'colyseus.js';
	import { dev } from '$app/environment';

	const { origin, protocol, hostname } = window.location;
	const serverUrl = dev ? `${protocol}//${hostname}:${2567}` : origin;

	const client = new Client(serverUrl);
	setContext('client', client);
</script>

<div class="container mx-auto mt-3">
	<slot />
</div>
