import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecureUpload } from './secure-upload';

describe('SecureUpload', () => {
  let component: SecureUpload;
  let fixture: ComponentFixture<SecureUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecureUpload]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecureUpload);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
