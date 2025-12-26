import { ComponentFixture, TestBed } from '@angular/core/testing';
// Fix the import to match the class name defined in information.ts
import { InformationComponent } from './information';

describe('InformationComponent', () => {
  let component: InformationComponent;
  let fixture: ComponentFixture<InformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformationComponent]
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
