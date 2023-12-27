import type { Auth } from 'firebase/auth';
import type { Database } from 'firebase/database';
import type { Firestore } from 'firebase/firestore';
import type { FirebaseStorage } from 'firebase/storage';
import { getContext, setContext } from 'svelte';

export interface FirebaseSDKCtx {
	auth?: Auth;
	firebaseDB?: Database;
	firestore?: Firestore;
	storage?: FirebaseStorage;
}

export const ctxKey = 'firebase';

export function setFirebaseCtx(sdk: FirebaseSDKCtx) {
	setContext(ctxKey, sdk);
}

export function getFirebaseCtx(): FirebaseSDKCtx {
	return getContext(ctxKey);
}
