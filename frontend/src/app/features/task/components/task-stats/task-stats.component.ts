import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TaskStats } from '../../interfaces/task.interface';
import {
  animate, query, stagger, style, transition, trigger
} from '@angular/animations';

interface StatCard {
  key: keyof TaskStats;
  label: string;
  icon: string;
  colorClass: string;
  ariaLabel: string;
}

const STAT_CARDS: StatCard[] = [
  { key: 'total',      label: 'Total',        icon: 'format_list_bulleted', colorClass: 'stat--total',    ariaLabel: 'Total de tarefas' },
  { key: 'pending',    label: 'Pendentes',    icon: 'radio_button_unchecked', colorClass: 'stat--pending',  ariaLabel: 'Tarefas pendentes' },
  { key: 'inProgress', label: 'Em andamento', icon: 'autorenew',            colorClass: 'stat--progress', ariaLabel: 'Tarefas em andamento' },
  { key: 'done',       label: 'Concluídas',   icon: 'check_circle',         colorClass: 'stat--done',     ariaLabel: 'Tarefas concluídas' },
];

@Component({
  selector: 'app-task-stats',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  animations: [
    trigger('staggerCards', [
      transition(':enter', [
        query('.stat-card', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(80, [
            animate('320ms cubic-bezier(0.34,1.56,0.64,1)',
              style({ opacity: 1, transform: 'translateY(0)' })),
          ]),
        ], { optional: true }),
      ]),
    ]),
  ],
  template: `
    <div class="stats-grid" @staggerCards>
      @for (card of cards; track card.key) {
        <article
          class="stat-card"
          [class]="'stat-card ' + card.colorClass"
          [attr.aria-label]="card.ariaLabel + ': ' + (stats?.[card.key] ?? 0)">
          <div class="stat-card__icon" aria-hidden="true">
            <mat-icon>{{ card.icon }}</mat-icon>
          </div>
          <div class="stat-card__content">
            <span class="stat-card__value">
              {{ loading ? '—' : (stats?.[card.key] ?? 0) }}
            </span>
            <span class="stat-card__label">{{ card.label }}</span>
          </div>
        </article>
      }
    </div>
  `,
  styles: [`
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }

    @media (max-width: 900px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 480px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    }

    .stat-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 16px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      cursor: default;
      transition: transform 200ms ease, box-shadow 200ms ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,.08);
    }

    .stat-card__icon {
      width: 48px; height: 48px;
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }

    .stat-card__icon mat-icon { font-size: 24px; width: 24px; height: 24px; }

    .stat-card__content {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .stat-card__value {
      font-size: 1.75rem;
      font-weight: 700;
      line-height: 1;
      letter-spacing: -0.03em;
    }

    .stat-card__label {
      font-size: 0.8rem;
      font-weight: 500;
      opacity: 0.7;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .stat-card--total { border-left: 3px solid var(--color-primary); }
    .stat-card--total .stat-card__icon { background: var(--color-primary-light); color: var(--color-primary); }
    .stat-card--total .stat-card__value { color: var(--color-primary); }

    .stat-card--pending { border-left: 3px solid var(--color-border-strong); }
    .stat-card--pending .stat-card__icon { background: var(--color-border); color: var(--color-text-secondary); }
    .stat-card--pending .stat-card__value { color: var(--color-text-secondary); }

    .stat-card--progress { border-left: 3px solid var(--color-info); }
    .stat-card--progress .stat-card__icon { background: var(--color-info-bg); color: var(--color-info); }
    .stat-card--progress .stat-card__value { color: var(--color-info); }
    .stat-card--progress .stat-card__icon mat-icon { animation: spin 2s linear infinite; }

    .stat-card--done { border-left: 3px solid var(--color-success); }
    .stat-card--done .stat-card__icon { background: var(--color-success-bg); color: var(--color-success); }
    .stat-card--done .stat-card__value { color: var(--color-success); }

    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 480px) {
      .stat-card { padding: 14px; gap: 10px; }
      .stat-card__icon { width: 40px; height: 40px; border-radius: 10px; }
      .stat-card__value { font-size: 1.4rem; }
    }
  `],
})
export class TaskStatsComponent {
  @Input() stats: TaskStats | null = null;
  @Input() loading = false;

  readonly cards = STAT_CARDS;
}
