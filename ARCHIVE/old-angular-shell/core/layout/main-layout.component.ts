// CORRECTED: main-layout.component.ts
// Location: src/app/core/layout/main-layout.component.ts
// CRITICAL FIX: Route check updated from /disputes to /resolution

import { Component, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  constructor(private router: Router) {}

  // FIXED: Check for /resolution route (not /disputes)
  isResolutionActive = computed(() => {
    return this.router.url.includes('/resolution');
  });
}
