import { Injectable, computed, inject, signal } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Task, TaskStats } from '../interfaces/task.interface';
import { TaskStatus } from '../models/task-status.model';

@Injectable({ providedIn: 'root' })
export class TaskStoreService {
  private readonly service = inject(TaskService);

  // --- State Signals ---
  readonly tasks       = signal<Task[]>([]);
  readonly allTasks    = signal<Task[]>([]);   // for stats
  readonly loading     = signal(false);
  readonly statsLoading= signal(false);
  readonly totalElements = signal(0);
  readonly page        = signal(0);
  readonly size        = signal(12);
  readonly titleFilter = signal('');
  readonly statusFilter= signal<TaskStatus | ''>('');
  readonly sortField   = signal('createdAt');
  readonly sortDir     = signal<'asc' | 'desc'>('desc');

  // --- Computed ---
  readonly stats = computed<TaskStats>(() => {
    const all = this.allTasks();
    return {
      total:      all.length,
      pending:    all.filter(t => t.status === 'PENDING').length,
      inProgress: all.filter(t => t.status === 'IN_PROGRESS').length,
      done:       all.filter(t => t.status === 'DONE').length,
    };
  });

  readonly isEmpty = computed(() =>
    !this.loading() && this.tasks().length === 0
  );

  readonly sortParam = computed(() =>
    `${this.sortField()},${this.sortDir()}`
  );

  // --- Actions ---
  loadPage(): void {
    this.loading.set(true);
    const status = this.statusFilter() || undefined;
    this.service
      .findAll(this.page(), this.size(), this.titleFilter(), status, this.sortParam())
      .subscribe({
        next: p => {
          this.tasks.set(p.content);
          this.totalElements.set(p.totalElements);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  loadStats(): void {
    this.statsLoading.set(true);
    this.service.findAllForStats().subscribe({
      next:  tasks => { this.allTasks.set(tasks); this.statsLoading.set(false); },
      error: ()    => this.statsLoading.set(false),
    });
  }

  resetAndLoad(): void {
    this.page.set(0);
    this.loadPage();
  }

  deleteTask(id: number): void {
    this.service.delete(id).subscribe(() => {
      this.loadPage();
      this.loadStats();
    });
  }

  setPage(p: number, s: number): void {
    this.page.set(p);
    this.size.set(s);
    this.loadPage();
  }

  setSort(field: string): void {
    if (this.sortField() === field) {
      this.sortDir.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDir.set('desc');
    }
    this.resetAndLoad();
  }
}
