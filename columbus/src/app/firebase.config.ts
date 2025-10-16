// src/app/firebase.config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'TU_API_KEY',
  authDomain: 'TU_PROJECT_ID.firebaseapp.com',
  projectId: 'TU_PROJECT_ID',
  storageBucket: 'TU_PROJECT_ID.appspot.com',
  messagingSenderId: '...',
  appId: '...'
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
