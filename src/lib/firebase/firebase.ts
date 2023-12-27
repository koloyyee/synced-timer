import {
	PUBLIC_FIREBASE_API_KEY,
	PUBLIC_FIREBASE_APP_ID,
	PUBLIC_FIREBASE_AUTH_DOMAIN,
	PUBLIC_FIREBASE_MEASUREMENT_ID,
	PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	PUBLIC_FIREBASE_PROJECT_ID,
	PUBLIC_FIREBASE_STORAGE_BUCKET
} from '$env/static/public';
import { deleteApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

// import admin from "firebase-admin"

// import * as serviceAccount from "./firebase-admin.json";

// admin.initializeApp({
// 	credential: admin.credential.cert(serviceAccount),
// 	databaseURL: "https://firebasic-8e41a-default-rtdb.firebaseio.com"
// });

// export const auth = admin.auth

const firebaseConfig = {
	apiKey: PUBLIC_FIREBASE_API_KEY,
	authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: PUBLIC_FIREBASE_APP_ID,
	measurementId: PUBLIC_FIREBASE_MEASUREMENT_ID
};

let firebaseApp: FirebaseApp;
if (!getApps().length) {
	firebaseApp = initializeApp(firebaseConfig);
} else {
	firebaseApp = getApps()[0];
	deleteApp(firebaseApp);
	firebaseApp = initializeApp(firebaseConfig);
}

const firebaseAuth = getAuth(firebaseApp);
const firebaseDB = getDatabase(firebaseApp);
const fireStore = getFirestore(firebaseApp);
setPersistence(firebaseAuth, browserSessionPersistence);
export { firebaseApp, firebaseAuth, firebaseConfig, firebaseDB, fireStore };
