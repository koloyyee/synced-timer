import { firebaseDB } from '$lib/firebase/firebase';
import { getRooms } from '$lib/firebase/rooms';
import { emptyRoom } from '$lib/utils/state';
import type { Actions } from '@sveltejs/kit';
import { ref, serverTimestamp, set, update } from 'firebase/database';
// import { RoomsService } from '$lib/firebase/rooms';

// Booking server form actions
export const actions: Actions = {
	// create booking
	create: async (event) => {
		const formData = await event.request.formData();
		const start = formData.get('start') as string;
		const end = formData.get('end') as string;
		const employee = formData.get('employee') as string;
		const duration = formData.get('duration');
		const key = formData.get('key') as string;
		const room = formData.get('room');

		update(ref(firebaseDB, 'rooms/' + room), {
			[key]: {
				start: parseInt(start),
				end: parseInt(end),
				duration: duration,
				startAt: 0,
				employee: employee
			}
		});
		return getRooms(room as string);
	},
	start: async ({ request }) => {
		const formData = await request.formData();
		const room = formData.get('room') as string;

		const data = await getRooms(room);

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
		});
	},

	// move the next booking to current
	to_current: async ({ request }) => {
		const data = await request.formData();
		const room = data.get('room') as string;

		const roomData = await getRooms(room);
		const next = roomData?.next;
		const emptyRoomState = emptyRoom('next');

		const current = {};
		next['startAt'] = 0;
		Object.assign(current, next);
		const updateRoomValue = {
			current
		};
		Object.assign(updateRoomValue, emptyRoomState);

		console.log(updateRoomValue);

		update(ref(firebaseDB, 'rooms/' + room), updateRoomValue);
	}
};
