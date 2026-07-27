import { Component, Input, computed } from '@angular/core';
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
          style({ opacity: 0, transform: 'translateY(24px) scale(0.97)' }),
          stagger(70, [
            animate('360ms cubic-bezier(0.34,1.56,0.64,1)',
              style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
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

          <div class="stat-card__icon-wrap" aria-hidden="true">
            <mat-icon>{{ card.icon }}</mat-icon>
          </div>

          <div class="stat-card__body">
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
    /* ---- Grid ---- */
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
      .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    }

    /* ---- Card ---- */
    .stat-card {
      position: relative;
      border-radius: 18px;
      padding: 22px 20px;
      display: flex;
      align-items: center;
      gap: 18px;
      cursor: default;
      overflow: hidden;
      border: 1px solid transparent;
      transition: transform 220ms cubic-bezier(0.34,1.56,0.64,1),
                  box-shadow 220ms ease;
    }

    .stat-card:hover {
      transform: translateY(-4px) scale(1.01);
    }

    /* ---- Icon Wrap ---- */
    .stat-card__icon-wrap {
      width: 52px;
      height: 52px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: transform 220ms cubic-bezier(0.34,1.56,0.64,1);
    }

    .stat-card:hover .stat-card__icon-wrap {
      transform: scale(1.1) rotate(-6deg);
    }

    .stat-card__icon-wrap mat-icon {
      font-size: 26px;
      width: 26px;
      height: 26px;
    }

    /* ---- Body ---- */
    .stat-card__body {
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: 0;
    }

    .stat-card__value {
      font-size: 2rem;
      font-weight: 800;
      line-height: 1;
      letter-spacing: -0.04em;
    }

    .stat-card__label {
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      opacity: 0.65;
      white-space: nowrap;
    }

    /* ---- Total ---- */
    .stat--total {
      background: linear-gradient(135deg, #eef2ff 0%, #ffffff 100%);
      border-color: rgba(99,102,241,0.18);
      box-shadow: 0 2px 12px rgba(99,102,241,0.08);
    }
    .stat--total:hover {
      box-shadow: 0 8px 28px rgba(99,102,241,0.22);
    }
    .stat--total .stat-card__icon-wrap {
      background: linear-gradient(135deg, #6366f1, #818cf8);
      box-shadow: 0 4px 12px rgba(99,102,241,0.35);
      color: #fff;
    }
    .stat--total .stat-card__value { color: #6366f1; }

    /* ---- Pending ---- */
    .stat--pending {
      background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
      border-color: rgba(148,163,184,0.25);
      box-shadow: 0 2px 12px rgba(100,116,139,0.07);
    }
    .stat--pending:hover {
      box-shadow: 0 8px 28px rgba(100,116,139,0.16);
    }
    .stat--pending .stat-card__icon-wrap {
      background: linear-gradient(135deg, #64748b, #94a3b8);
      box-shadow: 0 4px 12px rgba(100,116,139,0.3);
      color: #fff;
    }
    .stat--pending .stat-card__value { color: #475569; }

    /* ---- In Progress ---- */
    .stat--progress {
      background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
      border-color: rgba(59,130,246,0.18);
      box-shadow: 0 2px 12px rgba(59,130,246,0.08);
    }
    .stat--progress:hover {
      box-shadow: 0 8px 28px rgba(59,130,246,0.22);
    }
    .stat--progress .stat-card__icon-wrap {
      background: linear-gradient(135deg, #3b82f6, #60a5fa);
      box-shadow: 0 4px 12px rgba(59,130,246,0.35);
      color: #fff;
    }
    .stat--progress .stat-card__value { color: #2563eb; }
    .stat--progress .stat-card__icon-wrap mat-icon {
      animation: spin 2.4s linear infinite;
    }

    /* ---- Done ---- */
    .stat--done {
      background: linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%);
      border-color: rgba(16,185,129,0.18);
      box-shadow: 0 2px 12px rgba(16,185,129,0.08);
    }
    .stat--done:hover {
      box-shadow: 0 8px 28px rgba(16,185,129,0.22);
    }
    .stat--done .stat-card__icon-wrap {
      background: linear-gradient(135deg, #10b981, #34d399);
      box-shadow: 0 4px 12px rgba(16,185,129,0.35);
      color: #fff;
    }
    .stat--done .stat-card__value { color: #059669; }

    @keyframes spin { to { transform: scale(1.1) rotate(366deg); } }

    @media (max-width: 480px) {
      .stat-card { padding: 16px 14px; gap: 12px; }
      .stat-card__icon-wrap { width: 44px; height: 44px; border-radius: 12px; }
      .stat-card__icon-wrap mat-icon { font-size: 22px; width: 22px; height: 22px; }
      .stat-card__value { font-size: 1.6rem; }
    }
  `],
})
export class TaskStatsComponent {
  @Input() stats: TaskStats | null = null;
  @Input() loading = false;

  readonly cards = STAT_CARDS;
}

