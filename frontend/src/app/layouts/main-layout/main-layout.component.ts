import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../core/services/theme.service';
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
    MatTooltipModule,
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
        <!-- Logo + Brand -->
        <a routerLink="/" class="app-header__brand" aria-label="TaskFlow — Ir para página inicial">
          <div class="app-header__logo" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="6" fill="currentColor" opacity="0.15"/>
              <path d="M7 12.5l3.5 3.5 6.5-7" stroke="currentColor" stroke-width="2.2"
                stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="app-header__name">TaskFlow</span>
        </a>

        <!-- Nav -->
        <nav class="app-header__nav" aria-label="Navegação principal">
          <a routerLink="/" class="app-header__nav-link" aria-label="Minhas tarefas">
            <mat-icon aria-hidden="true">check_box</mat-icon>
            <span>Tarefas</span>
          </a>
        </nav>

        <!-- Actions -->
        <div class="app-header__actions">
          <button
            mat-icon-button
            class="theme-toggle"
            (click)="theme.toggle()"
            [matTooltip]="theme.isDark() ? 'Mudar para tema claro' : 'Mudar para tema escuro'"
            [attr.aria-label]="theme.isDark() ? 'Ativar tema claro' : 'Ativar tema escuro'">
            <mat-icon>{{ theme.isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
          </button>

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
    // ---- Loading Bar ----
    .loading-bar {
      position: fixed;
      top: 0; left: 0; right: 0;
      height: 2px;
      z-index: 999;
      overflow: hidden;
      background: transparent;

      &__fill {
        height: 100%;
        width: 100%;
        background: linear-gradient(90deg, #6366f1, #818cf8, #6366f1);
        background-size: 200% 100%;
        animation: loadingSlide 1.2s ease-in-out infinite;
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
      height: 64px;
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }

    .app-header__inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      height: 100%;
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .app-header__brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: var(--color-text-primary);
      flex-shrink: 0;
    }

    .app-header__brand:hover .app-header__name {
      color: var(--color-primary);
    }

    .app-header__logo {
      width: 36px; height: 36px;
      border-radius: 10px;
      background: var(--color-primary);
      color: #fff;
      display: flex; align-items: center; justify-content: center;
      transition: transform 200ms ease, box-shadow 200ms ease;
    }

    .app-header__logo:hover { transform: scale(1.06); }
    .app-header__logo svg { color: white; }

    .app-header__name {
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      transition: color 150ms ease;
    }

    .app-header__nav {
      display: flex;
      align-items: center;
      gap: 4px;
      flex: 1;
    }

    .app-header__nav-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-secondary);
      text-decoration: none;
      transition: all 150ms ease;
    }

    .app-header__nav-link mat-icon { font-size: 18px; width: 18px; height: 18px; }

    .app-header__nav-link:hover,
    .app-header__nav-link.active,
    .app-header__nav-link[aria-current] {
      background: var(--color-primary-light);
      color: var(--color-primary);
    }

    .app-header__actions {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: auto;
    }

    .theme-toggle {
      color: var(--color-text-secondary) !important;
    }

    .theme-toggle:hover { color: var(--color-primary) !important; }

    .btn-new-task {
      background: var(--color-primary) !important;
      color: #fff !important;
      border-radius: 8px !important;
      padding: 0 16px !important;
      height: 36px !important;
      font-size: 0.875rem !important;
      font-weight: 500 !important;
      gap: 4px;
      transition: background 150ms ease, box-shadow 150ms ease !important;
    }

    .btn-new-task mat-icon { font-size: 18px; width: 18px; height: 18px; }

    .btn-new-task:hover {
      background: var(--color-primary-hover) !important;
      box-shadow: 0 4px 12px rgba(99,102,241,.4) !important;
    }

    @media (max-width: 480px) {
      .btn-new-task__label { display: none; }
    }

    /* ---- Main ---- */
    .app-main {
      min-height: calc(100vh - 64px);
    }

    .app-main:focus { outline: none; }

    @media (max-width: 768px) {
      .app-header__inner { padding: 0 16px; gap: 12px; }
      .app-header__name   { display: none; }
      .app-header__nav span { display: none; }
    }
  `],
})
export class MainLayoutComponent {
  readonly theme = inject(ThemeService);
  readonly loading = inject(LoadingService);

  constructor() {
    this.theme.init();
  }
}
