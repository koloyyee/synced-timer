// import { env } from "$env/dynamic/private";
// import { firebaseAuth } from "$lib/firebase/firebase";
// import { authUser } from "$lib/stores/auth";
// import type { Actions } from "@sveltejs/kit";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { get } from "svelte/store";
// import type { PageServerLoad } from "./$types";

// // export const load: PageServerLoad = async ({ cookies }) => {
// //     const session = cookies.get('session');
// //     return {
// //         authUser
// //     }
// // }

// export const actions: Actions = {
//     login: async ({ request, cookies }) => {
//         const data = await request.formData();
//         const email = data.get('email') as string;
//         const password = data.get('password') as string;

//         signInWithEmailAndPassword(firebaseAuth, email, password)
//             .then((userCredential) => {
//                 authUser.set({
//                     uid: userCredential?.user?.uid,
//                     email: userCredential?.user?.email,
//                     isLoggedin: true,
//                     token: userCredential.user.refreshToken
//                 });

//                 console.log('authUser', get(authUser))
//             })
//             .catch((error) => {
//                 const errorCode = error.code;
//                 const errorMessage = error.message;
//             });

//         cookies.set('session', get(authUser)?.token, {
//             path: '/',
//             secure: env.NODE_ENV === 'production',
//             httpOnly: true,
//             sameSite: 'strict',
//         })
//     }

// }
