<script lang="ts">
	import { page } from '$app/stores';

	export let room: string | undefined;
	const pathname: string = $page.url.pathname;
	export let dialogId: string = 'my_modal_1';

	let isModalOpen = false;

	console.log({ pathname });
</script>

<button class="btn btn-warning outline" on:click={() => (isModalOpen = true)}
	>Move To Current
</button>
<dialog id={dialogId} class="modal modal-bottom sm:modal-middle" class:modal-open={isModalOpen}>
	<div class="modal-box">
		<h3 class="font-bold text-lg">Hello!</h3>
		<p class="py-4">
			Press <span class="text-warning">Cancel</span> to Move Current Booking.
		</p>
		<p>or Press ESC.</p>
		<div class="modal-action">
			<form method="POST" action="{pathname}?/to_current">
				<input type="hidden" value={room} name="room" />
				<button class="btn btn-warning btn-outline" type="submit">Move</button>
			</form>
			<button class="btn btn-neutral btn-outline" on:click={() => (isModalOpen = false)}>
				Close
			</button>
		</div>
	</div>
</dialog>
