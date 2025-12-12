import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  
  private readonly TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000; // 5 minutes

  /**
   * Sign in with Google, including Google Drive scopes
   * Enforces domain restriction and email whitelist
   */
  async signInWithGoogle(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      
      // Add Google Drive scopes
      provider.addScope('https://www.googleapis.com/auth/drive.file');
      provider.addScope('https://www.googleapis.com/auth/drive.appdata');
      
      // IMPORTANT: Do NOT set custom parameters with 'hd' for testing
      // This allows personal Gmail accounts (like butterdime@gmail.com) to sign in
      // Domain restriction is handled by validation check after successful auth

      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;

      if (!user || !user.email) {
        throw new Error('No user email found');
      }

      // Validate email domain or whitelist
      if (!this.isAuthorizedUser(user.email)) {
        // Sign out the user if they don't meet requirements
        await this.auth.signOut();
        throw new Error('Access denied. Only @rprcomms.com accounts or whitelisted emails are allowed.');
      }

      // Get and store access token
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        this.storeToken(credential.accessToken, credential.idToken);
      }

      // Get Firebase ID token
      const idToken = await user.getIdToken();
      sessionStorage.setItem('firebaseIdToken', idToken);
      sessionStorage.setItem('userEmail', user.email);
      sessionStorage.setItem('userId', user.uid);

      // Navigate to dashboard
      await this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      
      // Handle specific error cases
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup was blocked. Please allow popups and try again.');
      } else if (error.message?.includes('Access denied')) {
        throw error;
      } else {
        throw new Error('Failed to sign in. Please try again.');
      }
    }
  }

  /**
   * Store access token with expiration tracking
   */
  private storeToken(accessToken: string, idToken: string | undefined): void {
    const tokenData = {
      accessToken,
      idToken: idToken || '',
      expiresAt: Date.now() + (3600 * 1000) // Assume 1 hour expiration
    };
    
    sessionStorage.setItem('googleAccessToken', JSON.stringify(tokenData));
  }

  /**
   * Get stored access token, refreshing if needed
   */
  async getAccessToken(): Promise<string | null> {
    const tokenDataStr = sessionStorage.getItem('googleAccessToken');
    if (!tokenDataStr) {
      return null;
    }

    try {
      const tokenData = JSON.parse(tokenDataStr);
      const now = Date.now();
      
      // Check if token needs refresh (within buffer time)
      if (tokenData.expiresAt - now < this.TOKEN_REFRESH_BUFFER_MS) {
        // Token is about to expire, try to refresh
        const user = this.auth.currentUser;
        if (user) {
          const credential = await user.getIdTokenResult();
          // Note: Firebase doesn't provide direct access to Google OAuth tokens
          // This would need to be handled via the Google API client
          return tokenData.accessToken;
        }
      }

      return tokenData.accessToken;
    } catch (error) {
      console.error('Error parsing token data:', error);
      return null;
    }
  }

  /**
   * Check if user email is authorized
   * Allows @rprcomms.com domain or whitelisted emails
   */
  private isAuthorizedUser(email: string | null): boolean {
    if (!email) return false;

    const normalizedEmail = email.toLowerCase();

    // 1) Allow any company address at rprcomms.com
    const authorizedDomains = ['rprcomms.com'];
    const emailDomain = normalizedEmail.split('@')[1];
    if (authorizedDomains.includes(emailDomain)) {
      return true;
    }

    // 2) Explicit whitelisted emails (owner + test account)
    const whitelist = [
      'hello@butterdime.com',   // work email
      'butterdime@gmail.com'    // personal test email
    ];

    return whitelist.includes(normalizedEmail);
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    try {
      await this.auth.signOut();
      sessionStorage.removeItem('googleAccessToken');
      sessionStorage.removeItem('firebaseIdToken');
      sessionStorage.removeItem('userEmail');
      sessionStorage.removeItem('userId');
      await this.router.navigate(['/login']);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }
}

