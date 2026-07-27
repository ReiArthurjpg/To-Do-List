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
    ],
  },
  { path: '**', redirectTo: '' },
];
