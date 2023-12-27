<script lang="ts">
	import { firebaseDB } from '$lib/firebase/firebase';
	import { getContext, onDestroy, onMount, type EventDispatcher } from 'svelte';
	import { ref, onValue, update, set, serverTimestamp, get, child } from 'firebase/database';
	import Timer from '../routes/rooms/[room]/Timer.svelte';
	import { DateTime } from 'luxon';
	import ExtraMinsModal from './ExtraMinsModal.svelte';
	import CancelBookingModal from './admin/CancelBookingModal.svelte';
	import CreateBookingModal from './admin/CreateBookingModal.svelte';
	import MoveToCurrentModal from './admin/MoveToCurrentModal.svelte';
	import { browser } from '$app/environment';

	/**
	 * This card will be contain the live updated countdown timer sync with the room accordingly
	 *	All window.location.reload() are subject to fix for better UX.
	 */

	export let data;
	export let room;

	let unsubscribe: any; // firebase unsubscribe function
	let snapshotData: any; // for timer's mins, secs
	let interval: any; // intervalId for setInterval
	let previousValue: any = null; // for clearInterval

	// keys for updating components
	let isOccupied = data?.occupied;
	$: currDuration = data?.current?.duration;
	$: rerenderKey = false;

	const roomPath = `rooms/${room}`;
	const currentPath = roomPath + '/current';
	const currentRef = ref(firebaseDB, currentPath);
	const roomRef = ref(firebaseDB, roomPath);

	onMount(() => {
		let serverTimeOffset = 0;
		const offsetRef = ref(firebaseDB, '.info/serverTimeOffset');
		onValue(offsetRef, (snapshot) => (serverTimeOffset = snapshot.val()));
		onValue(roomRef, (snapshot) => (isOccupied = snapshot.val().occupied));

		unsubscribe = onValue(currentRef, (snapshot) => {
			const current = snapshot.val();

			if (JSON.stringify(previousValue) !== JSON.stringify(current)) {
				// clearInterval whenever value changes
				// avoid number flick from client side and admin side
				previousValue = current;
				clearInterval(interval);
			}
			const { duration, startAt } = current;

			if (startAt) {
				interval = setInterval(async () => {
					snapshotData = duration - (Date.now() - startAt - serverTimeOffset) / (60 * 1000);

					if (snapshotData < 0) {
						clearInterval(interval);
						const next = data?.next ?? {
							start: '',
							end: '',
							duration: 0,
							startAt: 0
						};

						const value = {
							occupied: false,
							current: {
								...next
							},
							next
						};
						update(roomRef, value);
						currDuration = 0;
						secs = 0;
					} else {
						snapshotData -= 1;
					}
				}, 1000);
			}
		});
	});
	onDestroy(() => {
		// unsubscribe();
		clearInterval(interval);
	});

	function setTimer() {
		const roomsRef = ref(firebaseDB, `rooms/${room}`);
		set(roomsRef, {
			occupied: true,
			current: {
				...data?.current,
				startAt: serverTimestamp()
			},
			next: data?.next ?? {
				start: '',
				end: '',
				duration: 0
			}
		}).then(() => {
			unsubscribe();
			get(child(ref(firebaseDB), roomPath)).then((snapshot) => {
				if (snapshot.exists()) {
					isOccupied = snapshot.val().occupied;
				}
			});
		});
	}

	$: mins = Math.floor(snapshotData + 1);
	$: minName = mins > 1 ? 'mins' : 'min';
	$: secs = Math.floor(snapshotData * 60 - (mins - 1) * 60);

	type booking = {
		start: Date;
		end: Date;
		duration: number;
		remaining: number;
		employee: string;
	};

	function returnTime(datetime: string | number) {
		if (datetime === 0) return '';
		let result;
		if (typeof datetime === 'string') {
			result = DateTime.fromISO(datetime).toFormat('HH:mm');
			return result === 'Invalid DateTime' ? '' : result;
		} else {
			return (result = DateTime.fromMillis(datetime).toFormat('HH:mm'));
		}
	}
	let currentStart = returnTime(data?.current?.start);
	let currentEnd = returnTime(data?.current?.end);
	let nextStart = returnTime(data?.next?.start);
	let nextEnd = returnTime(data?.next?.end);

	function onExtraMins(event) {
		currDuration = event.detail as number;
		rerenderKey = !rerenderKey;
		browser && window.location.reload();
	}

	function onReset(event) {
		const key = event.detail;
		if (key === 'current') {
			snapshotData = 0;
			mins = 0;
			clearInterval(interval);
			currentStart = '';
			currentEnd = '';
		} else {
			nextStart = '';
			nextEnd = '';
			browser && window.location.reload();
		}
	}
	function onBookingCreated(event) {
		rerenderKey = !rerenderKey;
	}
</script>

{#key rerenderKey}
	<!-- <div class="card max-w-[20rem] min-w-[12rem] max-h-[36rem] min-h-[20rem] bg-base-100 shadow-xl"> -->
	<div class="card w-10/12 bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title">{room.toUpperCase()}</h2>
			<h2 class="card-title">Current</h2>
			<section class="flex">
				<span class="badge {isOccupied ? 'badge-error' : 'badge-success'}">
					{isOccupied ? 'Occupied' : 'Available'}
				</span>
				<p class="flex gap-2 justify-center">
					<span> {currentStart} </span> - <span> {currentEnd} </span>
				</p>
			</section>
			{#key rerenderKey}
				{#if currentStart}
					<Timer {mins} {minName} {secs} isCardView={true} />
				{:else}
					<h1 class="text-18">No Booking Yet!</h1>
				{/if}
			{/key}
			<div class="flex gap-3 justify-center">
				{#if isOccupied}
					<ExtraMinsModal {mins} {room} on:extraMins={onExtraMins} />
					<CancelBookingModal {room} on:reset={onReset} />
				{:else if !isOccupied && !currentStart}
					<CreateBookingModal {room} key="current" on:bookingCreated={onBookingCreated} />
				{:else}
					<button class="btn btn-outline btn-success" on:click={setTimer}> Start! </button>
				{/if}
			</div>

			<h2 class="card-title">Next</h2>
			<p class="flex gap-2 justify-center">
				<span> {nextStart} </span> - <span> {nextEnd} </span>
			</p>
			{#key rerenderKey}
				{#if !data?.next?.start}
					<CreateBookingModal {room} key="next" on:bookingCreated={onBookingCreated} />
				{:else if !data?.current?.start && !isOccupied}
					<MoveToCurrentModal {room} />
				{:else if data?.current?.start && data?.next?.start}
					<MoveToCurrentModal {room} />
					<CancelBookingModal {room} on:reset={onReset} key="next" />
				{:else}
					<CancelBookingModal {room} on:reset={onReset} key="next" />
				{/if}
			{/key}
		</div>
	</div>
{/key}
