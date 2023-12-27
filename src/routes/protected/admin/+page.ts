// get all rooms name and status

import { getRooms } from '$lib/firebase/rooms';

export const load = () => {
	const rooms = getRooms();

	return {
		rooms
	};
};
