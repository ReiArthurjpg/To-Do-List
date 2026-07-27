import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  animate, style, transition, trigger
} from '@angular/animations';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  animations: [
    trigger('dialogAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.92) translateY(-8px)' }),
        animate('220ms cubic-bezier(0.34,1.56,0.64,1)',
          style({ opacity: 1, transform: 'scale(1) translateY(0)' })),
      ]),
    ]),
  ],
  template: `
    <div class="dialog-container" @dialogAnim>
      <div class="dialog-header">
        <h2 mat-dialog-title class="task-title">{{ data.title }}</h2>
        <button mat-icon-button class="dialog-close" [mat-dialog-close]="false">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content class="dialog-content">
        <p class="message">{{ data.message }}</p>
      </mat-dialog-content>

      <mat-dialog-actions class="dialog-actions">
        <div class="spacer"></div>
        <button mat-button class="cancel-btn" [mat-dialog-close]="false">
          {{ data.cancelLabel ?? 'Cancelar' }}
        </button>
        <button mat-stroked-button [class]="data.danger ? 'delete-btn' : 'confirm-btn'" [mat-dialog-close]="true">
          {{ data.confirmLabel ?? 'Confirmar' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      display: flex;
      flex-direction: column;
      max-height: 90vh;
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

    .task-title {
      font-size: 1.375rem;
      font-weight: 700;
      color: var(--color-text-primary, #0f172a);
      margin: 0;
      line-height: 1.3;
    }

    .dialog-content {
      padding: 24px !important;
      margin: 0 !important;
    }

    .message {
      font-size: 1rem;
      color: var(--color-text-secondary, #475569);
      line-height: 1.5;
      margin: 0;
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

    .cancel-btn {
      color: var(--color-text-secondary, #475569);
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

    .confirm-btn {
      border-color: var(--color-primary, #3b82f6) !important;
      color: var(--color-primary, #3b82f6) !important;
      transition: all 0.2s ease;
    }

    .confirm-btn:hover {
      background-color: var(--color-primary, #3b82f6) !important;
      color: #ffffff !important;
    }
  `],
})
export class AppConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AppConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
}
