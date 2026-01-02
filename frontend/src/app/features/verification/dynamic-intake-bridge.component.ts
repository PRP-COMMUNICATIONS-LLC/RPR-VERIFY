import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import React from 'react';
import { createRoot } from 'react-dom/client';
import DynamicIntakeForm from '../../components/DynamicIntakeForm';

@Component({
  selector: 'app-dynamic-intake-bridge',
  template: '<div id="react-intake-root" class="min-h-screen bg-slate-900 p-4"></div>',
  standalone: true
})
export class DynamicIntakeBridgeComponent implements OnInit, OnDestroy {
  private root: any;
  constructor(private el: ElementRef) {}
  ngOnInit() {
    const container = document.getElementById('react-intake-root');
    if (container) {
      this.root = createRoot(container);
      this.root.render(React.createElement(DynamicIntakeForm));
    }
  }
  ngOnDestroy() { if (this.root) this.root.unmount(); }
}
