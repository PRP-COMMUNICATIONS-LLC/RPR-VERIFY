import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getAuth, onAuthStateChanged, User, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: User | null = null;
  private auth = getAuth();

  constructor() {
    // Sync local state for synchronous checks
    onAuthStateChanged(this.auth, (u) => (this.user = u));
  }

  // Observable stream (for secure-upload.component.ts)
  get user$(): Observable<User | null> {
    return new Observable(observer => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        observer.next(user);
      });
      return () => unsubscribe();
    });
  }

  // Promise-based token fetch (for auth.interceptor.ts)
  async getIdToken(): Promise<string | null> {
    if (!this.user) return null;
    return this.user.getIdToken();
  }

  // Stub methods to satisfy other components
  isAuthenticated(): boolean {
    return !!this.user;
  }

  async loginWithGoogle(): Promise<void> {
    console.log('Stub: Login with Google called');
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
  }
}
