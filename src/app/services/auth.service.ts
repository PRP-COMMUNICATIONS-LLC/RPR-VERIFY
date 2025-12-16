import { Injectable, inject } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, User, onAuthStateChanged } from '@angular/fire/auth';
import { from, Observable, BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment'; // Import environment config

@Injectable({
  providedIn: 'root'
})
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

  /**
   * Triggers the Google Sign-In popup flow, aggressively forcing the correct Client ID.
   * This is the fix for the persistent 'deleted_client' error, overriding any stale
   * configuration being pulled from the Firebase Project settings.
   * @returns Observable resolving when sign-in is complete.
   */
  signInWithGoogle(): Observable<User> {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');

    // --- CRITICAL FIX: Explicitly forcing the NEW, correct OAuth Client ID ---
    // This custom parameter is used to explicitly specify the client ID, bypassing
    // any cached or incorrectly configured value in the Firebase SDK settings.
    // NOTE: The environment file is assumed to be the source of truth for the NEW ID.
    // The NEW working ID is: 794095666194-j1jl81fks7pl6a5v2mv557cs16hpsmkg.apps.googleusercontent.com
    
    // We assume the NEW ID is correctly loaded into the environment file under a key
    // like 'oauthClientId' or 'clientId' within the firebaseConfig block.
    // For this fix, we hardcode the NEW ID here for maximum impact.
    // In a clean repository, this would be: environment.firebase.clientId
    
    const NEW_CLIENT_ID = '794095666194-j1jl81fks7pl6a5v2mv557cs16hpsmkg.apps.googleusercontent.com';

    provider.setCustomParameters({
        client_id: NEW_CLIENT_ID,
    });
    
    return from(signInWithPopup(this.auth, provider)).pipe(
      map(result => {
        if (!result.user) {
            throw new Error("Sign-in failed: No user object received.");
        }
        return result.user;
      })
    );
  }

  /**
   * Fetches the latest Firebase ID token for use in API authorization headers.
   */
  public async getIdToken(): Promise<string> {
    const user = this.auth.currentUser;
    if (!user) {
      console.warn("Attempted to get ID token without an authenticated user.");
      return "";
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

  /**
   * Used by other services (like EscalationService) to get the token immediately.
   */
  public getCurrentUserToken(): Promise<string> {
    // This implementation forces a refresh to ensure token is valid.
    return this.getIdToken();
  }

  signOut(): Observable<void> {
    return from(this.auth.signOut());
  }
}