<script lang="ts">
	import { DateTime } from 'luxon';
	import { ref, update } from 'firebase/database';
	import { firebaseDB } from '$lib/firebase/firebase';
	import { authUser } from '$lib/stores/auth';
	import { createEventDispatcher, getContext } from 'svelte';
	import { page } from '$app/stores';

	export let room: string, key: string;

	let isModalOpen = false;
	const dispatch = createEventDispatcher();

	// DateTime.fromFormat(startTime, 'yyyy-MMMM-dd HH:mm')

	let startTime: number = Date.now();
	let duration: number = 0;

	$: endTime = startTime
		? DateTime.fromMillis(startTime).plus({ minutes: duration }).toMillis()
		: 0;

	function createBooking() {
		console.log({
			[key]: {
				start: startTime,
				end: endTime,
				duration: duration,
				startAt: 0,
				employee: $authUser?.email
			}
		});
		update(ref(firebaseDB, `rooms/${room}`), {
			[key]: {
				start: new Date(startTime),
				end: new Date(endTime),
				duration: duration,
				startAt: 0,
				employee: $authUser?.email ?? ''
			}
		});

		isModalOpen = false;
		dispatchCreate();
	}

	let durationRange: number[] = [30, 60, 120, 240];

	$: isDisabled = startTime === 0 || duration === 0;
	function minsToHr(mins: number) {
		const hours = Math.floor(mins / 60);
		const minutes = mins % 60;
		return hours === 0
			? `${minutes} mins`
			: `${hours}${minutes === 0 ? '' : '.' + minutes} ${hours > 1 ? 'hours' : 'hour'}`;
	}

	function timeOnly(datetime: number) {
		const result = DateTime.fromMillis(datetime).toFormat('HH:mm');
		return result !== 'Invalid DateTime' ? result : '';
	}
	function dispatchCreate() {
		dispatch('bookingCreated');
	}
</script>

<!-- Open the modal using ID.showModal() method -->
<button class="btn" on:click={() => (isModalOpen = true)}>Create Booking</button>
<dialog id="my_modal_2" class="modal" class:modal-open={isModalOpen}>
	<div class="modal-box w-11/12 max-w-2xl min-h-max">
		<button
			class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
			on:click|stopPropagation={() => (isModalOpen = false)}
		>
			✕
		</button>
		<form
			class="flex flex-col items-center gap-5"
			method="POST"
			action={$page.url.pathname + '?/create'}
		>
			<!--

			use:enhance={({ formData }) => {
				return async ({ result, update }) => {
					if (result.status === 200) {
						dispatchCreate();
						isModalOpen = false;
					}
				};
			}}
-->

			<section class="flex gap-10" />
			<div class="btn-group">
				{#each durationRange as time}
					<input
						bind:group={duration}
						type="radio"
						name="duration"
						value={time}
						data-title={minsToHr(time)}
						class="btn"
						checked={time === 30}
					/>
				{/each}
			</div>
			<div class="flex flex-col">
				<p>
					<span class="font-bold"> Start - End </span>
				</p>

				<p class="text-6xl {endTime ? '' : 'mb-4'} ">
					{timeOnly(startTime)}
					{#if duration}
						{endTime ? '-' : ''}
						{timeOnly(endTime)}
					{:else}
						_ _ : _ _
					{/if}
				</p>
			</div>
			<button
				type="submit"
				class="btn m-5 {isDisabled ? 'cursor-not-allowed bg' : 'btn-accent'}"
				disabled={isDisabled}
			>
				Create
			</button>
			<input type="hidden" name="employee" value={$authUser?.email ?? ''} />
			<input type="hidden" name="end" value={endTime} />
			<input type="hidden" name="key" value={key} />
			<input type="hidden" name="room" value={room} />
			<input type="hidden" name="start" value={startTime} />
		</form>
	</div>
</dialog>
