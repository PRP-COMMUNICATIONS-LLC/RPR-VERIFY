// src/app/components/sidebar/sidebar.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  template: `
    <aside class="w-64 bg-slate-800 shadow-md flex flex-col pt-4 pb-6 overflow-y-auto border-r border-slate-700">
      <nav class="flex-1 space-y-2 px-4">
        @for (item of navigationItems(); track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-slate-700 border-l-4 border-cyan-brand text-cyan-brand font-semibold"
            [routerLinkActiveOptions]="{ exact: true }"
            class="flex items-center p-3 rounded-md text-gray-300 hover:bg-slate-700 hover:text-cyan-brand transition-colors duration-200 group"
          >
            <span class="text-xl mr-3 group-hover:scale-110 transition-transform">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>

      <!-- Help/Logout section -->
      <div class="px-4 mt-8 pt-4 border-t border-slate-700 space-y-2">
        <a
          routerLink="/help"
          routerLinkActive="bg-slate-700 border-l-4 border-cyan-brand text-cyan-brand font-semibold"
          class="flex items-center p-3 rounded-md text-gray-300 hover:bg-slate-700 hover:text-cyan-brand transition-colors duration-200"
        >
          <span class="text-xl mr-3">❓</span>
          <span>Help</span>
        </a>

        <button
          class="w-full flex items-center p-3 rounded-md text-gray-300 hover:bg-slate-700 hover:text-cyan-brand transition-colors duration-200"
        >
          <span class="text-xl mr-3">⏻</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  `,
  styles: []
})
export class SidebarComponent {
  navigationItems = signal<NavItem[]>([
    { label: 'Dashboard', icon: '📊', route: '/dashboard' },
    { label: 'Cases', icon: '📁', route: '/cases' },
    { label: 'Disputes', icon: '⚖️', route: '/disputes' },
    { label: 'Reports', icon: '📈', route: '/reports' },
    { label: 'Settings', icon: '⚙️', route: '/settings' },
  ]);
}
