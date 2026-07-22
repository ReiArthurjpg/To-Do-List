import { Routes } from '@angular/router';
export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/task/pages/task-list-page.component').then(m => m.TaskListPageComponent) },
  { path: 'tasks/new', loadComponent: () => import('./features/task/pages/task-form-page.component').then(m => m.TaskFormPageComponent) },
  { path: 'tasks/:id/edit', loadComponent: () => import('./features/task/pages/task-form-page.component').then(m => m.TaskFormPageComponent) },
  { path: '**', redirectTo: '' }
];
