import { EmployeeTable } from '@/components/app/employee-table';
import { NewEmployeeDialog } from '@/components/app/new-employee-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { employees } from '@/lib/data';
import { Users, UserCheck, UserX, ShieldAlert } from 'lucide-react';

export default function DashboardPage() {
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === 'Ativo').length;
  const inactiveEmployees = employees.filter((e) => e.status === 'Inativo').length;
  const suspendedEmployees = employees.filter((e) => e.status === 'Suspenso').length;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Gestão de Funcionários
        </h1>
        <NewEmployeeDialog />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Funcionários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funcionários Ativos</CardTitle>
            <UserCheck className="h-4 w-4 text-status-active-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeEmployees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funcionários Inativos</CardTitle>
            <UserX className="h-4 w-4 text-status-inactive-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveEmployees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funcionários Suspensos</CardTitle>
            <ShieldAlert className="h-4 w-4 text-status-suspended-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suspendedEmployees}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Funcionários</CardTitle>
        </CardHeader>
        <CardContent>
          <EmployeeTable />
        </CardContent>
      </Card>
    </main>
  );
}
