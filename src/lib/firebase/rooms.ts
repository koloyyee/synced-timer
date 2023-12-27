import { child, get, onValue, ref, set } from 'firebase/database';
import { firebaseDB } from './firebase';

export interface RoomStatus {
	start: Date | string | undefined;
	end: Date | string | undefined;
	duration: number | undefined;
	employee: string | undefined;
}

export interface Room {
	current: RoomStatus;
	end: RoomStatus;
	occupied: boolean;
}

/**
 * This is a function will 2 kinds:
 * 1 - No arg: return all rooms
 * 2 - with roomName: the particular room
 *
 * @param roomName string
 * @returns
 */
export async function getRooms(roomName: string = ''): Promise<Room | undefined> {
	try {
		const snapshot = await get(child(ref(firebaseDB), `/rooms${roomName ? `/${roomName}` : ''}`));
		return snapshot.exists() ? snapshot.val() : 'No data available';
	} catch (error) {
		console.error(error);
	}
}

export async function resetRoom(roomName: string): Promise<void> {
	try {
		set(ref(firebaseDB, 'rooms/' + roomName), {
			start: '',
			end: '',
			duration: 0,
			employee: ''
		});
	} catch (error) {
		console.warn(error);
	}
}

export async function readOnceRoom(roomName: string) {
	let room;
	onValue(
		ref(firebaseDB, '/rooms/' + roomName),
		(snapshot) => {
			if (snapshot.exists()) {
				room = snapshot.val();
				console.log(room);
				return room;
			}
			return null;
		},

		{
			onlyOnce: true
		}
	);

	return room;
}
