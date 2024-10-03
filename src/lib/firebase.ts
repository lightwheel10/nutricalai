import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

import { firebaseConfig } from './config';

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

try {
  if (typeof window !== 'undefined' && !getApps().length) {
    console.log('Attempting to initialize Firebase with config:', JSON.stringify(firebaseConfig, null, 2));
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('Firebase initialized successfully');
  } else {
    console.log('Firebase already initialized or running on server-side');
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
  if (error instanceof Error) {
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
  }
}

export { app, auth, db };