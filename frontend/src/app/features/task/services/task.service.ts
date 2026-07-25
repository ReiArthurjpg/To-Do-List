import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Page, Task, TaskRequest } from '../interfaces/task.interface';
import { TaskStatus } from '../models/task-status.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/tasks`;

  findAll(
    page = 0,
    size = 12,
    title = '',
    status?: TaskStatus,
    sort = 'createdAt,desc'
  ): Observable<Page<Task>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort);

    if (title.trim()) params = params.set('title', title.trim());
    if (status)       params = params.set('status', status);

    return this.http.get<Page<Task>>(this.baseUrl, { params });
  }

  findById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/${id}`);
  }

  create(payload: TaskRequest): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, payload);
  }

  update(id: number, payload: TaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /** Fetch all tasks for stats computation (unfiltered, large page) */
  findAllForStats(): Observable<Task[]> {
    const params = new HttpParams()
      .set('page', 0)
      .set('size', 1000)
      .set('sort', 'id,asc');
    return this.http.get<Page<Task>>(this.baseUrl, { params }).pipe(
      map(p => p.content)
    );
  }
}
