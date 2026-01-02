import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, user } from '@angular/fire/auth';
import { map, take } from 'rxjs';

/**
 * RPR-VERIFY Security Gate
 * Enforces authenticated access to the Forensic Ingestion Hub.
 * Hardened version: Removed unused 'route' and 'state' params to satisfy CI linter.
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return user(auth).pipe(
    take(1),
    map(u => {
      if (u) return true;
      // Unauthorized access intercepted - redirecting to Product Hub Login
      router.navigate(['/login']);
      return false;
    })
  );
};
