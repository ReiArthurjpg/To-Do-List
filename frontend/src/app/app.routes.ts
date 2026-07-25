import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/task/pages/task-list-page.component').then(m => m.TaskListPageComponent),
        title: 'Tarefas — TaskFlow',
      },
      {
        path: 'tasks/new',
        loadComponent: () =>
          import('./features/task/pages/task-form-page.component').then(m => m.TaskFormPageComponent),
        title: 'Nova Tarefa — TaskFlow',
      },
      {
        path: 'tasks/:id/edit',
        loadComponent: () =>
          import('./features/task/pages/task-form-page.component').then(m => m.TaskFormPageComponent),
        title: 'Editar Tarefa — TaskFlow',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
