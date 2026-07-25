import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Task } from '../../interfaces/task.interface';
import { AppChipComponent } from '../../../../shared/components/app-chip/app-chip.component';
import { RelativeDatePipe } from '../../../../shared/pipes/relative-date.pipe';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    AppChipComponent,
    RelativeDatePipe,
  ],
  animations: [
    trigger('cardAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(16px)' }),
        animate('280ms cubic-bezier(0.34,1.56,0.64,1)',
          style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('180ms ease', style({ opacity: 0, transform: 'scale(0.96)' })),
      ]),
    ]),
  ],
  template: `
    <article
      class="task-card"
      @cardAnim
      [attr.aria-label]="'Tarefa: ' + task.title">

      <!-- Header -->
      <header class="task-card__header">
        <app-chip [status]="task.status" />
        <div class="task-card__actions">
          <button
            mat-icon-button
            class="action-btn action-btn--edit"
            [routerLink]="['/tasks', task.id, 'edit']"
            matTooltip="Editar tarefa"
            [attr.aria-label]="'Editar tarefa: ' + task.title">
            <mat-icon>edit</mat-icon>
          </button>
          <button
            mat-icon-button
            class="action-btn action-btn--delete"
            (click)="onDelete()"
            matTooltip="Excluir tarefa"
            [attr.aria-label]="'Excluir tarefa: ' + task.title">
            <mat-icon>delete_outline</mat-icon>
          </button>
        </div>
      </header>

      <!-- Body -->
      <div class="task-card__body">
        <h3 class="task-card__title">{{ task.title }}</h3>
        @if (task.description) {
          <p class="task-card__description">{{ task.description }}</p>
        } @else {
          <p class="task-card__description task-card__description--empty">Sem descrição</p>
        }
      </div>

      <!-- Footer -->
      <footer class="task-card__footer">
        <div class="task-card__meta">
          <mat-icon aria-hidden="true">schedule</mat-icon>
          <span [matTooltip]="task.createdAt | date:'dd/MM/yyyy HH:mm'">
            {{ task.createdAt | relativeDate }}
          </span>
        </div>
        @if (task.updatedAt !== task.createdAt) {
          <div class="task-card__meta task-card__meta--updated">
            <mat-icon aria-hidden="true">update</mat-icon>
            <span [matTooltip]="task.updatedAt | date:'dd/MM/yyyy HH:mm'">
              {{ task.updatedAt | relativeDate }}
            </span>
          </div>
        }
      </footer>
    </article>
  `,
  styles: [`
    .task-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 16px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      cursor: default;
      transition: all 200ms ease;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 2px;
        background: var(--color-primary);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 250ms ease;
      }

      &:hover {
        border-color: var(--color-border-strong);
        box-shadow: 0 8px 24px rgba(0,0,0,.08);
        transform: translateY(-2px);

        &::before { transform: scaleX(1); }
      }

      &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      &__actions {
        display: flex;
        align-items: center;
        gap: 0;
        opacity: 0;
        transition: opacity 150ms ease;
      }

      &:hover &__actions,
      &:focus-within &__actions { opacity: 1; }

      &__body { flex: 1; display: flex; flex-direction: column; gap: 6px; }

      &__title {
        font-size: 0.9375rem;
        font-weight: 600;
        color: var(--color-text-primary);
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      &__description {
        font-size: 0.8125rem;
        color: var(--color-text-secondary);
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin: 0;

        &--empty { font-style: italic; opacity: 0.5; }
      }

      &__footer {
        display: flex;
        align-items: center;
        gap: 12px;
        padding-top: 8px;
        border-top: 1px solid var(--color-border);
        flex-wrap: wrap;
      }

      &__meta {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.75rem;
        color: var(--color-text-tertiary);

        mat-icon { font-size: 14px; width: 14px; height: 14px; }

        &--updated { color: var(--color-text-tertiary); }
      }
    }

    .action-btn {
      width: 32px !important; height: 32px !important;
      line-height: 32px !important;

      mat-icon { font-size: 18px !important; width: 18px !important; height: 18px !important; }

      &--edit { color: var(--color-info) !important; }
      &--delete {
        color: var(--color-error) !important;
        &:hover { background: var(--color-error-bg) !important; }
      }
    }
  `],
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
  @Output() delete = new EventEmitter<Task>();

  onDelete(): void {
    this.delete.emit(this.task);
  }
}
