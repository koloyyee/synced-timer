<script lang="ts">
	import CancelBookingModal from '$components/admin/CancelBookingModal.svelte';
	import { BG } from '$lib/constants/backgounds';
	import { firebaseDB } from '$lib/firebase/firebase';
	import { authUser } from '$lib/stores/auth';
	import { child, get, onValue, ref, serverTimestamp, set, update } from 'firebase/database';
	import { getContext, onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';
	import Timer from './Timer.svelte';

	export let data: PageData;

	let unsubscribe: any; // firebase unsubscribe function
	let snapshotData: any; // for timer's mins, secs
	let interval: any; // intervalId for setInterval
	let previousValue: any = null; // for clearInterval

	// keys for updating components

	const roomPath = `rooms/${data.room}`;
	const currentPath = roomPath + '/current';
	const currentRef = ref(firebaseDB, currentPath);
	const roomRef = ref(firebaseDB, roomPath);

	onMount(() => {
		let serverTimeOffset = 0;
		const offsetRef = ref(firebaseDB, '.info/serverTimeOffset');
		onValue(offsetRef, (snapshot) => (serverTimeOffset = snapshot.val()));

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
						snapshotData = 0;
						secs = 0;
					} else {
						snapshotData -= 1;
					}
				}, 1000);
			}
		});
	});
	onDestroy(() => {
		unsubscribe();
		clearInterval(interval);
	});

	$: mins = Math.floor(snapshotData + 1);
	$: minName = mins > 1 ? 'mins' : 'min';
	$: secs = Math.floor(snapshotData * 60 - (mins - 1) * 60);

	const { getBg } = getContext('topLevelContext');
	const twBg = getBg();
	const { refresh } = getContext('refresher');
	let refresher = refresh();

	$: bg = `h-screen bg-gradient-to-br ${$twBg}`;

	let x = 5;
	if (mins < 10 && $authUser) {
		$twBg = BG.LEMONADE;
	} else {
		$twBg = BG.STRAWBERRY;
	}
</script>

<!--
	<button class="btn btn-outline btn-neutral" on:click={() => browser && location.reload()}>
		refresh
	</button>
--->
<!-- {#if data?.current?.start} -->

{#key $refresher}
	<Timer {mins} {minName} {secs} class="self-center" />
{/key}
