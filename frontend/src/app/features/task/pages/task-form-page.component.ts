import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { animate, style, transition, trigger } from '@angular/animations';

import { TaskService } from '../services/task.service';
import { TASK_STATUS_LABELS, TASK_STATUS_OPTIONS, TaskStatus } from '../models/task-status.model';

@Component({
  selector: 'app-task-form-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  animations: [
    trigger('pageAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms cubic-bezier(0.34,1.56,0.64,1)',
          style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
  templateUrl: './form/task-form-page.component.html',
  styleUrl: './form/task-form-page.component.scss',
})
export class TaskFormPageComponent implements OnInit {
  private readonly fb      = inject(FormBuilder);
  private readonly service = inject(TaskService);
  private readonly route   = inject(ActivatedRoute);
  private readonly router  = inject(Router);
  private readonly snack   = inject(MatSnackBar);

  readonly statusOptions = TASK_STATUS_OPTIONS;
  readonly statusLabels  = TASK_STATUS_LABELS;

  readonly id       = Number(this.route.snapshot.paramMap.get('id'));
  readonly isEdit   = Boolean(this.id);
  readonly saving   = signal(false);
  readonly loadingTask = signal(false);

  readonly form = this.fb.nonNullable.group({
    title:       ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
    description: ['', [Validators.maxLength(1000)]],
    status:      ['PENDING' as TaskStatus, [Validators.required]],
  });

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
    if (this.isEdit) {
      this.loadingTask.set(true);
      this.service.findById(this.id).subscribe({
        next:  task => { this.form.patchValue(task); this.loadingTask.set(false); },
        error: ()   => { this.loadingTask.set(false); this.router.navigateByUrl('/'); },
      });
    }
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    const payload = this.form.getRawValue();
    const action  = this.isEdit
      ? this.service.update(this.id, payload)
      : this.service.create(payload);

    action.subscribe({
      next: () => {
        this.saving.set(false);
        const msg = this.isEdit ? 'Tarefa atualizada com sucesso! ✓' : 'Tarefa criada com sucesso! ✓';
        this.snack.open(msg, 'Fechar', { duration: 4000, panelClass: ['snack-success'] });
        this.router.navigateByUrl('/');
      },
      error: () => this.saving.set(false),
    });
  }
}
