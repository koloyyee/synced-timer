// get rooms names

import { getRooms } from '$lib/firebase/rooms';

export async function load() {
	const rooms = await getRooms();
	const names = Object.keys(rooms);
	return {
		names
	};
}
