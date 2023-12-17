<script lang="ts">
	export let player: IPlayer;
	export let isClient: boolean;
	export let isActive: boolean;
	export let gameStatus: GameStatus;

	import clsx from 'clsx';
	import { GameStatus, type IPlayer } from '@tictac/shared';

	let start = 0;
	let now = 0;

	$: inProgress = gameStatus === GameStatus.InProgress;

	$: sTotal = Math.round((player.timeRemainingMs - (now - start)) / 1000);
	$: h = Math.floor(sTotal / 3600);
	$: m = Math.floor((sTotal - h * 3600) / 60);
	$: s = sTotal - h * 3600 - m * 60;
	$: timeDisplay = sTotal > 0 ? `${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s` : '00m 00s';

	let interval: NodeJS.Timeout;
	$: if (isActive && inProgress) {
		start = player.turnStartDate;
		now = Date.now();

		clearInterval(interval);
		interval = setInterval(() => {
			now = Date.now();
		}, 100);
	} else {
		start = 0;
		now = 0;
		clearInterval(interval);
	}
</script>

<div class={clsx(!isActive && inProgress && 'text-gray-500')}>
	<div class="flex gap-2">
		<h4 class="h4">{`${player.name}${isClient ? ' (you)' : ''}`}</h4>
		<span
			class={clsx('badge-icon h-3 w-3', player.isConnected ? 'variant-filled-success' : 'variant-filled-error')}
			title={player.isConnected ? 'Connected' : 'Disconnected'}
		/>
	</div>
	<span>{timeDisplay}</span>
</div>
