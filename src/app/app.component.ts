import { Component, inject, computed } from '@angular/core';
import { IdentityService } from './services/identity.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  activeTab: number = 1;
  private identityService = inject(IdentityService);
  // Computed property for reactive UI binding
  readonly isRedAlert = computed(() => this.identityService.isEscalated());

  setTab(id: number) {
    this.activeTab = id;
  }
}
