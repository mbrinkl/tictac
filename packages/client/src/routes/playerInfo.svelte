<script lang="ts">
	export let player: IPlayer;
	export let isClient: boolean;

	import type { IPlayer } from '../../../shared';

	// const [start, setStart] = useState(0);
	// const [now, setNow] = useState(0);

	// useEffect(() => {
	//   setStart(Date.now());
	//   setNow(Date.now());
	//   let intervalId: number;
	//   if (isActive) {
	//     intervalId = setInterval(() => {
	//       setNow(Date.now());
	//     }, 100);
	//   }
	//   return () => clearInterval(intervalId);
	// }, [isActive, setStart]);
	// const delta = now - start;
	// const msRemaining = player.timeRemainingMs - delta;
	// const secondsRemaining = Math.ceil(msRemaining / 1000);
	// const timeDisplay = secondsRemaining < 0 ? '0' : secondsRemaining.toString();
</script>

<div>
	P{player.id}
	{isClient && '(you)'}
	{player.isConnected ? 'F' : 'L'}
	{0}
</div>
