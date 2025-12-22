import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="scanline"></div>

    <header class="sticky top-0 z-50 border-b border-white/5 bg-black/90 backdrop-blur-xl transition-colors duration-500"
            [ngClass]="{'border-b-red-900/30': currentMode() === 'resolution'}">
      
      <div class="max-w-[1600px] mx-auto px-4 md:px-6 py-4 flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-8">
        
        <div class="flex items-center gap-4">
          <svg class="w-10 h-10 md:w-12 md:h-12 shrink-0 transition-colors duration-500" 
               [style.fill]="currentMode() === 'resolution' ? 'var(--alert-red)' : 'var(--teal)'"
               viewBox="0 0 512 512">
             <path d="M366.26,256L256,56L145.74,256L35.48,456H256h220.52L366.26,256z M462.43,448.02H327.14 c-52.29-17.46-99.26-47.08-123.05-72.78c12.09,3.24,29.59,6.3,53.32,6.78c43.69,0.87,71.69-14.09,71.69-14.09s-0.04-0.49-0.13-1.36 l0.44,1.33c10.53-38.31,14.66-76.67,9.8-143.39l20.22,36.67L462.43,448.02z M255.21,246.4c0,0,17.34,12.57,41.66,53.19 c15.5,25.89,23.07,61.65,23.07,61.65s-27.12,11.27-63.76,11.1c-37.52-0.53-63.59-9.51-63.59-9.51s5.81-34.7,21.66-61.82 C230.29,270.35,255.21,246.4,255.21,246.4z M153.41,261.17L256.42,74.33l70.68,128.2c8.42,51.22,5.65,107.88-2.38,140.27 c-3.5-14.36-9.64-32.72-20.28-49.2c-28.27-43.79-47.74-58.99-47.74-58.99s-0.36,0.2-1.01,0.63 c-42.74,11.66-77.73,28.09-123.62,64.64L153.41,261.17z M50.4,448.02l69.84-126.68c39.4-37.4,94.72-65.51,118.02-70.6 c-9.71,10.52-22.24,27.08-35.09,52.2c-18.12,35.42-20.61,64.11-20.61,64.11s0.59,0.37,1.78,0.99l-1.55-0.36 c29.53,30.52,56.36,49.88,116.46,80.35h-42.83H50.4z"/>
          </svg>
          
          <div class="sovereign-heading text-2xl md:text-3xl tracking-tighter">
            <span class="text-white">RPR</span> 
            <span class="transition-colors duration-500" 
                  [style.color]="currentMode() === 'resolution' ? 'var(--alert-red)' : 'var(--teal)'">
              VERIFY
            </span>
          </div>
        </div>

        <nav class="flex items-center gap-2 w-full lg:w-auto overflow-x-auto no-scrollbar pb-1 lg:pb-0">
          <a routerLink="/dashboard" 
             routerLinkActive="active-tab"
             class="px-3 md:px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b-2 border-transparent hover:text-white whitespace-nowrap cursor-pointer transition-all">
             Foundations
          </a>
          
          <button (click)="toggleMode()" 
                  class="ml-auto lg:ml-4 px-3 py-1 border border-white/10 text-[9px] uppercase font-bold hover:bg-white/5 whitespace-nowrap transition-colors"
                  [ngClass]="currentMode() === 'resolution' ? 'text-red-500 border-red-900' : 'text-teal border-teal/30'">
             Mode: {{ currentMode() === 'verification' ? '3P (Safe)' : '3D (Risk)' }}
          </button>
        </nav>

      </div>
    </header>

    <main class="max-w-[1600px] mx-auto px-4 md:px-6 py-8 md:py-12">
      <router-outlet></router-outlet>
    </main>

    <footer class="border-t border-white/5 bg-black/80 backdrop-blur-md mt-auto">
        <div class="max-w-[1600px] mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">© 2025 RPR COMMUNICATIONS LLC</span>
            <div class="flex items-center gap-2">
                <div class="w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                     [ngClass]="currentMode() === 'resolution' ? 'bg-red-500 shadow-red-500/50' : 'bg-green-500 shadow-green-500/50'"></div>
                <span class="text-[9px] font-black text-white uppercase tracking-widest">SENTINEL_ACTIVE_AUTH</span>
            </div>
        </div>
    </footer>
  `,
  styles: [`
    .active-tab { color: var(--white); border-bottom-color: var(--white); }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
  `]
})
export class MainLayoutComponent {
  currentMode = signal<'verification' | 'resolution'>('verification');

  toggleMode() {
    this.currentMode.update(m => m === 'verification' ? 'resolution' : 'verification');
    
    // Inject global variable for child components
    if (this.currentMode() === 'resolution') {
      document.documentElement.style.setProperty('--teal', '#FF0000');
    } else {
      document.documentElement.style.setProperty('--teal', '#008080');
    }
  }
}
