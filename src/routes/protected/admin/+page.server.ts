import { firebaseDB } from '$lib/firebase/firebase';
import { emptyRoom } from '$lib/utils/state';
import type { Actions } from '@sveltejs/kit';
import { child, get, ref, set, update } from 'firebase/database';

export const actions: Actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const room = data.get('room') as string;
		const emptyCurrent = emptyRoom('current');
		const emptyNext = emptyRoom('next');

		update(ref(firebaseDB, 'rooms/' + room.toLowerCase()), {
			...emptyCurrent,
			...emptyNext,
			occupied: false
		});
	},
	update: async ({ request }) => {
		const data = await request.formData();
		const room = data.get('room') as string;

		get(child(ref(firebaseDB), 'rooms/' + room)).then((snapshot) => {
			if (snapshot.exists()) {
				const current = snapshot.val().current;
				const next = snapshot.val().next;
				const occupied = snapshot.val().occupied;

				update(ref(firebaseDB, 'rooms/' + room), {
					[room.toLowerCase()]: {
						current: {
							...current
						},
						next: {
							...next
						},
						occupied
					}
				});
			}
		});
	}
	// delete:
};
