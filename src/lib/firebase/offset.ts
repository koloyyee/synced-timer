import { onValue, ref, serverTimestamp, set } from 'firebase/database';
import { firebaseDB } from './firebase';

export const testCountdown = () => {
	const countdownRef = ref(firebaseDB, 'countdown');
	set(countdownRef, {
		startAt: serverTimestamp(),
		seconds: 5
	});

	let serverTimeOffset = 0;
	const offsetRef = ref(firebaseDB, '.info/serverTimeOffset');
	onValue(offsetRef, (snapshot) => (serverTimeOffset = snapshot.val()));

	onValue(countdownRef, (snapshot) => {
		const seconds = snapshot.val().seconds;
		const startAt = snapshot.val().startAt;
		const interval = setInterval(() => {
			const timeLeft = seconds * 1000 - (Date.now() - startAt - serverTimeOffset);

			console.log('now', Date.now());
			console.log('start', startAt);
			console.log('sec', seconds);
			if (timeLeft < 0) {
				clearInterval(interval);
				console.log('0.0 left');
			} else {
				console.log(`${Math.floor(timeLeft / 1000)}.${timeLeft % 1000}`);
			}
		}, 100);
	});
};
