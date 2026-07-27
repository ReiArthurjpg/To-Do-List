import { Pipe, PipeTransform } from '@angular/core';
import { TaskStatus } from '../../features/task/models/task-status.model';

const LABELS: Record<TaskStatus, string> = {
  PENDING:     'Pendente',
  IN_PROGRESS: 'Em andamento',
  DONE:        'Concluída',
};

@Pipe({ name: 'taskStatusLabel', standalone: true, pure: true })
export class TaskStatusLabelPipe implements PipeTransform {
  transform(value: TaskStatus): string {
    return LABELS[value] ?? value;
  }
}
