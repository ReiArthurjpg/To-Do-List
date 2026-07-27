import { Component, Inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../../interfaces/task.interface';
import { AppChipComponent } from '../../../../shared/components/app-chip/app-chip.component';
import { RelativeDatePipe } from '../../../../shared/pipes/relative-date.pipe';
import { animate, style, transition, trigger } from '@angular/animations';

export interface TaskDetailDialogData {
  task: Task;
}

@Component({
  selector: 'app-task-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    AppChipComponent,
    RelativeDatePipe,
  ],
  animations: [
    trigger('modalAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.96) translateY(8px)' }),
        animate('280ms cubic-bezier(0.34,1.56,0.64,1)',
          style({ opacity: 1, transform: 'scale(1) translateY(0)' })),
      ]),
      transition(':leave', [
        animate('180ms ease', style({ opacity: 0, transform: 'scale(0.97)' })),
      ]),
    ]),
  ],
  template: `
    <div class="detail-dialog" @modalAnim>

      <!-- Header -->
      <div class="detail-dialog__header">
        <app-chip [status]="task.status" />
        <button
          mat-icon-button
          class="detail-dialog__close"
          (click)="close()"
          aria-label="Fechar detalhes da tarefa">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Title -->
      <h2 class="detail-dialog__title">{{ task.title }}</h2>

      <!-- Description -->
      <div class="detail-dialog__section">
        <div class="detail-dialog__section-label">
          <mat-icon>notes</mat-icon>
          Descrição
        </div>
        @if (task.description) {
          <p class="detail-dialog__description">{{ task.description }}</p>
        } @else {
          <p class="detail-dialog__description detail-dialog__description--empty">
            Sem descrição cadastrada
          </p>
        }
      </div>

      <!-- Dates -->
      <div class="detail-dialog__dates">
        <div class="detail-dialog__date-item">
          <mat-icon aria-hidden="true">schedule</mat-icon>
          <div class="detail-dialog__date-body">
            <span class="detail-dialog__date-label">Criado em</span>
            <span class="detail-dialog__date-value"
              [title]="task.createdAt | date:'dd/MM/yyyy HH:mm'">
              {{ task.createdAt | relativeDate }}
            </span>
          </div>
        </div>

        @if (task.updatedAt !== task.createdAt) {
          <div class="detail-dialog__date-item">
            <mat-icon aria-hidden="true">update</mat-icon>
            <div class="detail-dialog__date-body">
              <span class="detail-dialog__date-label">Atualizado em</span>
              <span class="detail-dialog__date-value"
                [title]="task.updatedAt | date:'dd/MM/yyyy HH:mm'">
                {{ task.updatedAt | relativeDate }}
              </span>
            </div>
          </div>
        }
      </div>

      <!-- Actions -->
      <div class="detail-dialog__actions">
        <button mat-stroked-button class="btn-cancel" (click)="close()">
          Fechar
        </button>
        <a mat-flat-button class="btn-edit"
          [routerLink]="['/tasks', task.id, 'edit']"
          (click)="close()">
          <mat-icon>edit</mat-icon>
          Editar tarefa
        </a>
      </div>

    </div>
  `,
  styles: [`
    .detail-dialog {
      padding: 28px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      max-width: 480px;
      width: 100%;
    }

    /* ---- Header ---- */
    .detail-dialog__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .detail-dialog__close {
      color: var(--color-text-tertiary) !important;
      width: 32px !important;
      height: 32px !important;
    }

    .detail-dialog__close mat-icon {
      font-size: 18px !important;
      width: 18px !important;
      height: 18px !important;
    }

    /* ---- Title ---- */
    .detail-dialog__title {
      font-size: 1.375rem;
      font-weight: 700;
      letter-spacing: -0.03em;
      color: var(--color-text-primary);
      line-height: 1.3;
      margin: 0;
    }

    /* ---- Section ---- */
    .detail-dialog__section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .detail-dialog__section-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--color-text-tertiary);

      mat-icon {
        font-size: 15px;
        width: 15px;
        height: 15px;
      }
    }

    .detail-dialog__description {
      font-size: 0.9rem;
      line-height: 1.65;
      color: var(--color-text-secondary);
      margin: 0;
      padding: 14px 16px;
      background: var(--color-background);
      border-radius: 10px;
      border: 1px solid var(--color-border);
    }

    .detail-dialog__description--empty {
      font-style: italic;
      opacity: 0.55;
    }

    /* ---- Dates ---- */
    .detail-dialog__dates {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .detail-dialog__date-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      flex: 1;
      min-width: 120px;
      padding: 12px 14px;
      background: var(--color-background);
      border-radius: 10px;
      border: 1px solid var(--color-border);

      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        color: var(--color-text-tertiary);
        margin-top: 2px;
        flex-shrink: 0;
      }
    }

    .detail-dialog__date-body {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .detail-dialog__date-label {
      font-size: 0.68rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--color-text-tertiary);
    }

    .detail-dialog__date-value {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-primary);
    }

    /* ---- Actions ---- */
    .detail-dialog__actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding-top: 4px;
    }

    .btn-cancel {
      border-color: var(--color-border) !important;
      color: var(--color-text-secondary) !important;
      border-radius: 9999px !important;
    }

    .btn-edit {
      background: linear-gradient(135deg, #6366f1, #818cf8) !important;
      color: #fff !important;
      border-radius: 9999px !important;
      box-shadow: 0 2px 10px rgba(99,102,241,0.35) !important;
      gap: 6px;
    }

    .btn-edit mat-icon {
      font-size: 17px !important;
      width: 17px !important;
      height: 17px !important;
    }
  `],
})
export class TaskDetailDialogComponent {
  readonly task: Task;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: TaskDetailDialogData,
    private dialogRef: MatDialogRef<TaskDetailDialogComponent>,
  ) {
    this.task = data.task;
  }

  close(): void {
    this.dialogRef.close();
  }
}
