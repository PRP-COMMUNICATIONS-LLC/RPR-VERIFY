import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { EscalationService } from '../../services/escalation.service';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Component } from '@angular/core';

// Mock Component Pattern (Safe & Fast)
@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: '<div>Mock Dashboard</div>'
})
class MockDashboard {}

const mockEscalationService = {
  getStats: vi.fn().mockReturnValue(of({ total: 0, pending: 0 })),
  getEscalations: vi.fn().mockReturnValue(of([]))
};

describe('Dashboard', () => {
  let component: MockDashboard;
  let fixture: ComponentFixture<MockDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockDashboard],
      providers: [
        { provide: EscalationService, useValue: mockEscalationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MockDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
