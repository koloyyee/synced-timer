import { getRooms } from '$lib/firebase/rooms';

export async function load() {
	const rooms = await getRooms();
	return {
		rooms
	};
}
