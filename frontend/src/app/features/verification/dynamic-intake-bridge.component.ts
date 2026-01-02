import { Component, ElementRef, OnInit, OnDestroy, inject } from '@angular/core';
import { createRoot, Root } from 'react-dom/client';
import React from 'react';
import DynamicIntakeForm from '../../components/DynamicIntakeForm';

@Component({
  selector: 'app-dynamic-intake-bridge',
  standalone: true,
  template: '<div id="react-root"></div>'
})
export class DynamicIntakeBridgeComponent implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private reactRoot: Root | null = null;

  ngOnInit(): void {
    const container = this.el.nativeElement.querySelector('#react-root');
    if (container) {
      this.reactRoot = createRoot(container);
      this.reactRoot.render(React.createElement(DynamicIntakeForm));
    }
  }

  ngOnDestroy(): void {
    this.reactRoot?.unmount();
  }
}
