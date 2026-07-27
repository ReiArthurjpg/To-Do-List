import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Task } from '../../interfaces/task.interface';
import { AppChipComponent } from '../../../../shared/components/app-chip/app-chip.component';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatIconModule,
    AppChipComponent,
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
      role="button"
      tabindex="0"
      (click)="openDetail()"
      (keydown.enter)="openDetail()"
      (keydown.space)="openDetail()"
      [attr.aria-label]="'Ver detalhes da tarefa: ' + task.title">

      <!-- Header: status chip -->
      <header class="task-card__header">
        <app-chip [status]="task.status" />
      </header>

      <!-- Body: title & description -->
      <div class="task-card__body">
        <h3 class="task-card__title">{{ task.title }}</h3>
        @if (task.description) {
          <p class="task-card__description">{{ task.description }}</p>
        }
      </div>

      <!-- Subtle "click to see more" hint -->
      <div class="task-card__hint" aria-hidden="true">
        <mat-icon>open_in_new</mat-icon>
        <span>Ver detalhes</span>
      </div>

    </article>
  `,
  styles: [`
    .task-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 18px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      cursor: pointer;
      transition: transform 220ms cubic-bezier(0.34,1.56,0.64,1),
                  box-shadow 220ms ease,
                  border-color 220ms ease;
      position: relative;
      overflow: hidden;
      outline: none;
    }

    .task-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 3px;
      background: linear-gradient(90deg, #6366f1, #818cf8);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 250ms ease;
    }

    .task-card:hover, .task-card:focus-visible {
      border-color: rgba(99, 102, 241, 0.25);
      box-shadow: 0 8px 28px rgba(99, 102, 241, 0.14);
      transform: translateY(-3px) scale(1.01);
    }

    .task-card:hover::before, .task-card:focus-visible::before {
      transform: scaleX(1);
    }

    .task-card:hover .task-card__hint {
      opacity: 1;
    }

    .task-card__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .task-card__body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .task-card__title {
      font-size: 1rem;
      font-weight: 650;
      color: var(--color-text-primary);
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      letter-spacing: -0.01em;
      margin: 0;
    }

    .task-card__description {
      font-size: 0.8125rem;
      color: var(--color-text-secondary);
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin: 0;
      opacity: 0.85;
    }

    .task-card__hint {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.02em;
      color: var(--color-primary);
      opacity: 0;
      transition: opacity 180ms ease;
      line-height: 1;
    }

    .task-card__hint mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }

    .task-card__hint span {
      display: inline-block;
      line-height: 1;
    }
  `],
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
  @Output() viewDetail = new EventEmitter<Task>();

  openDetail(): void {
    this.viewDetail.emit(this.task);
  }
}
