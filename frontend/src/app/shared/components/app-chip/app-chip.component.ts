import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskStatus } from '../../../features/task/models/task-status.model';
import { TaskStatusLabelPipe } from '../../pipes/task-status-label.pipe';

type ChipVariant = 'pending' | 'in-progress' | 'done';

@Component({
  selector: 'app-chip',
  standalone: true,
  imports: [CommonModule, TaskStatusLabelPipe],
  template: `
    <span
      class="chip"
      [class]="'chip chip--' + variant"
      [attr.aria-label]="'Status: ' + (status | taskStatusLabel)"
      role="status">
      <span class="chip__dot" aria-hidden="true"></span>
      {{ status | taskStatusLabel }}
    </span>
  `,
  styles: [`
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 10px 3px 8px;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
      letter-spacing: 0.01em;
      white-space: nowrap;
      transition: opacity 150ms ease;
    }

    .chip__dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .chip--pending {
      background: var(--chip-pending-bg, #f1f5f9);
      color: var(--chip-pending-text, #475569);
    }
    .chip--pending .chip__dot { background: #94a3b8; }

    .chip--in-progress {
      background: var(--chip-progress-bg, #eff6ff);
      color: var(--chip-progress-text, #2563eb);
    }
    .chip--in-progress .chip__dot { background: #3b82f6; animation: pulse 2s infinite; }

    .chip--done {
      background: var(--chip-done-bg, #ecfdf5);
      color: var(--chip-done-text, #059669);
    }
    .chip--done .chip__dot { background: #10b981; }

    [data-theme='dark'] .chip--pending   { --chip-pending-bg: rgba(148,163,184,.15); --chip-pending-text: #94a3b8; }
    [data-theme='dark'] .chip--in-progress { --chip-progress-bg: rgba(59,130,246,.15); --chip-progress-text: #60a5fa; }
    [data-theme='dark'] .chip--done      { --chip-done-bg: rgba(16,185,129,.15); --chip-done-text: #34d399; }

    @keyframes pulse {
      0%,100% { opacity: 1; }
      50%      { opacity: 0.4; }
    }
  `],
})
export class AppChipComponent implements OnChanges {
  @Input({ required: true }) status!: TaskStatus;
  variant: ChipVariant = 'pending';

  ngOnChanges(): void {
    const map: Record<TaskStatus, ChipVariant> = {
      PENDING:     'pending',
      IN_PROGRESS: 'in-progress',
      DONE:        'done',
    };
    this.variant = map[this.status] ?? 'pending';
  }
}
