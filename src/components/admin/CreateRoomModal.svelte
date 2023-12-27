<script lang="ts">
	import { page } from '$app/stores';

	let isModalOpen = false;
	let room: string;
</script>

<button class="btn hover:btn-warning" on:click={() => (isModalOpen = true)}>Create Room</button>
<dialog id="my_modal_5" class="modal modal-bottom sm:modal-middle" class:modal-open={isModalOpen}>
	<div class="modal-box">
		<h3 class="font-bold text-lg">Create a New Room!</h3>
		<p class="py-4">Please click the "Close" below to quit</p>
		<div class="modal-action">
			<form method="POST" action={$page.url.pathname + '?/create'}>
				<!-- if there is a button in form, it will close the modal -->
				<label for="room"> Room Name:</label>
				<input
					type="text"
					class="input-bordered input-primary input"
					name="room"
					required
					bind:value={room}
				/>

				<button class="btn btn-accent" type="submit">Create!</button>
			</form>
			<button class="btn" on:click={() => (isModalOpen = false)}>Close</button>
		</div>
	</div>
</dialog>
