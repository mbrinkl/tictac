<script lang="ts">
	export let onSubmit: () => Promise<void>;

	import { playerName } from '$lib/gameStore';

	const setName = async (e: SubmitEvent) => {
		// double click possibility of double join? idk check later
		const formData = new FormData(e.target as HTMLFormElement);
		const nickname = formData.get('nickname') as string | null;
		if (nickname) {
			$playerName = nickname;
			await onSubmit();
		}
	};
</script>

<div class="h-full flex flex-col justify-center items-center gap-3">
	<h4 class="h4">Update Nickname</h4>
	<form method="post" on:submit|preventDefault={setName} class="flex gap-3">
		<input id="nickname" name="nickname" placeholder="Nickname" class="input" required />
		<button type="submit" class="btn variant-ghost-primary">Update</button>
	</form>
</div>
