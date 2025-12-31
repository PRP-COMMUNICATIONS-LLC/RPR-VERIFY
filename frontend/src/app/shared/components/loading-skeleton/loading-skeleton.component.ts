import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  imports: [],
  template: `
    <div class="skeleton-container" [style.width]="width" [style.height]="height">
      <div class="skeleton" [class]="variant"></div>
    </div>
  `,
  styles: [`
    .skeleton-container {
      display: inline-block;
    }

    .skeleton {
      background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 4px;
    }

    .skeleton.text {
      height: 16px;
      width: 100%;
    }

    .skeleton.title {
      height: 24px;
      width: 100%;
    }

    .skeleton.avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .skeleton.card {
      height: 120px;
      width: 100%;
      border-radius: 8px;
    }

    .skeleton.button {
      height: 36px;
      width: 120px;
      border-radius: 6px;
    }

    @keyframes loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  `]
})
export class LoadingSkeletonComponent {
  @Input() variant: 'text' | 'title' | 'avatar' | 'card' | 'button' = 'text';
  @Input() width = '100%';
  @Input() height = 'auto';
}