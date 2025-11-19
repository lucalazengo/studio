'use client'; 

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, UserX } from 'lucide-react';
import { fetchEmployees } from '@/lib/employees';
import { Employee } from '@/types';
import { DashboardCharts } from './dashboard-charts';

export function DashboardClient() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === 'Ativo').length;
  const inactiveEmployees = employees.filter((e) => e.status === 'Inativo').length;

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-muted-foreground">Carregando Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6"> 
      <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      {/* Cards de Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Funcionários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Cadastrados no sistema</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeEmployees}</div>
            <p className="text-xs text-muted-foreground">Com acesso permitido</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inativos</CardTitle>
            <UserX className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveEmployees}</div>
            <p className="text-xs text-muted-foreground">Bloqueados ou desligados</p>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Gráficos - Passa todos os funcionários */}
      <DashboardCharts employees={employees} />
    </div>
  );
}