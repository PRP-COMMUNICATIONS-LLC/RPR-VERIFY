import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user, getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { of } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// 1. ROBUST MOCK FOR ANGULAR FIRE AUTH
vi.mock('@angular/fire/auth', () => {
  const mockUser = {
    uid: 'test-uid',
    email: 'test@rprcomms.com',
    emailVerified: true,
    getIdToken: vi.fn().mockResolvedValue('mock-token')
  };

  return {
    Auth: class {},
    GoogleAuthProvider: class {},
    getAuth: vi.fn(() => ({ currentUser: mockUser })), 
    signInWithPopup: vi.fn(),
    signOut: vi.fn(),
    // CRITICAL FIX: Handle (auth, callback) signature
    onAuthStateChanged: vi.fn((auth, callback) => {
      if (typeof callback === 'function') {
        callback(mockUser);
      }
      return vi.fn(); // return unsubscribe function
    }),
    user: vi.fn(() => of(mockUser)),
  };
});

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Auth, useValue: {} }
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle signOut', async () => {
    await service.signOut();
    expect(signOut).toHaveBeenCalled();
  });
  
  // Add other tests as needed
});
