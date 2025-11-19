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
  // DialogContent removido daqui pois usamos o PrintableCrachaModal
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
import { useToast } from '@/hooks/use-toast';
import { Employee } from '@/types';
import { createCracha } from '@/lib/crachas';
import { updateEmployeeStatus } from '@/lib/employees';
import { Badge } from '@/components/ui/badge';
import { PrintableCrachaModal } from './printable-cracha-modal'; // Modal atualizado

interface EmployeeTableProps {
  employees: Employee[];
  onEditEmployee: (employee: Employee) => void;
  onToggleStatus: (employee: Employee) => void;
}

export function EmployeeTable({ 
  employees, 
  onEditEmployee, 
  onToggleStatus 
}: EmployeeTableProps) {
  const { toast } = useToast();
  const router = useRouter();

  // --- Estados ---
  const [qrCodeValue, setQrCodeValue] = useState<string | null>(null);
  const [selectedEmployeeQR, setSelectedEmployeeQR] = useState<Employee | null>(null);
  const [currentCrachaId, setCurrentCrachaId] = useState<string | null>(null); // ✅ ID do Crachá

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [employeeToToggle, setEmployeeToToggle] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- Handlers ---
  const handleGenerateCracha = async (employee: Employee) => {
    setIsLoading(true);
    setSelectedEmployeeQR(employee);
    
    try {
      const cracha = await createCracha(employee.id);
      if (cracha && cracha.id) {
        // Salva o ID para passar ao modal de impressão
        setCurrentCrachaId(cracha.id);
        
        const validationUrl = `${window.location.origin}/validar/${cracha.id}`;
        setQrCodeValue(validationUrl);
      } else {
        toast({ title: 'Erro', description: 'Não foi possível gerar o crachá.', variant: 'destructive' });
      }
    } catch (error) {
      console.error(error);
      toast({ title: 'Erro', description: 'Ocorreu um problema ao gerar o crachá.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenConfirmDialog = (employee: Employee) => {
    setEmployeeToToggle(employee);
    setIsConfirmOpen(true);
  };

  const handleConfirmToggle = async () => {
    if (!employeeToToggle) return;
    onToggleStatus(employeeToToggle);
    setIsConfirmOpen(false);
  };

  // --- Colunas ---
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
        const isAtivo = emp.status === 'Ativo';
        
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
              <DropdownMenuItem onClick={() => onEditEmployee(emp)}>Editar Funcionário</DropdownMenuItem>
              <DropdownMenuItem className={!isAtivo ? "text-green-600" : "text-destructive"} onClick={() => handleOpenConfirmDialog(emp)}>
                {isAtivo ? 'Desativar' : 'Ativar'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({ data: employees, columns, getCoreRowModel: getCoreRowModel() });
  
  const confirmDescription = employeeToToggle?.status === 'Ativo'
    ? `Isso marcará ${employeeToToggle?.nome} como "Inativo".`
    : `Isso marcará ${employeeToToggle?.nome} como "Ativo".`;

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

      {/* ✅ Modal de Visualização do Crachá (usa o componente atualizado) */}
      {/* Usamos o componente Dialog nativo apenas para controlar a montagem condicional */}
      <Dialog 
         open={!!qrCodeValue && !!selectedEmployeeQR && !!currentCrachaId} 
         onOpenChange={(open) => {
            if (!open) {
              setQrCodeValue(null);
              setSelectedEmployeeQR(null);
              setCurrentCrachaId(null);
            }
         }}
      >
         {/* Renderizamos o conteúdo se tivermos todos os dados */}
         {selectedEmployeeQR && qrCodeValue && currentCrachaId && (
            <PrintableCrachaModal
               employee={selectedEmployeeQR}
               qrCodeUrl={qrCodeValue}
               crachaId={currentCrachaId}
               open={!!qrCodeValue}
               onOpenChange={(val) => {
                  if(!val) {
                    setQrCodeValue(null);
                    setSelectedEmployeeQR(null);
                    setCurrentCrachaId(null);
                  }
               }}
            />
         )}
      </Dialog>

      {/* Modal Confirmar Desativação */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>{confirmDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmToggle}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}