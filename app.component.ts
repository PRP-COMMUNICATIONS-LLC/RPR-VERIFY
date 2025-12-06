// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    HeaderComponent
  ],
  template: `
    <div class="flex h-screen bg-charcoal text-gray-100 font-inter">
      <!-- Main Application Header -->
      <app-header></app-header>

      <!-- Main Content Area: Sidebar + Router Outlet -->
      <div class="flex flex-1 pt-16">
        <!-- Sidebar -->
        <app-sidebar></app-sidebar>

        <!-- Main Content (Router Outlet) -->
        <main class="flex-1 overflow-y-auto p-6 lg:p-8 bg-charcoal">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'RPR-VERIFY-V1';
}
