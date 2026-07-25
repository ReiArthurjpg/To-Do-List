import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';

import { TaskStoreService } from '../store/task-store.service';
import { Task } from '../interfaces/task.interface';
import { TaskStatus } from '../models/task-status.model';
import { TaskCardComponent } from '../components/task-card/task-card.component';
import { TaskStatsComponent } from '../components/task-stats/task-stats.component';
import { TaskFiltersComponent, FilterChange, ViewMode } from '../components/task-filters/task-filters.component';
import { AppSkeletonComponent } from '../../../shared/components/app-skeleton/app-skeleton.component';
import { AppEmptyStateComponent } from '../../../shared/components/app-empty-state/app-empty-state.component';
import { AppChipComponent } from '../../../shared/components/app-chip/app-chip.component';
import { AppConfirmDialogComponent } from '../../../shared/components/app-confirm-dialog/app-confirm-dialog.component';
import { RelativeDatePipe } from '../../../shared/pipes/relative-date.pipe';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-task-list-page',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSortModule,
    TaskCardComponent,
    TaskStatsComponent,
    TaskFiltersComponent,
    AppSkeletonComponent,
    AppEmptyStateComponent,
    AppChipComponent,
    RelativeDatePipe,
  ],
  animations: [
    trigger('cardsAnim', [
      transition('* => *', [
        query('.task-card-wrapper:enter', [
          style({ opacity: 0, transform: 'translateY(16px)' }),
          stagger(50, [animate('260ms ease', style({ opacity: 1, transform: 'translateY(0)' }))]),
        ], { optional: true }),
      ]),
    ]),
  ],
  templateUrl: './list/task-list-page.component.html',
  styleUrl: './list/task-list-page.component.scss',
})
export class TaskListPageComponent implements OnInit {
  private readonly router  = inject(Router);
  private readonly dialog  = inject(MatDialog);
  private readonly snack   = inject(MatSnackBar);
  readonly store = inject(TaskStoreService);

  readonly viewMode = signal<ViewMode>('card');
  readonly displayedColumns = ['title', 'status', 'createdAt', 'updatedAt', 'actions'];

  ngOnInit(): void {
    this.store.loadPage();
    this.store.loadStats();
  }

  onFilterChange(f: FilterChange): void {
    this.store.titleFilter.set(f.title);
    this.store.statusFilter.set(f.status as TaskStatus | '');
    this.store.resetAndLoad();
  }

  onViewModeChange(mode: ViewMode): void {
    this.viewMode.set(mode);
  }

  onPage(event: PageEvent): void {
    this.store.setPage(event.pageIndex, event.pageSize);
  }

  onSort(field: string): void {
    this.store.setSort(field);
  }

  confirmDelete(task: Task): void {
    const ref = this.dialog.open(AppConfirmDialogComponent, {
      data: {
        title:        'Excluir tarefa?',
        message:      `A tarefa "${task.title}" será excluída permanentemente. Esta ação não pode ser desfeita.`,
        confirmLabel: 'Excluir',
        cancelLabel:  'Cancelar',
        danger:       true,
      },
      maxWidth: '420px',
      panelClass: 'confirm-dialog-panel',
    });

    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      this.store.deleteTask(task.id);
      this.snack.open(`Tarefa "${task.title}" excluída com sucesso.`, 'Fechar', {
        duration: 4000,
        panelClass: ['snack-success'],
      });
    });
  }

  get sortIcon(): string {
    return this.store.sortDir() === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  trackById(_: number, task: Task): number {
    return task.id;
  }
}
