import { getRooms } from '$lib/firebase/rooms';

export const ssr = false;

export async function load({ params }) {
	const room = await getRooms(params.room);
	return {
		room: params.room,
		...room
	};
}
