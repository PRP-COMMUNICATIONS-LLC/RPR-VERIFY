// Local augmentation to ensure TypeScript can resolve the '@angular/common/http' subpath
// in environments where module resolution is strict (NodeNext / ESM).
//
// We provide a lightweight ambient declaration that re-exports the
// canonical types and also declares the commonly-used symbols as values
// so the Angular compiler + TypeScript can resolve them during the build.
declare module '@angular/common/http' {
  export * from '@angular/common/types/http';

  // Minimal runtime/value declarations to satisfy compiler checks in this repo.
  export function provideHttpClient(...features: any[]): any;

  export class HttpClient {
    get<T = any>(url: string, options?: any): import('rxjs').Observable<T>;
    post<T = any>(url: string, body: any | null, options?: any): import('rxjs').Observable<T>;
    // Add other methods as needed.
  }

  export class HttpHeaders {
    constructor(headers?: Record<string, string | string[]> | HttpHeaders);
    set(name: string, value: string | string[]): HttpHeaders;
    get(name: string): string | null;
  }

  export class HttpParams {}

  // Interceptor types
  export interface HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): import('rxjs').Observable<HttpEvent<any>>;
  }

  export class HttpRequest<T> {
    constructor(method: string, url: string, body?: T | null, init?: any);
    clone(update?: any): HttpRequest<T>;
    url: string;
  }

  export interface HttpHandler {
    handle(req: HttpRequest<any>): import('rxjs').Observable<HttpEvent<any>>;
  }

  export type HttpEvent<T> = any;

  export const HTTP_INTERCEPTORS: any;
}
