import { Badge } from '@/components/ui/badge';
import type { Employee } from '@/types';
import { cn } from '@/lib/utils';

export function StatusBadge({ status }: { status: Employee['status'] }) {
  const statusStyles: Record<Employee['status'], string> = {
    Ativo: 'bg-status-active text-status-active-foreground border-transparent',
    Inativo: 'bg-status-inactive text-status-inactive-foreground border-transparent',
    Suspenso: 'bg-status-suspended text-status-suspended-foreground border-transparent',
  };

  return (
    <Badge
      className={cn(
        'font-medium capitalize',
        statusStyles[status]
      )}
    >
      {status}
    </Badge>
  );
}
