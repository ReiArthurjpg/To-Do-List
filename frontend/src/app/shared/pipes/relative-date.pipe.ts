import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

@Pipe({ name: 'relativeDate', standalone: true, pure: true })
export class RelativeDatePipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) return '—';
    try {
      return formatDistanceToNow(new Date(value), { addSuffix: true, locale: ptBR });
    } catch {
      return '—';
    }
  }
}
