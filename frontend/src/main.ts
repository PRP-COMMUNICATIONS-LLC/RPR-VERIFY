import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// #region agent log
fetch('http://127.0.0.1:7242/ingest/fe0d3756-a726-4a6b-8c22-11d9da50ff0c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.ts',message:'Application bootstrap - checking if styles are loaded',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
// #endregion

// Hard-clearing static fallback text "RPR Verify" before Angular mounts
const root = document.querySelector('app-root');
if (root) root.innerHTML = ''; 

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error('BOOTSTRAP_FAILURE:', err));
