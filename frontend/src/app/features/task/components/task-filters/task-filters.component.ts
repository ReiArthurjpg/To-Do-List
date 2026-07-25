import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
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
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
  ],
  template: `
    <div class="filters-bar" role="search" aria-label="Filtros de tarefas">
      <!-- Search -->
      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Buscar por título</mat-label>
        <mat-icon matPrefix aria-hidden="true">search</mat-icon>
        <input
          matInput
          [formControl]="titleCtrl"
          placeholder="Ex: Implementar login..."
          aria-label="Buscar tarefas por título"
          autocomplete="off">
        @if (titleCtrl.value) {
          <button
            matSuffix mat-icon-button
            (click)="clearSearch()"
            aria-label="Limpar busca">
            <mat-icon>close</mat-icon>
          </button>
        }
      </mat-form-field>

      <!-- Status filter -->
      <mat-form-field appearance="outline" class="status-field">
        <mat-label>Status</mat-label>
        <mat-select [formControl]="statusCtrl" aria-label="Filtrar por status">
          <mat-option value="">Todos os status</mat-option>
          @for (s of statusOptions; track s) {
            <mat-option [value]="s">{{ statusLabels[s] }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <!-- View Toggle -->
      <mat-button-toggle-group
        [value]="viewMode"
        (change)="viewModeChange.emit($event.value)"
        aria-label="Modo de visualização"
        class="view-toggle">
        <mat-button-toggle value="card" matTooltip="Visualizar em cards" aria-label="Cards">
          <mat-icon>grid_view</mat-icon>
        </mat-button-toggle>
        <mat-button-toggle value="table" matTooltip="Visualizar em lista" aria-label="Tabela">
          <mat-icon>view_list</mat-icon>
        </mat-button-toggle>
      </mat-button-toggle-group>
    </div>
  `,
  styles: [`
    .filters-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }

    .search-field {
      flex: 1;
      min-width: 240px;
    }

    .status-field {
      width: 200px;
      flex-shrink: 0;

      @media (max-width: 600px) { width: 100%; }
    }

    .view-toggle {
      flex-shrink: 0;
      border-radius: 8px !important;
      overflow: hidden;
      border: 1px solid var(--color-border) !important;

      ::ng-deep {
        .mat-button-toggle { border: none !important; }
        .mat-button-toggle-button { height: 48px !important; }
        .mat-button-toggle-checked { background: var(--color-primary-light) !important; color: var(--color-primary) !important; }
      }
    }

    @media (max-width: 600px) {
      .filters-bar { flex-direction: column; align-items: stretch; }
      .search-field { min-width: 0; }
      .view-toggle { align-self: flex-end; }
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
