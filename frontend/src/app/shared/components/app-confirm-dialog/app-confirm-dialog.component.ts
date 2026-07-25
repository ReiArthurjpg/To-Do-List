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
    <div class="dialog-wrapper" @dialogAnim>
      <div class="dialog-icon" [class.dialog-icon--danger]="data.danger">
        <mat-icon>{{ data.danger ? 'delete_forever' : 'help_outline' }}</mat-icon>
      </div>

      <h2 mat-dialog-title class="dialog-title">{{ data.title }}</h2>

      <mat-dialog-content class="dialog-content">
        <p>{{ data.message }}</p>
      </mat-dialog-content>

      <mat-dialog-actions class="dialog-actions" align="end">
        <button
          mat-button
          class="btn-cancel"
          [mat-dialog-close]="false"
          aria-label="Cancelar ação">
          {{ data.cancelLabel ?? 'Cancelar' }}
        </button>
        <button
          mat-flat-button
          [class]="data.danger ? 'btn-danger' : 'btn-confirm'"
          [mat-dialog-close]="true"
          [attr.aria-label]="data.confirmLabel ?? 'Confirmar'">
          {{ data.confirmLabel ?? 'Confirmar' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-wrapper {
      padding: 8px 8px 0;
      min-width: 360px;
    }

    .dialog-icon {
      width: 52px; height: 52px;
      border-radius: 50%;
      background: #eff6ff;
      color: #3b82f6;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 16px;
      mat-icon { font-size: 24px; width: 24px; height: 24px; }
    }

    .dialog-icon--danger {
      background: #fef2f2;
      color: #ef4444;
    }

    .dialog-title {
      text-align: center;
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 4px !important;
    }

    .dialog-content {
      text-align: center;
      color: var(--color-text-secondary);
      font-size: 0.9rem;
    }

    .dialog-actions {
      padding: 16px 0 8px !important;
      gap: 8px;
    }

    .btn-cancel {
      color: var(--color-text-secondary);
    }

    .btn-danger {
      background: #ef4444 !important;
      color: #fff !important;
      &:hover { background: #dc2626 !important; }
    }

    .btn-confirm {
      background: var(--color-primary) !important;
      color: #fff !important;
    }

    @media (max-width: 480px) {
      .dialog-wrapper { min-width: 280px; }
    }
  `],
})
export class AppConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AppConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
}
