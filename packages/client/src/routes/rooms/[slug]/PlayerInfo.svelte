<script lang="ts">
	export let player: IPlayer;
	export let isClient: boolean;
	export let isActive: boolean;

	import type { IPlayer } from '../../../../../shared';

	let start = 0;
	let now = 0;

	$: count = Math.round((player.timeRemainingMs - (now - start)) / 1000);
	$: h = Math.floor(count / 3600);
	$: m = Math.floor((count - h * 3600) / 60);
	$: s = count - h * 3600 - m * 60;
	$: display = count > 0 ? s : 0;

	let interval: NodeJS.Timeout;
	$: if (isActive) {
		start = Date.now();
		now = Date.now();
		interval = setInterval(() => (now = Date.now()), 100);
	} else {
		clearInterval(interval);
	}
</script>

<div>
	P{player.id}
	{isClient && '(you)'}
	{player.isConnected ? 'F' : 'L'}
	{display}
</div>
