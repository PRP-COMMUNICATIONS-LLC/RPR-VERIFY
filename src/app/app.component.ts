/* src/app/app.component.ts */
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  activeTab: number = 1;

  // Global Health State: Turns RED on Tab 4
  getSentinelColor(): string {
    return this.activeTab === 4 ? '#FF0000' : '#00E0FF';
  }

  setTab(id: number) {
    this.activeTab = id;
  }
}
