'use client'; 

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmployeeTable } from '@/components/app/employee-table';
import { NewEmployeeDialog } from '@/components/app/new-employee-dialog';
import { fetchEmployees, updateEmployeeStatus } from '@/lib/employees';
import { Employee } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { EditEmployeeDialog } from './edit-employee-dialog';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function EmployeesClient() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // --- Estados de Filtro ---
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  // --- Estados dos Modais ---
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);

  // --- Busca de Dados ---
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // --- Lógica de Filtragem ---
  // Usamos useMemo para otimizar e não recalcular a cada renderização simples
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      // 1. Filtro por Texto (Nome ou Email)
      const matchesSearch = 
        employee.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 2. Filtro por Status
      const matchesStatus = statusFilter === 'todos' || employee.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [employees, searchTerm, statusFilter]);

  // --- Handlers (Iguais aos anteriores) ---
  const handleEdit = (employee: Employee) => {
    setEmployeeToEdit(employee);
    setIsEditOpen(true);
  };

  const handleUpdateSuccess = (updatedEmployee: Employee) => {
    setEmployees((current) =>
      current.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
    );
    setIsEditOpen(false);
    toast({ title: 'Funcionário atualizado!' });
  };

  const handleToggleStatus = async (employee: Employee) => {
    const newStatus = employee.status === 'Ativo' ? 'Inativo' : 'Ativo';
    setEmployees((current) =>
      current.map((emp) => (emp.id === employee.id ? { ...emp, status: newStatus } : emp))
    );

    try {
      await updateEmployeeStatus(employee.id, newStatus);
      toast({ title: `Funcionário ${newStatus.toLowerCase()}!` });
    } catch (error) {
      toast({ title: 'Erro!', description: 'Não foi possível atualizar o status.', variant: 'destructive' });
      setEmployees((current) =>
        current.map((emp) => (emp.id === employee.id ? { ...emp, status: employee.status } : emp))
      );
    }
  };
  
  return (
    <div className="flex flex-col gap-6">
      
      {/* Cabeçalho e Botão Novo */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Funcionários</h1>
          <p className="text-muted-foreground">Gerencie sua equipe, crachás e acessos.</p>
        </div>
        <NewEmployeeDialog />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Listagem de Colaboradores</CardTitle>
        </CardHeader>
        <CardContent>
          
          {/* --- BARRA DE FERRAMENTAS (Filtros) --- */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            
            {/* Campo de Busca */}
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtro de Status */}
            <div className="w-full md:w-[200px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Filtrar Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="Ativo">Ativos</SelectItem>
                  <SelectItem value="Inativo">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>

          {/* Tabela */}
          {isLoading ? (
            <div className="h-32 flex items-center justify-center text-muted-foreground">
              Carregando dados...
            </div>
          ) : filteredEmployees.length > 0 ? (
            <EmployeeTable 
              employees={filteredEmployees} 
              onEditEmployee={handleEdit} 
              onToggleStatus={handleToggleStatus} 
            />
          ) : (
            <div className="h-32 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
              <p>Nenhum funcionário encontrado.</p>
              <p className="text-sm">Tente mudar os filtros ou cadastre um novo.</p>
            </div>
          )}

        </CardContent>
      </Card>

      {/* Modal de Edição */}
      {employeeToEdit && (
        <EditEmployeeDialog
          employee={employeeToEdit}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          onEmployeeUpdated={handleUpdateSuccess}
        />
      )}
    </div>
  );
}