<script lang="ts">
	import { firebaseDB } from '$lib/firebase/firebase';
	import { child, get, ref, update } from 'firebase/database';
	import { createEventDispatcher } from 'svelte';

	export let mins;
	export let room;

	const dispatch = createEventDispatcher();

	let isModalOpen = false;

	const roomPath = `rooms/${room}`;
	const currentPath = roomPath + '/current';
	const currentRef = ref(firebaseDB, currentPath);
	const roomRef = ref(firebaseDB, roomPath);

	let extraMins = 0;
	const extraTimeRange = [60, 120, 240];

	function dispatchDuration(newDuration: number) {
		dispatch('extraMins', newDuration);
	}

	const addExtraTime = (mins: number) => {
		get(child(ref(firebaseDB), currentPath)).then((snapshot) => {
			if (snapshot.exists()) {
				const current = snapshot.val();
				const duration = parseInt(current.duration);
				const extraTime = parseInt(mins);

				update(currentRef, {
					...current,
					duration: duration + extraTime
				});
				extraMins = 0;
				dispatchDuration(duration + extraTime);
				isModalOpen = false;
			} else {
				console.error('No document found.');
			}
		});
	};
</script>

<button class="btn" on:click={() => (isModalOpen = true)}>+ Mins</button>
<dialog id="my_modal_3" class="modal" class:modal-open={isModalOpen}>
	<div class="modal-box">
		<form
			class="flex flex=col items-center gap-5"
			method="dialog"
			on:submit|preventDefault={() => addExtraTime(extraMins)}
		>
			<button
				class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
				on:click|stopPropagation={() => (isModalOpen = false)}
			>
				✕
			</button>
			<h2 class="text-18">
				Add Extra Mins to <span class="font-bold text-2xl">Room: {room}</span>
			</h2>
			<select
				bind:value={extraMins}
				placeholder="extra mins"
				class="select border-[1px] border-gray-500"
			>
				{#each extraTimeRange as time}
					<option>{time} </option>
				{/each}
			</select>

			<button class="btn btn-outline btn-warning"> + {extraMins} mins</button>
		</form>
	</div>
</dialog>
