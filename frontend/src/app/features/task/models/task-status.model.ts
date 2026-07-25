export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE';

export const TASK_STATUS_OPTIONS: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'DONE'];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  PENDING:     'Pendente',
  IN_PROGRESS: 'Em andamento',
  DONE:        'Concluída',
};

export const TASK_STATUS_ORDER: Record<TaskStatus, number> = {
  PENDING:     0,
  IN_PROGRESS: 1,
  DONE:        2,
};
