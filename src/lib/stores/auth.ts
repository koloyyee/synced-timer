import { onAuthStateChanged, type Auth, type Unsubscribe } from 'firebase/auth';
import { writable } from 'svelte/store';

interface AuthUser {
	uid: string;
	email: string;
}

const authUser = writable<AuthUser | undefined>(undefined);

export { authUser };

export function userStore(auth: Auth, startWith = null) {
	let unsubscribe: Unsubscribe;

	// fallback for SSR
	if (!globalThis.window) {
		const { subscribe } = writable(startWith);
		return {
			subscribe
		};
	}

	// fallback for missing SDK
	if (!auth) {
		console.warn(
			'Firebase Auth is not initialized. Are you missing FirebaseApp as a parent component?'
		);
		const { subscribe } = writable(null);
		return {
			subscribe
		};
	}

	const { subscribe, set } = writable(auth?.currentUser ?? null, (set) => {
		unsubscribe = onAuthStateChanged(auth, (user) => {
			set(user);
			localStorage.setItem('authUser', JSON.stringify(user));
		});
		return () => unsubscribe();
	});
	return { subscribe, set };
}
