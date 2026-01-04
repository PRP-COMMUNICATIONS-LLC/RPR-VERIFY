import { Component } from '@angular/core';

@Component({
  selector: 'app-resolution-rationale',
  standalone: true,
  template: `
    <div style="padding: 1.5rem; background: #111111; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 0.5rem;">
      <h2 style="color: #FFFFFF; font-size: 1.125rem; font-weight: 700; margin-bottom: 1rem; font-style: italic;">Sovereign Decision Log</h2>
      <textarea 
        placeholder="Address Sentinel alerts TR-01 through TR-05 here..." 
        style="width: 100%; height: 10rem; background: #000000; border: 1px solid rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.7); padding: 1rem; font-size: 0.875rem; border-radius: 0.25rem; outline: none;"
        onfocus="this.style.borderColor='#FFFFFF'"
        onblur="this.style.borderColor='rgba(255, 255, 255, 0.1)'"
      ></textarea>
      <div style="display: flex; justify-content: flex-end; margin-top: 1rem;">
        <button style="padding: 0.5rem 1.5rem; background: #FFFFFF; color: #000000; font-size: 0.75rem; text-transform: uppercase; font-weight: 700; border-radius: 0.25rem; border: none; cursor: pointer; transition: background-color 0.2s;" 
                onmouseover="this.style.background='rgba(255, 255, 255, 0.9)'"
                onmouseout="this.style.background='#FFFFFF'">Seal & Finalize</button>
      </div>
    </div>
  `
})
export class ResolutionRationaleComponent {}
