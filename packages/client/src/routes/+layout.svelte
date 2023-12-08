<script lang="ts">
	import '../app.pcss';
	import { setContext } from 'svelte';
	import { Client } from 'colyseus.js';

	const client = new Client('ws://localhost:2567');
	setContext('client', client);
</script>

<div class="container mx-auto mt-3">
	<slot />
</div>
