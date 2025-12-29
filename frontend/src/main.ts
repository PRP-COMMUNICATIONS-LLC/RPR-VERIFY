import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Hard-clearing static fallback text "RPR Verify" before Angular mounts
const root = document.querySelector('app-root');
if (root) root.innerHTML = ''; 

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error('BOOTSTRAP_FAILURE:', err));
