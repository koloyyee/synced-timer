// import { onAuthStateChanged } from 'firebase/auth';
// import { firebaseAuth } from './src/lib/firebase/firebase';
// import { redirect, type Handle } from '@sveltejs/kit';

// const unProtectedRoutes = ['/login', 'logout', '/'];

// export const handle: Handle = async ({ event, resolve }) => {
// 	const session = event.cookies.get('session');
// 	if (session && unProtectedRoutes.includes(event.url.pathname)) {
// 		throw redirect(303, '/');
// 	}
// 	let user = null;

// 	const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
// 		user = firebaseUser;

// 		unsubscribe();
// 	});
// 	console.log({ user });

// 	console.log(event.cookies.getAll());
// 	if (user) {
// 		event.locals.user = {
// 			isAuthenticated: true,
// 			email: user.email,
// 			uid: user.uid
// 		};
// 	} else {
// 		if (!unProtectedRoutes.includes(event.url.pathname)) {
// 			throw redirect(303, '/');
// 		}
// 	}
// 	const query = event.url.searchParams.get('logout');
// 	if (Boolean(query) == true) {
// 		await event.cookies.delete('session_id', { path: '/' });
// 	}
// 	return resolve(event);
// };
