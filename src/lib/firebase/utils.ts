import { authUser } from '$lib/stores/auth';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { firebaseAuth } from './firebase';
import { goto } from '$app/navigation';
import { get } from 'svelte/store';

export function logout() {
	signOut(firebaseAuth)
		.then(() => {
			authUser.set(undefined);
			goto('/login');
			localStorage.removeItem('authUser');
			window.sessionStorage.clear();
		})
		.catch((error) => {
			console.log(error);
		});
}

export const login = (email: string, password: string) => {
	signInWithEmailAndPassword(firebaseAuth, email, password)
		.then((userCredential) => {
			authUser.set({
				uid: userCredential?.user?.uid,
				email: userCredential?.user?.email!
			});
			goto('/protected/admin/bookings');
			window.sessionStorage.setItem('authUser', JSON.stringify(get(authUser)));
			localStorage.setItem('authUser', JSON.stringify(get(authUser)));
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.log(errorCode, errorMessage);
		});
	return authUser;
};
