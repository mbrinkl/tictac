<script lang="ts">
	export let player: IPlayer;
	export let isClient: boolean;
	export let isActive: boolean;

	import clsx from 'clsx';
	import type { IPlayer } from '../../../../../shared';

	let start = 0;
	let now = 0;

	$: sTotal = Math.round((player.timeRemainingMs - (now - start)) / 1000);
	$: h = Math.floor(sTotal / 3600);
	$: m = Math.floor((sTotal - h * 3600) / 60);
	$: s = sTotal - h * 3600 - m * 60;
	$: timeDisplay = sTotal > 0 ? `${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s` : '00m 00s';

	let interval: NodeJS.Timeout;
	$: if (isActive) {
		start = Date.now();
		now = Date.now();
		interval = setInterval(() => (now = Date.now()), 100);
	} else {
		clearInterval(interval);
	}
</script>

<div class={clsx(!isActive && 'text-gray-500')}>
	<div class="flex gap-2">
		<h4 class="h4">{`${player.name}${isClient ? ' (you)' : ''}`}</h4>
		<span
			class={clsx('badge-icon h-3 w-3', player.isConnected ? 'variant-filled-success' : 'variant-filled-error')}
			title={player.isConnected ? 'Connected' : 'Disconnected'}
		/>
	</div>
	<span>{timeDisplay}</span>
</div>
