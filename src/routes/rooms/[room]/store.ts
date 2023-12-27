import { firebaseDB } from '$lib/firebase/firebase';
import { child, get as fbGet, update as fbUpdate, onValue, ref } from 'firebase/database';
import { writable } from 'svelte/store';

let interval: NodeJS.Timeout;

let timeLeft: any;
let serverTimeOffset = 0;
const offsetRef = ref(firebaseDB, '.info/serverTimeOffset');
onValue(offsetRef, (snapshot) => (serverTimeOffset = snapshot.val()));

export const countdownStore = (roomName: string) => {
	const currentPath = `/rooms/${roomName}/current`;
	const currentRef = ref(firebaseDB, currentPath);

	const { subscribe, set, update } = writable(0, (set) => {
		timeLeft = onValue(currentRef, (snapshot) => {
			if (snapshot.val()) {
				const current = snapshot.val();
				interval = setInterval(() => {
					const remaining =
						current.duration - (Date.now() - current.startAt - serverTimeOffset) / (60 * 1000);

					if (remaining < 0 || isNaN(remaining)) {
						clearInterval(interval);
						clearBooking(roomName);
					} else {
						// console.log(timeLeft);
						set(remaining);
						fbUpdate(currentRef, {
							remaining
						});
					}
				}, 1000);
			} else {
				console.warn('No document exist');
			}
		});
	});
	return {
		subscribe,
		set,
		update,
		clearInterval: clearInterval(interval)
	};
};

function clearBooking(roomName: string) {
	const roomPath = `/rooms/${roomName}`;
	const dbRef = ref(firebaseDB);
	fbGet(child(dbRef, roomPath)).then((snapshot) => {
		if (snapshot.exists()) {
			fbUpdate(dbRef, {
				current: {
					...snapshot.val().next,
					occupied: false
				},
				next: {
					start: '',
					end: '',
					remaining: 0,
					duration: 0,
					employee: ''
				}
			});
		}
	});
}

export const addExtraTime = (mins: string, roomName: string) => {
	const currentPath = `/rooms/${roomName}/current`;
	const currentRef = ref(firebaseDB, currentPath);
	fbGet(child(ref(firebaseDB), currentPath)).then((snapshot) => {
		if (snapshot.exists()) {
			clearInterval(interval);
			const current = snapshot.val();
			const remaining = parseInt(current.remaining);
			const extraTime = parseInt(mins);
			fbUpdate(currentRef, {
				...current,
				remaining: remaining + extraTime
			});
		} else {
			console.error('No document found.');
		}
	});
};
