import { Injectable } from '@angular/core';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  UserCredential,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { environment } from '../../../environments/environment';

const firebaseApp = initializeApp(environment.firebase);
const auth = getAuth(firebaseApp);

@Injectable({ providedIn: 'root' })
export class AuthService {
  register(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
  }

  loginWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  logout(): Promise<void> {
    return signOut(auth);
  }

  getCurrentUser(): User | null {
    return auth.currentUser;
  }
  
  onUserChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }
}
