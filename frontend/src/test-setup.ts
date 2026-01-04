// ZONELESS ANGULAR 19: Zone.js removed - using signal-based change detection
// Angular 19 zoneless mode works without Zone.js for testing
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

// Initialize the Angular testing environment for Karma/Jasmine (zoneless)
TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Mocks for globals often required by Angular testing setup
if (typeof globalThis !== 'undefined') {
  (globalThis as { ngDevMode?: boolean }).ngDevMode = (typeof process === 'undefined' || process.env.NODE_ENV === 'development');
}