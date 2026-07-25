import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (variant === 'card') {
      <div class="skeleton-card" [attr.aria-label]="'Carregando...'">
        @for (item of items; track item) {
          <div class="skeleton-card__item">
            <div class="skeleton-card__header">
              <div class="skel skel--title"></div>
              <div class="skel skel--chip"></div>
            </div>
            <div class="skel skel--body"></div>
            <div class="skel skel--body skel--body-short"></div>
            <div class="skeleton-card__footer">
              <div class="skel skel--meta"></div>
              <div class="skel skel--actions"></div>
            </div>
          </div>
        }
      </div>
    } @else {
      <div class="skeleton-rows" aria-label="Carregando...">
        @for (item of items; track item) {
          <div class="skeleton-row">
            <div class="skel skel--row-title"></div>
            <div class="skel skel--chip"></div>
            <div class="skel skel--meta"></div>
            <div class="skel skel--actions"></div>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .skel {
      background: linear-gradient(
        90deg,
        var(--color-border) 25%,
        var(--color-border-strong) 50%,
        var(--color-border) 75%
      );
      background-size: 400px 100%;
      animation: shimmer 1.4s infinite linear;
      border-radius: 6px;
    }

    /* Card variant */
    .skeleton-card {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }

    .skeleton-card__item {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .skeleton-card__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }

    .skeleton-card__footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .skel--title       { height: 18px; width: 60%; }
    .skel--chip        { height: 22px; width: 80px; border-radius: 9999px; }
    .skel--body        { height: 13px; width: 100%; }
    .skel--body-short  { width: 70%; }
    .skel--meta        { height: 12px; width: 100px; }
    .skel--actions     { height: 28px; width: 72px; border-radius: 6px; }

    /* Row variant */
    .skeleton-rows { display: flex; flex-direction: column; gap: 4px; }
    .skeleton-row {
      display: grid;
      grid-template-columns: 1fr 120px 160px 80px;
      gap: 16px;
      align-items: center;
      padding: 14px 16px;
      border-bottom: 1px solid var(--color-border);
    }

    .skel--row-title { height: 16px; }

    @keyframes shimmer {
      0%   { background-position: -400px 0; }
      100% { background-position: 400px 0; }
    }
  `],
})
export class AppSkeletonComponent {
  @Input() variant: 'card' | 'row' = 'card';
  @Input() count: number = 6;

  get items(): number[] {
    return Array.from({ length: this.count }, (_, i) => i);
  }
}
