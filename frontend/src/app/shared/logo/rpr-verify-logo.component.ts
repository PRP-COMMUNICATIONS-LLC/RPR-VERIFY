import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rpr-verify-logo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rpr-verify-logo.component.html',
  styleUrls: ['./rpr-verify-logo.component.scss']
})
export class RprVerifyLogoComponent {
  @Input() showSubtitle: boolean = true;
  @Input() height: string = '32px';
}
