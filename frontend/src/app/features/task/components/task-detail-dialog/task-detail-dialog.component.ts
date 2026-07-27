import { Component, Inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../../interfaces/task.interface';
import { AppChipComponent } from '../../../../shared/components/app-chip/app-chip.component';
import { RelativeDatePipe } from '../../../../shared/pipes/relative-date.pipe';
import { te } from 'date-fns/locale';

export interface TaskDetailDialogData {
  task: Task;
}

export type TaskDetailDialogResult = 'edit' | 'delete' | undefined;

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
  template: `
    <div class="dialog-container">
      
      <!-- Header -->
      <div class="dialog-header">
        <app-chip [status]="task.status" />
        <button mat-icon-button class="dialog-close" (click)="close()" aria-label="Fechar">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content class="dialog-content">
        <!-- Title -->
        <h2 class="task-title">{{ task.title }}</h2>

        <!-- Description -->
        <div class="section-container">
          <div class="section-label">
            <mat-icon class="section-icon">notes</mat-icon>
            <span>Descrição</span>
          </div>
          <div class="section-card">
            @if (task.description) {
              <p class="task-desc">{{ task.description }}</p>
            } @else {
              <p class="task-desc task-desc--empty">Nenhuma descrição fornecida.</p>
            }
          </div>
        </div>

        <!-- Dates -->
        <div class="dates-grid">
          <div class="date-card">
            <div class="date-icon-wrapper">
              <mat-icon>calendar_today</mat-icon>
            </div>
            <div class="date-info">
              <span class="date-label">Criado em</span>
              <span class="date-value">
                @if (createdAtSafe) {
                  {{ createdAtSafe | date:'dd/MM/yyyy HH:mm' }}
                } @else {
                  —
                }
              </span>
              <span class="date-relative">{{ createdAtSafe | relativeDate }}</span>
            </div>
          </div>

          @if (updatedAtSafe && updatedAtSafe !== createdAtSafe) {
            <div class="date-card">
              <div class="date-icon-wrapper">
                <mat-icon>update</mat-icon>
              </div>
              <div class="date-info">
                <span class="date-label">Atualizado</span>
                <span class="date-value">{{ updatedAtSafe | date:'dd/MM/yyyy HH:mm' }}</span>
                <span class="date-relative">{{ updatedAtSafe | relativeDate }}</span>
              </div>
            </div>
          }
        </div>
      </mat-dialog-content>

      <mat-dialog-actions class="dialog-actions">
        <div class="spacer"></div>

        <button mat-stroked-button color="warn" class="delete-btn" (click)="onDelete()">
          Excluir
        </button>

        <a mat-stroked-button class="edit-btn" [routerLink]="['/tasks', task.id, 'edit']" (click)="close()">
          Editar
        </a>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      display: flex;
      flex-direction: column;
      width: 100%;
      background: var(--color-surface, #ffffff);
    }

    [data-theme='dark'] .dialog-container {
      background: #1e293b;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      border-bottom: 1px solid var(--color-border, #e2e8f0);
    }

    .dialog-close {
      color: var(--color-text-tertiary, #94a3b8);
    }

    .dialog-content {
      padding: 24px !important;
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin: 0 !important;
    }

    .task-title {
      font-size: 1.375rem;
      font-weight: 700;
      color: var(--color-text-primary, #0f172a);
      margin: 0;
      line-height: 1.3;
      word-break: break-word;
    }

    .section-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .section-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-text-tertiary, #64748b);
    }

    .section-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .section-card {
      background: var(--color-background, #f8fafc);
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: 12px;
      padding: 16px;
    }

    [data-theme='dark'] .section-card {
      background: rgba(15, 23, 42, 0.6);
      border-color: rgba(255, 255, 255, 0.08);
    }

    .task-desc {
      font-size: 0.9375rem;
      line-height: 1.6;
      color: var(--color-text-primary, #334155);
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .task-desc--empty {
      font-style: italic;
      color: var(--color-text-tertiary, #94a3b8);
    }

    .dates-grid {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .date-card {
      flex: 1;
      min-width: 180px;
      display: flex;
      align-items: center;
      gap: 12px;
      background: var(--color-background, #f8fafc);
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: 12px;
      padding: 14px;
    }

    [data-theme='dark'] .date-card {
      background: rgba(15, 23, 42, 0.6);
      border-color: rgba(255, 255, 255, 0.08);
    }

    .date-icon-wrapper {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: rgba(99, 102, 241, 0.1);
      color: #6366f1;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .date-icon-wrapper mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .date-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .date-label {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--color-text-tertiary, #64748b);
    }

    .date-value {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-text-primary, #0f172a);
    }

    .date-relative {
      font-size: 0.75rem;
      color: var(--color-text-tertiary, #94a3b8);
    }

    .dialog-actions {
      padding: 16px 24px !important;
      border-top: 1px solid var(--color-border, #e2e8f0);
      margin: 0 !important;
      background: var(--color-surface, #ffffff);
    }

    [data-theme='dark'] .dialog-actions {
      background: #1e293b;
    }

    .spacer {
      flex: 1;
    }

    .delete-btn {
      border-color: #ef4444 !important;
      color: #ef4444 !important;
      transition: all 0.2s ease;
    }

    .delete-btn:hover {
      background-color: #ef4444 !important;
      color: #ffffff !important;
    }

    .edit-btn {
      border-color: #9333ea !important;
      color: #9333ea !important;
      transition: all 0.2s ease;
    }

    .edit-btn:hover {
      background-color: #9333ea !important;
      color: #ffffff !important;
    }
  `]
})
export class TaskDetailDialogComponent {
  readonly task: Task;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: TaskDetailDialogData,
    private dialogRef: MatDialogRef<TaskDetailDialogComponent, TaskDetailDialogResult>,
  ) {
    this.task = data.task;
  }

  get createdAtSafe(): string | null {
    if (!this.task?.createdAt) return null;
    return this.task.createdAt.split('.')[0];
  }

  get updatedAtSafe(): string | null {
    if (!this.task?.updatedAt) return null;
    return this.task.updatedAt.split('.')[0];
  }

  close(): void {
    this.dialogRef.close();
  }

  onDelete(): void {
    this.dialogRef.close('delete');
  }
}
