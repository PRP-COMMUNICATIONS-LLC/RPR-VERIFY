import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  user$: Observable<User | null> = user(this.auth);

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(this.auth, provider);
      this.router.navigate(['/verification']);
    } catch (error) {
      console.error('Authentication breach detected:', error);
    }
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

  async getIdToken(): Promise<string | null> {
    const currentUser = this.auth.currentUser;
    return currentUser ? await currentUser.getIdToken() : null;
  }
}
