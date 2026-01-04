import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
// Fix the import to match the class name defined in information.ts
import { InformationComponent } from './information';

describe('InformationComponent', () => {
  let component: InformationComponent;
  let fixture: ComponentFixture<InformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InformationComponent,
        HttpClientTestingModule
      ],
      providers: [
        provideFirebaseApp(() => initializeApp({
          projectId: 'test-project',
          appId: 'test-app-id',
          apiKey: 'test-api-key',
          authDomain: 'test.firebaseapp.com'
        })),
        provideFirestore(() => getFirestore())
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
