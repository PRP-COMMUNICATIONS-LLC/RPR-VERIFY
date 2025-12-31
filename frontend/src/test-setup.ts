import 'zone.js';
import 'zone.js/testing'; // Necessary for Angular testing

import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

// Initialize the Angular testing environment for Vitest/Jest
TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Mocks for globals often required by Angular testing setup
if (typeof globalThis !== 'undefined') {
  (globalThis as { ngDevMode?: boolean }).ngDevMode = (typeof process === 'undefined' || process.env.NODE_ENV === 'development');
}