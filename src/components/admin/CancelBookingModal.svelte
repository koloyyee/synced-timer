<script lang="ts">
	import { page } from '$app/stores';
	import { firebaseDB } from '$lib/firebase/firebase';
	import { emptyRoom, type Status } from '$lib/utils/state';
	import { ref, update } from 'firebase/database';
	import { createEventDispatcher, getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let room: string | undefined;
	export let key: Status = 'current';
	export let dialogId: string = 'my_modal_1';

	let isModalOpen = false;
	const dispatch = createEventDispatcher();
	const { refresh } = getContext('refresher');
	let refresher = refresh();

	function dispatchReset() {
		dispatch('reset', key);
		isModalOpen = false;
	}

	function cancelBooking() {
		let emptyRoomState = emptyRoom(key);

		console.log(emptyRoomState);

		update(ref(firebaseDB, 'rooms/' + room), {
			...emptyRoomState,
			occupied: false
		})
			.then(() => console.log('Document updated', key, room))
			.catch((error) => console.warn(error));
		dispatchReset();
	}
</script>

<button class="btn btn-error outline" on:click={() => (isModalOpen = true)}>Cancel Booking</button>
<dialog id={dialogId} class="modal modal-bottom sm:modal-middle" class:modal-open={isModalOpen}>
	<div class="modal-box">
		<p class="py-4">
			Press <span class="text-error">Cancel room {room}</span> to Remove {key.toUpperCase()} Booking.
		</p>
		<p>or Press ESC.</p>
		<div class="modal-action">
			<form on:submit|preventDefault={cancelBooking}>
				<input type="hidden" value={room} name="room" />
				<input type="hidden" value={key} name="key" />
				<button class="btn btn-error btn-outline" type="submit">Cancel Booking</button>
			</form>
			<button class="btn btn-neutral btn-outline" on:click={() => (isModalOpen = false)}
				>Cancel</button
			>
		</div>
	</div>
</dialog>
