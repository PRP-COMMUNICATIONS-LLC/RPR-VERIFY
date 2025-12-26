// Compatibility shim for @angular/common/http in this environment.

import {
  provideHttpClient,
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';

export { provideHttpClient, HttpClient, HttpHeaders };

// If additional HTTP exports are needed later, they can be re-exported here.
// export * from '../../node_modules/@angular/common/fesm2022/http.mjs';
