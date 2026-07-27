import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(24px)' }),
        animate('350ms ease', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
  template: `
    <div class="empty-state" @fadeInUp role="status" [attr.aria-label]="message">
      <div class="empty-state__illustration">
        <mat-icon aria-hidden="true">{{ icon }}</mat-icon>
      </div>
      <h3 class="empty-state__title">{{ title }}</h3>
      <p class="empty-state__message">{{ message }}</p>
      @if (ctaLabel) {
        @if (ctaRoute) {
          <a
            mat-flat-button
            class="empty-state__cta"
            [routerLink]="ctaRoute"
            [attr.aria-label]="ctaLabel">
            <mat-icon>add</mat-icon>
            {{ ctaLabel }}
          </a>
        } @else {
          <button
            mat-flat-button
            class="empty-state__cta"
            (click)="ctaClick.emit()"
            [attr.aria-label]="ctaLabel">
            <mat-icon>add</mat-icon>
            {{ ctaLabel }}
          </button>
        }
      }
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 32px;
      text-align: center;
      gap: 12px;
    }

    .empty-state__illustration {
      width: 80px; height: 80px;
      border-radius: 50%;
      background: var(--color-primary-light);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 8px;
    }

    .empty-state__illustration mat-icon {
      font-size: 40px;
      width: 40px; height: 40px;
      color: var(--color-primary);
      opacity: 0.7;
    }

    .empty-state__title {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--color-text-primary);
    }

    .empty-state__message {
      font-size: 0.9rem;
      color: var(--color-text-secondary);
      max-width: 360px;
    }

    .empty-state__cta {
      margin-top: 8px;
      background: var(--color-primary) !important;
      color: #fff !important;
      border-radius: 8px !important;
    }
  `],
})
export class AppEmptyStateComponent {
  @Input() icon: string = 'inbox';
  @Input() title: string = 'Nada por aqui';
  @Input() message: string = 'Nenhum item encontrado.';
  @Input() ctaLabel?: string;
  @Input() ctaRoute?: string;
  @Output() ctaClick = new EventEmitter<void>();
}
