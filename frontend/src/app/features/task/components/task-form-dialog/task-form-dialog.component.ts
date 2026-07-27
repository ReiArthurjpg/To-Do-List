import { Component, Inject, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TaskService } from '../../services/task.service';
import { TASK_STATUS_LABELS, TASK_STATUS_OPTIONS, TaskStatus } from '../../models/task-status.model';
import { Task } from '../../interfaces/task.interface';

export interface TaskFormDialogData {
  task?: Task;
}

@Component({
  selector: 'app-task-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="dialog-container">
      <!-- Header -->
      <div class="dialog-header">
        <h2 mat-dialog-title class="dialog-title">{{ isEdit ? 'Editar tarefa' : 'Nova tarefa' }}</h2>
        <button mat-icon-button class="dialog-close" (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content class="dialog-content">
        <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="task-form">
          
          <!-- Title -->
          <div class="form-field-group">
            <label for="task-title" class="form-label">
              Título <span class="required">*</span>
            </label>
            <mat-form-field appearance="outline" class="form-field">
              <input
                id="task-title"
                matInput
                formControlName="title"
                placeholder="Ex: Implementar autenticação JWT"
                maxlength="120">
              <mat-hint align="end">{{ titleCharCount }}/120</mat-hint>
              @if (titleError) {
                <mat-error>{{ titleError }}</mat-error>
              }
            </mat-form-field>
          </div>

          <!-- Description -->
          <div class="form-field-group">
            <label for="task-description" class="form-label">Descrição</label>
            <mat-form-field appearance="outline" class="form-field">
              <textarea
                id="task-description"
                matInput
                formControlName="description"
                rows="4"
                maxlength="1000"
                placeholder="Descreva os detalhes da tarefa (opcional)...">
              </textarea>
              <mat-hint align="end">{{ descCharCount }}/1000</mat-hint>
              @if (descError) {
                <mat-error>{{ descError }}</mat-error>
              }
            </mat-form-field>
          </div>

          <!-- Status -->
          <div class="form-field-group">
            <label for="task-status" class="form-label">
              Status <span class="required">*</span>
            </label>
            <mat-form-field appearance="outline" class="form-field">
              <mat-select id="task-status" formControlName="status">
                @for (s of statusOptions; track s) {
                  <mat-option [value]="s">
                    <div class="status-option">
                      <span class="status-dot status-dot--{{ s.toLowerCase().replace('_', '-') }}"></span>
                      {{ statusLabels[s] }}
                    </div>
                  </mat-option>
                }
              </mat-select>
            </mat-form-field>
          </div>

        </form>
      </mat-dialog-content>

      <mat-dialog-actions class="dialog-actions">
        <div class="spacer"></div>
        <button mat-button class="btn-cancel" (click)="close()" [disabled]="saving()">
          Cancelar
        </button>
        <button mat-stroked-button class="btn-save" (click)="submit()" [disabled]="saving()">
          @if (saving()) {
            <mat-spinner diameter="18" class="spinner-mr" />
            <span>Salvando...</span>
          } @else {
            <span>{{ isEdit ? 'Salvar' : 'Criar' }}</span>
          }
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

    .dialog-title {
      font-size: 1.375rem;
      font-weight: 700;
      color: var(--color-text-primary, #0f172a);
      margin: 0;
      line-height: 1.3;
    }

    .dialog-close {
      color: var(--color-text-tertiary, #94a3b8);
    }

    .dialog-content {
      padding: 24px !important;
      margin: 0 !important;
    }

    .task-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-field-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-text-primary, #1e293b);
    }

    .required {
      color: #ef4444;
    }

    .form-field {
      width: 100%;
    }

    ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      padding: 0;
    }

    .status-option {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .status-dot--pending { background: #eab308; }
    .status-dot--in-progress { background: #3b82f6; }
    .status-dot--completed { background: #22c55e; }

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

    .btn-cancel {
      color: var(--color-text-secondary, #475569);
    }

    .btn-save {
      border-color: #22c55e !important;
      color: #22c55e !important;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }

    .btn-save:hover {
      background-color: #22c55e !important;
      color: #ffffff !important;
    }

    .spinner-mr {
      margin-right: 8px;
    }
  `]
})
export class TaskFormDialogComponent implements OnInit {
  private readonly fb      = inject(FormBuilder);
  private readonly service = inject(TaskService);
  private readonly snack   = inject(MatSnackBar);

  readonly statusOptions = TASK_STATUS_OPTIONS;
  readonly statusLabels  = TASK_STATUS_LABELS;
  readonly saving = signal(false);

  readonly isEdit: boolean;
  readonly task?: Task;

  readonly form = this.fb.nonNullable.group({
    title:       ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
    description: ['', [Validators.maxLength(1000)]],
    status:      ['PENDING' as TaskStatus, [Validators.required]],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: TaskFormDialogData,
    private dialogRef: MatDialogRef<TaskFormDialogComponent>
  ) {
    this.task = data?.task;
    this.isEdit = !!this.task;
  }

  get titleCtrl()       { return this.form.controls.title; }
  get descriptionCtrl() { return this.form.controls.description; }
  get statusCtrl()      { return this.form.controls.status; }

  get titleError(): string | null {
    const c = this.titleCtrl;
    if (!c.touched || !c.errors) return null;
    if (c.errors['required'])   return 'O título é obrigatório.';
    if (c.errors['minlength'])  return 'O título deve ter ao menos 3 caracteres.';
    if (c.errors['maxlength'])  return 'O título pode ter no máximo 120 caracteres.';
    return null;
  }

  get descError(): string | null {
    const c = this.descriptionCtrl;
    if (!c.touched || !c.errors) return null;
    if (c.errors['maxlength'])  return 'A descrição pode ter no máximo 1000 caracteres.';
    return null;
  }

  get titleCharCount(): number {
    return this.titleCtrl.value?.length ?? 0;
  }

  get descCharCount(): number {
    return this.descriptionCtrl.value?.length ?? 0;
  }

  ngOnInit(): void {
    if (this.isEdit && this.task) {
      this.form.patchValue(this.task);
    }
  }

  close(): void {
    if (this.saving()) return;
    this.dialogRef.close();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const payload = this.form.getRawValue();

    const action = this.isEdit && this.task
      ? this.service.update(this.task.id, payload)
      : this.service.create(payload);

    action.subscribe({
      next: (savedTask) => {
        this.saving.set(false);
        const msg = this.isEdit ? 'Tarefa atualizada com sucesso! ✓' : 'Tarefa criada com sucesso! ✓';
        this.snack.open(msg, 'Fechar', { duration: 4000, panelClass: ['snack-success'] });
        this.dialogRef.close(savedTask); // Return the saved task on success
      },
      error: () => {
        this.saving.set(false);
      },
    });
  }
}
