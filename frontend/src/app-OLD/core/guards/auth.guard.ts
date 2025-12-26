import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export const authGuard: CanActivateFn = (route, state) => {
  // Temporary bypass for local development when disabled in environment
  if ((environment as any).disableAuth) {
    return true;
  }

  const auth = inject(Auth);
  const router = inject(Router);

  return authState(auth).pipe(
    take(1),
    map(user => {
      if (user) {
        // User is authenticated, allow access
        return true;
      } else {
        // User is not authenticated, redirect to login
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
