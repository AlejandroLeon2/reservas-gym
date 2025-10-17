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
import { HttpClient } from '@angular/common/http';
import { initializeApp } from 'firebase/app';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

const firebaseApp = initializeApp(environment.firebase);
const auth = getAuth(firebaseApp);

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.url;

  constructor(private http: HttpClient) {}

  async getUserRoleFromBackend(): Promise<string | null> {
    const user = this.getCurrentUser();
    if (!user) return null;

    try {
      const response = await firstValueFrom(
        this.http.get<{ rol: string }>(`${this.apiUrl}/usuario/${user.uid}`)
      );

      return response.rol || null;
    } catch (error) {
      console.error('Error al obtener el rol desde el backend:', error);
      return null;
    }
  }

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
