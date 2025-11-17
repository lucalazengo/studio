'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useToast } from '@/hooks/use-toast';
import { Employee } from '@/types';
import { createCracha } from '@/lib/crachas';
import { updateEmployeeStatus } from '@/lib/employees'; // Importação corrigida
import { Badge } from '@/components/ui/badge';
import { EditEmployeeDialog } from './edit-employee-dialog';

interface EmployeeTableProps {
  employees: Employee[];
}

export function EmployeeTable({ employees }: EmployeeTableProps) {
  const { toast } = useToast();
  const router = useRouter();

  /* ---------- Estados ---------- */
  const [qrCodeValue, setQrCodeValue] = useState<string | null>(null);
  const [selectedEmployeeQR, setSelectedEmployeeQR] = useState<Employee | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [employeeToDeactivate, setEmployeeToDeactivate] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /* ---------- Handlers ---------- */
  const handleGenerateCracha = async (employee: Employee) => {
    setIsLoading(true);
    setSelectedEmployeeQR(employee);
    try {
      const cracha = await createCracha(employee.id);
      if (cracha?.id) {
        const validationUrl = `${window.location.origin}/validar/${cracha.id}`;
        setQrCodeValue(validationUrl);
      } else {
        toast({ title: 'Erro', description: 'Não foi possível gerar o crachá.', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Erro', description: 'Ocorreu um problema ao gerar o crachá.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEditDialog = (employee: Employee) => {
    setEmployeeToEdit(employee);
    setIsEditOpen(true);
  };

  const handleOpenDeactivateDialog = (employee: Employee) => {
    setEmployeeToDeactivate(employee);
    setIsDeactivateOpen(true);
  };

  const handleDeactivateEmployee = async () => {
    if (!employeeToDeactivate) return;
    try {
      await updateEmployeeStatus(employeeToDeactivate.id, 'Inativo');
      toast({ title: 'Funcionário Desativado', description: `${employeeToDeactivate.nome} foi marcado como inativo.` });
      router.refresh();
      setIsDeactivateOpen(false);
    } catch {
      toast({ title: 'Erro', description: 'Não foi possível desativar o funcionário.', variant: 'destructive' });
    }
  };

  /* ---------- Colunas ---------- */
  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: 'nome',
      header: 'Nome Completo',
      cell: ({ row }) => {
        const emp = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={emp.photo_url ?? undefined} alt={emp.nome} />
              <AvatarFallback>{emp.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{emp.nome}</span>
          </div>
        );
      },
    },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'role', header: 'Função' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'Ativo' ? 'default' : 'destructive'}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const emp = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleGenerateCracha(emp)} disabled={isLoading}>
                {isLoading ? 'Gerando...' : 'Gerar Crachá (QR Code)'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleOpenEditDialog(emp)}>Editar Funcionário</DropdownMenuItem>
              {emp.status === 'Ativo' && (
                <DropdownMenuItem className="text-destructive" onClick={() => handleOpenDeactivateDialog(emp)}>
                  Desativar
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({ data: employees, columns, getCoreRowModel: getCoreRowModel() });

  /* ---------- Render ---------- */
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhum funcionário encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal QR Code */}
      <Dialog open={!!qrCodeValue} onOpenChange={(o) => { if (!o) { setQrCodeValue(null); setSelectedEmployeeQR(null); } }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crachá de {selectedEmployeeQR?.nome}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="rounded-lg bg-white p-4">
              {qrCodeValue && <QRCodeSVG value={qrCodeValue} size={256} includeMargin />}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Escaneie este código para validar o crachá.</p>
            <p className="mt-2 text-xs text-muted-foreground break-all">URL: {qrCodeValue}</p>
            <Button onClick={() => window.print()} className="mt-6">Imprimir</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Editar */}
      {employeeToEdit && (
        <EditEmployeeDialog employee={employeeToEdit} open={isEditOpen} onOpenChange={setIsEditOpen} />
      )}

      {/* Modal Confirmar Desativação */}
      <AlertDialog open={isDeactivateOpen} onOpenChange={setIsDeactivateOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              {/* ✅ ERRO CORRIGIDO AQUI (removido o 'd' extra) */}
              Isso marcará {employeeToDeactivate?.nome} como “Inativo”. Ele perderá o acesso temporariamente. Esta ação pode ser revertida (editando o status).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeactivateEmployee}>Confirmar Desativação</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}