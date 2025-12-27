import { Component, inject } from '@angular/core';
import { IdentityService } from '../../services/identity.service';

@Component({
  selector: 'app-resolution',
  template: `
    <div class="resolution-grid p-6">
      <h2 class="text-red-600 font-bold mb-4">FORENSIC RESOLUTION TERMINAL</h2>
      <button
        (click)="identityService.triggerAlert()"
        class="bg-red-900 border border-red-500 p-4 text-white hover:bg-red-600 transition">
        INITIATE RED-ALERT ESCALATION
      </button>
    </div>
  `
})
export class ResolutionComponent {
  public identityService = inject(IdentityService);
}
