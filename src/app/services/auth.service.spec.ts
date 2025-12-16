/**
 * AuthService Unit Tests
 * Purpose: Validates Firebase authentication workflows
 * Framework: Vitest with Firebase Auth mocks
 * Date: December 16, 2025
 */

import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from './auth.service';
import { Auth, signInWithPopup, signOut, GoogleAuthProvider } from '@angular/fire/auth';
import { MOCK_FIREBASE_USER } from '../../testing/createMockDocument';

// Mock Firebase Auth module
vi.mock('@angular/fire/auth', () => ({
  Auth: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let mockAuth: Partial<Auth>;

  beforeEach(() => {
    // Create mock Auth instance
    mockAuth = {
      currentUser: MOCK_FIREBASE_USER as unknown as Auth['currentUser'],
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Auth, useValue: mockAuth },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should sign in with Google', async () => {
    const mockSignInResult = {
      user: MOCK_FIREBASE_USER,
    };

    vi.mocked(signInWithPopup).mockResolvedValue(mockSignInResult as never);

    const result = await service.signInWithGoogle();

    expect(signInWithPopup).toHaveBeenCalled();
    expect(result).toBeTruthy();
  });

  it('should handle sign-in errors gracefully', async () => {
    const mockError = new Error('auth/popup-closed-by-user');
    vi.mocked(signInWithPopup).mockRejectedValue(mockError);

    await expect(service.signInWithGoogle()).rejects.toThrow('auth/popup-closed-by-user');
  });

  it('should sign out successfully', async () => {
    vi.mocked(signOut).mockResolvedValue(undefined);

    await service.signOut();

    expect(signOut).toHaveBeenCalledWith(mockAuth);
  });

  it('should return current user state', () => {
    const user = service.getCurrentUser();

    expect(user).toBeTruthy();
    expect(user?.uid).toBe(MOCK_FIREBASE_USER.uid);
  });
});
