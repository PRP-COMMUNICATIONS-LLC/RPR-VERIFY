import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { DropzoneComponent } from './dropzone.component';

describe('DropzoneComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropzoneComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(), // Replaces deprecated HttpClientTestingModule
        provideFirebaseApp(() => initializeApp({ projectId: 'mock-id' })),
        provideFirestore(() => getFirestore()),
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(DropzoneComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
