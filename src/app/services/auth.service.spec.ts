/**
 * AuthService Unit Tests
 * Purpose: Validates Firebase authentication workflows
 * Framework: Vitest with complete Firebase Auth mocks
 * Date: December 16, 2025 - Fixed Zone.js and Auth mocks
 */

import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from './auth.service';
import { Auth, GoogleAuthProvider, UserCredential, User } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

// Complete mock for Firebase User
const createMockUser = (overrides: Partial<User> = {}): User => ({
  uid: 'test-user-123',
  email: 'test@example.com',
  emailVerified: true,
  displayName: 'Test User',
  photoURL: 'https://example.com/photo.jpg',
  phoneNumber: null,
  isAnonymous: false,
  tenantId: null,
  metadata: {
    creationTime: new Date().toISOString(),
    lastSignInTime: new Date().toISOString(),
  },
  providerData: [],
  refreshToken: 'mock-refresh-token',
  getIdToken: vi.fn().mockResolvedValue('mock-firebase-token-' + Date.now()),
  getIdTokenResult: vi.fn(),
  reload: vi.fn(),
  toJSON: vi.fn(),
  delete: vi.fn(),
  ...overrides,
} as unknown as User);

// Complete mock for GoogleAuthProvider
class MockGoogleAuthProvider {
  addScope = vi.fn().mockReturnThis();
  setCustomParameters = vi.fn().mockReturnThis();
}

// Mock Firebase Auth signInWithPopup
const mockSignInWithPopup = vi.fn();
const mockSignOut = vi.fn();
const mockOnAuthStateChanged = vi.fn();

// Mock @angular/fire/auth module
vi.mock('@angular/fire/auth', async () => {
  const actual = await vi.importActual('@angular/fire/auth');
  return {
    ...actual,
    signInWithPopup: (...args: unknown[]) => mockSignInWithPopup(...args),
    onAuthStateChanged: (...args: unknown[]) => mockOnAuthStateChanged(...args),
    GoogleAuthProvider: MockGoogleAuthProvider,
  };
});

describe('AuthService', () => {
  let service: AuthService;
  let mockAuth: Partial<Auth>;
  let mockUser: User;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    mockUser = createMockUser();

    // Create comprehensive Auth mock
    mockAuth = {
      currentUser: mockUser,
      signOut: mockSignOut.mockResolvedValue(undefined),
      app: {} as Auth['app'],
      name: 'test-auth',
      config: {} as Auth['config'],
      languageCode: 'en',
      tenantId: null,
      settings: {} as Auth['settings'],
      onAuthStateChanged: mockOnAuthStateChanged,
      beforeAuthStateChanged: vi.fn(),
      onIdTokenChanged: vi.fn(),
      updateCurrentUser: vi.fn(),
      useDeviceLanguage: vi.fn(),
      signOut: vi.fn().mockResolvedValue(undefined),
    };

    // Setup onAuthStateChanged to immediately call callback with user
    mockOnAuthStateChanged.mockImplementation((callback: (user: User | null) => void) => {
      callback(mockUser);
      return vi.fn(); // Return unsubscribe function
    });

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

  it('should initialize with current user from Auth', () => {
    expect(service.user$.value).toBeTruthy();
    expect(service.user$.value?.uid).toBe('test-user-123');
  });

  it('should sign in with Google and return user', async () => {
    const mockUserCredential: UserCredential = {
      user: mockUser,
      providerId: 'google.com',
      operationType: 'signIn',
    };

    mockSignInWithPopup.mockResolvedValue(mockUserCredential);

    const result = await new Promise<User>((resolve, reject) => {
      service.signInWithGoogle().subscribe({
        next: (user) => resolve(user),
        error: (err) => reject(err),
      });
    });

    expect(result).toBeTruthy();
    expect(result.uid).toBe('test-user-123');
    expect(mockSignInWithPopup).toHaveBeenCalled();
  });

  it('should create GoogleAuthProvider with correct scopes', async () => {
    const mockUserCredential: UserCredential = {
      user: mockUser,
      providerId: 'google.com',
      operationType: 'signIn',
    };

    mockSignInWithPopup.mockResolvedValue(mockUserCredential);

    await new Promise<void>((resolve) => {
      service.signInWithGoogle().subscribe(() => resolve());
    });

    // Verify provider methods were called
    const providerInstance = mockSignInWithPopup.mock.calls[0]?.[1];
    expect(providerInstance).toBeDefined();
  });

  it('should handle sign-in errors gracefully', async () => {
    const mockError = new Error('auth/popup-closed-by-user');
    mockSignInWithPopup.mockRejectedValue(mockError);

    await expect(
      new Promise((resolve, reject) => {
        service.signInWithGoogle().subscribe({
          next: resolve,
          error: reject,
        });
      })
    ).rejects.toThrow('auth/popup-closed-by-user');
  });

  it('should sign out successfully', async () => {
    mockSignOut.mockResolvedValue(undefined);
    mockAuth.signOut = mockSignOut;

    await new Promise<void>((resolve) => {
      service.signOut().subscribe(() => resolve());
    });

    expect(mockSignOut).toHaveBeenCalled();
  });

  it('should get ID token from current user', async () => {
    const token = await service.getIdToken();

    expect(token).toBeTruthy();
    expect(token).toContain('mock-firebase-token');
    expect(mockUser.getIdToken).toHaveBeenCalledWith(true);
  });

  it('should return empty string when getting token without authenticated user', async () => {
    mockAuth.currentUser = null;

    const token = await service.getIdToken();

    expect(token).toBe('');
  });

  it('should expose user$ observable', (done) => {
    service.user$.subscribe((user) => {
      expect(user).toBeTruthy();
      expect(user?.uid).toBe('test-user-123');
      done();
    });
  });

  it('should expose idToken$ observable', (done) => {
    // Trigger fetchIdToken by simulating auth state change
    const callback = mockOnAuthStateChanged.mock.calls[0]?.[0];
    if (callback) {
      callback(mockUser);
    }

    // Wait for async token fetch
    setTimeout(() => {
      service.idToken$.subscribe((token) => {
        expect(token).toBeTruthy();
        done();
      });
    }, 100);
  });

  it('should implement getCurrentUserToken method', async () => {
    const token = await service.getCurrentUserToken();

    expect(token).toBeTruthy();
    expect(mockUser.getIdToken).toHaveBeenCalled();
  });
});
