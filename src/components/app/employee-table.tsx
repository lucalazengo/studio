'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import type { Employee } from '@/types';
import { MoreHorizontal, Edit, QrCode, ShieldAlert } from 'lucide-react';
import { StatusBadge } from './status-badge';
import { format } from 'date-fns';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchEmployees, updateEmployeeStatus } from '@/lib/employees';
import { useToast } from '@/hooks/use-toast';

function EmployeeActions({ employee, onSuspended }: { employee: Employee; onSuspended: (updated: Employee) => void }) {
  const { toast } = useToast();

  async function handleSuspend() {
    try {
      await updateEmployeeStatus(employee.id, 'Suspenso');
      toast({ title: 'Funcionário suspenso', description: `${employee.name} foi marcado como Suspenso.` });
      onSuspended({ ...employee, status: 'Suspenso' });
    } catch (error) {
      console.error('Erro ao suspender funcionário:', error);
      toast({ title: 'Erro ao suspender', description: 'Não foi possível atualizar o status.', variant: 'destructive' });
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuItem>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <Link href={`/employees/${employee.id}/badge`} passHref>
           <DropdownMenuItem>
              <QrCode className="mr-2 h-4 w-4" />
              Ver Crachá (QR)
            </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSuspend} className="text-destructive focus:text-destructive focus:bg-destructive/10">
          <ShieldAlert className="mr-2 h-4 w-4" />
          Suspender
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function EmployeeTable() {
  const [items, setItems] = useState<Employee[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchEmployees();
        if (mounted) setItems(data);
      } catch (error) {
        console.error('Erro ao carregar funcionários:', error);
        toast({ title: 'Falha ao carregar', description: 'Não foi possível buscar os funcionários.', variant: 'destructive' });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [toast]);

  function handleSuspended(updated: Employee) {
    setItems((prev) => (prev ? prev.map((e) => (e.id === updated.id ? updated : e)) : prev));
  }

  return (
    <div className="rounded-lg border shadow-sm">
      {loading ? (
        <div className="p-6 text-sm text-muted-foreground">Carregando funcionários...</div>
      ) : (
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Foto</TableHead>
            <TableHead>Nome Completo</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data de Validade</TableHead>
            <TableHead className="w-[64px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(items ?? []).map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>
                <Avatar>
                  <AvatarImage src={employee.photoUrl} alt={employee.name} data-ai-hint={employee.photoHint} />
                  <AvatarFallback>
                    {employee.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{employee.name}</TableCell>
              <TableCell>{employee.role}</TableCell>
              <TableCell>
                <StatusBadge status={employee.status} />
              </TableCell>
              <TableCell>
                {format(new Date(employee.expiryDate), 'dd/MM/yyyy')}
              </TableCell>
              <TableCell className="text-right">
                <EmployeeActions employee={employee} onSuspended={handleSuspended} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
      )}
    </div>
  );
}
