import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TASK_STATUS_LABELS, TASK_STATUS_OPTIONS, TaskStatus } from '../../models/task-status.model';
import { debounceTime, distinctUntilChanged } from 'rxjs';

export interface FilterChange {
  title: string;
  status: TaskStatus | '';
}

export type ViewMode = 'card' | 'table';

@Component({
  selector: 'app-task-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
  ],
  template: `
    <div class="filters-block" role="search" aria-label="Filtros de tarefas">

      <!-- Left: Search + Status -->
      <div class="filters-block__controls">

        <!-- Search -->
        <div class="search-wrap">
          <mat-icon class="search-wrap__icon" aria-hidden="true">search</mat-icon>
          <input
            class="search-wrap__input"
            [formControl]="titleCtrl"
            placeholder="Buscar por título..."
            aria-label="Buscar tarefas por título"
            autocomplete="off">
          @if (titleCtrl.value) {
            <button
              class="search-wrap__clear"
              (click)="clearSearch()"
              aria-label="Limpar busca"
              type="button">
              <mat-icon>close</mat-icon>
            </button>
          }
        </div>

        <!-- Divider -->
        <div class="filters-block__divider" aria-hidden="true"></div>

        <!-- Status filter -->
        <div class="status-wrap">
          <mat-icon class="status-wrap__icon" aria-hidden="true">filter_list</mat-icon>
          <select
            class="status-wrap__select"
            [formControl]="statusCtrl"
            aria-label="Filtrar por status">
            <option value="">Todos os status</option>
            @for (s of statusOptions; track s) {
              <option [value]="s">{{ statusLabels[s] }}</option>
            }
          </select>
          <mat-icon class="status-wrap__chevron" aria-hidden="true">expand_more</mat-icon>
        </div>

      </div>

      <!-- Right: View Toggle -->
      <div class="filters-block__right">

        <!-- View Toggle -->
        <div class="view-toggle" role="group" aria-label="Modo de visualização">
          <button
            class="view-toggle__btn"
            [class.view-toggle__btn--active]="viewMode === 'card'"
            (click)="viewModeChange.emit('card')"
            matTooltip="Cards"
            aria-label="Visualizar em cards"
            type="button">
            <mat-icon>grid_view</mat-icon>
          </button>
          <button
            class="view-toggle__btn"
            [class.view-toggle__btn--active]="viewMode === 'table'"
            (click)="viewModeChange.emit('table')"
            matTooltip="Tabela"
            aria-label="Visualizar em tabela"
            type="button">
            <mat-icon>view_list</mat-icon>
          </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    /* ---- Filters Block ---- */
    .filters-block {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      background: #ffffff;
      border: 1px solid rgba(99, 102, 241, 0.12);
      border-radius: 16px;
      padding: 10px 16px;
      box-shadow: 0 2px 12px rgba(99, 102, 241, 0.06);
      flex-wrap: wrap;
      gap: 8px;
    }

    [data-theme='dark'] .filters-block {
      background: rgba(30, 41, 59, 0.8);
      border-color: rgba(99, 102, 241, 0.2);
      box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
    }

    /* ---- Controls (left) ---- */
    .filters-block__controls {
      display: flex;
      align-items: center;
      flex: 1;
      min-width: 0;
    }

    /* ---- Right ---- */
    .filters-block__right {
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    /* ---- Divider ---- */
    .filters-block__divider {
      width: 1px;
      height: 28px;
      background: var(--color-border);
      margin: 0 14px;
      flex-shrink: 0;
    }

    /* ---- Search ---- */
    .search-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
      min-width: 0;
      padding: 4px 8px;
    }

    .search-wrap__icon {
      color: var(--color-text-tertiary);
      font-size: 20px;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .search-wrap__input {
      flex: 1;
      min-width: 0;
      border: none;
      outline: none;
      background: transparent;
      font-size: 0.9rem;
      font-family: inherit;
      color: var(--color-text-primary);
      caret-color: var(--color-primary);
    }

    .search-wrap__input::placeholder {
      color: var(--color-text-tertiary);
    }

    .search-wrap__clear {
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      cursor: pointer;
      padding: 2px;
      border-radius: 50%;
      color: var(--color-text-tertiary);
      transition: color 150ms ease, background 150ms ease;
      flex-shrink: 0;
    }

    .search-wrap__clear:hover {
      color: var(--color-text-primary);
      background: var(--color-border);
    }

    .search-wrap__clear mat-icon { font-size: 16px; width: 16px; height: 16px; }

    /* ---- Status Select ---- */
    .status-wrap {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
      padding: 4px 6px;
    }

    .status-wrap__icon {
      color: var(--color-text-tertiary);
      font-size: 18px;
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    .status-wrap__select {
      border: none;
      outline: none;
      background: transparent;
      font-size: 0.875rem;
      font-family: inherit;
      font-weight: 500;
      color: var(--color-text-primary);
      cursor: pointer;
      appearance: none;
      -webkit-appearance: none;
      padding-right: 20px;
    }

    .status-wrap__chevron {
      color: var(--color-text-tertiary);
      font-size: 18px;
      width: 18px;
      height: 18px;
      pointer-events: none;
      margin-left: -20px;
    }

    /* ---- View Toggle ---- */
    .view-toggle {
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .view-toggle__btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      border: none;
      background: transparent;
      color: var(--color-text-tertiary);
      cursor: pointer;
      transition: background 150ms ease, color 150ms ease;
    }

    .view-toggle__btn mat-icon { font-size: 20px; width: 20px; height: 20px; }

    .view-toggle__btn:hover {
      background: var(--color-primary-light);
      color: var(--color-primary);
    }

    .view-toggle__btn--active {
      background: var(--color-primary-light) !important;
      color: var(--color-primary) !important;
    }

    /* ---- Responsive ---- */
    @media (max-width: 768px) {
      .filters-block {
        flex-direction: column;
        align-items: stretch;
        padding: 12px;
      }

      .filters-block__controls {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
      }

      .filters-block__divider { display: none; }

      .filters-block__right {
        justify-content: flex-end;
      }
    }
  `],
})
export class TaskFiltersComponent implements OnInit, OnChanges {
  @Input() viewMode: ViewMode = 'card';
  @Input() initialTitle = '';
  @Input() initialStatus: TaskStatus | '' = '';

  @Output() filterChange = new EventEmitter<FilterChange>();
  @Output() viewModeChange = new EventEmitter<ViewMode>();

  readonly titleCtrl  = new FormControl('', { nonNullable: true });
  readonly statusCtrl = new FormControl<TaskStatus | ''>('', { nonNullable: true });

  readonly statusOptions = TASK_STATUS_OPTIONS;
  readonly statusLabels  = TASK_STATUS_LABELS;

  ngOnInit(): void {
    this.titleCtrl.setValue(this.initialTitle, { emitEvent: false });
    this.statusCtrl.setValue(this.initialStatus, { emitEvent: false });

    this.titleCtrl.valueChanges.pipe(debounceTime(350), distinctUntilChanged()).subscribe(() =>
      this.emit()
    );
    this.statusCtrl.valueChanges.subscribe(() => this.emit());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialTitle'] && !changes['initialTitle'].firstChange) {
      this.titleCtrl.setValue(this.initialTitle, { emitEvent: false });
    }
  }

  clearSearch(): void {
    this.titleCtrl.setValue('');
  }

  private emit(): void {
    this.filterChange.emit({
      title:  this.titleCtrl.value,
      status: this.statusCtrl.value,
    });
  }
}
