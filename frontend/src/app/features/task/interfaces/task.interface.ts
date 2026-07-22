import { TaskStatus } from '../models/task-status.model';
export interface Task { id: number; title: string; description?: string; status: TaskStatus; createdAt: string; updatedAt: string; }
export interface TaskRequest { title: string; description?: string; status: TaskStatus; }
export interface Page<T> { content: T[]; totalElements: number; size: number; number: number; }
