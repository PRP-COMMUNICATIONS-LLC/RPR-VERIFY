import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div style="background-color: #000000; color: #ffffff;">
        <router-outlet></router-outlet>
    </div>
  `
})
export class MainLayoutComponent {}
