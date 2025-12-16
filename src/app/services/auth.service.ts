import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from '@angular/fire/auth';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth: Auth = inject(Auth);

  public user$ = new BehaviorSubject<User | null>(this.auth.currentUser);
  private idTokenSubject = new BehaviorSubject<string | null>(null);
  public idToken$ = this.idTokenSubject.asObservable();

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.user$.next(user);
      if (user) {
        this.fetchIdToken(user);
      } else {
        this.idTokenSubject.next(null);
      }
    });
  }

  signInWithGoogle(): Observable<User> {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');

    return from(signInWithPopup(this.auth, provider)).pipe(
      map(result => {
        if (!result.user) {
          throw new Error('Sign-in failed: No user object received.');
        }
        return result.user;
      })
    );
  }

  public async getIdToken(): Promise<string> {
    const user = this.auth.currentUser;
    if (!user) {
      console.warn('Attempted to get ID token without an authenticated user.');
      return '';
    }
    return await user.getIdToken(true);
  }

  private async fetchIdToken(user: User): Promise<void> {
    try {
      const token = await user.getIdToken(true);
      this.idTokenSubject.next(token);
      console.log('Firebase ID Token updated successfully.');
    } catch (error) {
      console.error('Failed to fetch ID token:', error);
      this.idTokenSubject.next(null);
    }
  }

  public getCurrentUserToken(): Promise<string> {
    const token = this.idTokenSubject.getValue();
    if (token) {
      return Promise.resolve(token);
    }
    return this.getIdToken();
  }

  signOut(): Observable<void> {
    return from(this.auth.signOut());
  }
}
