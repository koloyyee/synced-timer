import { child, get, ref, set } from 'firebase/database';
import { firebaseDB } from './firebase';

export function createBooking(start: Date, duration: number, room: string, employee: string = '') {
	set(ref(firebaseDB, 'bookings/' + crypto.randomUUID()), {
		start,
		duration,
		room,
		employee
	});
}

export async function getBookings(roomName: string = '') {
	const dbRef = ref(firebaseDB);
	const query = `/${roomName}`;

	try {
		const snapshot = await get(child(dbRef, `/rooms${roomName ? query : ''}`));
		return snapshot.exists() ? snapshot.val() : 'No data available';
	} catch (error) {
		console.error(error);
	}
}
