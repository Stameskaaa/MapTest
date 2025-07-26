import { format, isValid } from 'date-fns';

export function formatDateTime(input: unknown): string {
  const date = input instanceof Date ? input : new Date(String(input));

  if (!isValid(date)) {
    return '';
  }

  return format(date, 'dd.MM.yyyy');
}
