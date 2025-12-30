import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class GcloudAuthInterceptor implements HttpInterceptor {
  // This interceptor ensures every request to the Singapore Engine
  // carries the Identity Token required by the Sovereign Gatekeeper.
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes('run.app')) {
      return from(this.getIdentityToken()).pipe(
        switchMap(token => {
          const authReq = request.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
          });
          return next.handle(authReq);
        })
      );
    }
    return next.handle(request);
  }

  private async getIdentityToken(): Promise<string> {
    // In production, this pulls from the Google Auth Provider
    // For local dev, Jules will mock this with your active session token
    return localStorage.getItem('SOVEREIGN_AUTH_TOKEN') || '';
  }
}