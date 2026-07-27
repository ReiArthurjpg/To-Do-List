import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoadingService } from '../../core/services/loading.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatButtonModule,
    MatIconModule,
  ],
  animations: [
    trigger('pageAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(12px)' }),
        animate('280ms ease', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
  template: `
    <!-- Loading bar -->
    @if (loading.isLoading()) {
      <div class="loading-bar" aria-hidden="true">
        <div class="loading-bar__fill"></div>
      </div>
    }

    <!-- Header -->
    <header class="app-header" role="banner">
      <div class="app-header__inner">

        <!-- Brand name only -->
        <a routerLink="/" class="app-header__brand" aria-label="TaskFlow — Ir para página inicial">
          <span class="app-header__name">Task<span class="app-header__name--accent">Flow</span></span>
        </a>

        <!-- Spacer -->
        <div class="app-header__spacer"></div>

        <!-- Actions -->
        <div class="app-header__actions">
          <a
            mat-flat-button
            routerLink="/tasks/new"
            class="btn-new-task"
            aria-label="Criar nova tarefa">
            <mat-icon>add</mat-icon>
            <span class="btn-new-task__label">Nova tarefa</span>
          </a>
        </div>

      </div>
    </header>

    <!-- Page content -->
    <main class="app-main" id="main-content" tabindex="-1" @pageAnim>
      <router-outlet />
    </main>
  `,
  styles: [`
    /* ---- Loading Bar ---- */
    .loading-bar {
      position: fixed;
      top: 0; left: 0; right: 0;
      height: 3px;
      z-index: 999;
      overflow: hidden;
      background: transparent;

      &__fill {
        height: 100%;
        width: 100%;
        background: linear-gradient(90deg, #6366f1, #a78bfa, #38bdf8, #6366f1);
        background-size: 300% 100%;
        animation: loadingSlide 1.4s ease-in-out infinite;
      }
    }

    @keyframes loadingSlide {
      0%   { background-position: 100% 0; }
      100% { background-position: -100% 0; }
    }

    /* ---- Header ---- */
    .app-header {
      position: sticky;
      top: 0;
      z-index: 200;
      height: 72px;
      background: rgba(255, 255, 255, 0.9);
      border-bottom: 1px solid rgba(99, 102, 241, 0.10);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      box-shadow: 0 1px 0 rgba(99,102,241,0.08), 0 4px 20px rgba(99,102,241,0.04);
    }

    [data-theme='dark'] .app-header {
      background: rgba(15, 23, 42, 0.9);
      border-bottom-color: rgba(99, 102, 241, 0.15);
      box-shadow: 0 1px 0 rgba(99,102,241,0.12), 0 4px 20px rgba(0,0,0,0.3);
    }

    .app-header__inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 28px;
      height: 100%;
      display: flex;
      align-items: center;
    }

    /* ---- Brand ---- */
    .app-header__brand {
      display: flex;
      align-items: center;
      text-decoration: none;
      flex-shrink: 0;
    }

    .app-header__name {
      font-size: 1.375rem;
      font-weight: 800;
      letter-spacing: -0.04em;
      color: var(--color-text-primary);
    }

    .app-header__name--accent {
      color: var(--color-primary);
    }

    /* ---- Spacer ---- */
    .app-header__spacer {
      flex: 1;
    }

    /* ---- Actions ---- */
    .app-header__actions {
      display: flex;
      align-items: center;
    }

    /* ---- CTA Button ---- */
    .btn-new-task {
      background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%) !important;
      color: #fff !important;
      border-radius: 9999px !important;
      padding: 0 20px !important;
      height: 38px !important;
      font-size: 0.875rem !important;
      font-weight: 600 !important;
      letter-spacing: -0.01em !important;
      gap: 6px;
      box-shadow: 0 2px 10px rgba(99, 102, 241, 0.35) !important;
      transition: transform 180ms cubic-bezier(0.34,1.56,0.64,1),
                  box-shadow 180ms ease,
                  filter 180ms ease !important;
    }

    .btn-new-task mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .btn-new-task:hover {
      filter: brightness(1.08) !important;
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5) !important;
      transform: translateY(-1px) scale(1.02);
    }

    .btn-new-task:active {
      transform: translateY(0) scale(0.98) !important;
    }

    @media (max-width: 480px) {
      .btn-new-task__label { display: none; }
      .btn-new-task { padding: 0 14px !important; }
    }

    /* ---- Main ---- */
    .app-main {
      min-height: calc(100vh - 72px);
    }

    .app-main:focus { outline: none; }

    @media (max-width: 768px) {
      .app-header__inner { padding: 0 16px; }
    }
  `],
})
export class MainLayoutComponent {
  readonly loading = inject(LoadingService);
}
