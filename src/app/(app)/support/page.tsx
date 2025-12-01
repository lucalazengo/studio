'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { FileText, Download, Users, Building2, QrCode, Ban, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchSupportStats, type SupportStats } from '@/lib/stats';
import { fetchEmployees } from '@/lib/employees';
import { fetchAllScanLogs } from '@/lib/logs';
import * as XLSX from 'xlsx';

export default function SupportPage() {
  const { toast } = useToast();
  
  // --- Estados para Estatísticas ---
  const [stats, setStats] = useState<SupportStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Buscar estatísticas ao montar
  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchSupportStats();
        setStats(data);
      } catch (error) {
        console.error(error);
        toast({ 
          title: 'Erro', 
          description: 'Não foi possível carregar as estatísticas.', 
          variant: 'destructive' 
        });
      } finally {
        setLoadingStats(false);
      }
    }
    loadStats();
  }, [toast]);

  // --- Helper para Exportar Excel ---
  const exportToExcel = (data: unknown[], fileName: string, sheetName: string) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  // --- Helper para Exportar CSV ---
  const exportToCSV = (headers: string[], rows: string[][], fileName: string) => {
     const csvContent = [
        headers.join(','),
        ...rows.map(e => e.join(','))
     ].join('\n');
     
     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
     const url = URL.createObjectURL(blob);
     const link = document.createElement('a');
     link.setAttribute('href', url);
     link.setAttribute('download', `${fileName}.csv`);
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
  };

  // --- Funções de Exportação ---
  const handleExportEmployees = async (format: 'csv' | 'xlsx') => {
    try {
      toast({ title: 'Gerando relatório...', description: 'Aguarde um momento.' });
      const employees = await fetchEmployees();
      
      const data = employees.map(emp => ({
        ID: emp.id,
        Nome: emp.nome,
        Email: emp.email,
        BI: emp.bi_nr,
        Cargo: emp.role || '',
        Departamento: emp.departmento || '',
        Unidade: emp.unidade_negocio || '',
        Status: emp.status,
        'Criado Em': new Date(emp.created_at).toLocaleDateString('pt-AO')
      }));

      if (format === 'xlsx') {
        exportToExcel(data, 'funcionarios_relatorio', 'Funcionários');
      } else {
        const headers = Object.keys(data[0]);
        const rows = data.map(item => Object.values(item).map(val => `"${val}"`));
        exportToCSV(headers, rows, 'funcionarios_relatorio');
      }
      
      toast({ title: 'Sucesso', description: 'Relatório de funcionários baixado.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Erro', description: 'Falha ao exportar relatório.', variant: 'destructive' });
    }
  };

  const handleExportStats = (format: 'csv' | 'xlsx') => {
    if (!stats) return;
    
    try {
      const summaryData = [
        { Metrica: 'Total Usuarios', Valor: stats.totalUsers },
        { Metrica: 'Usuarios QR Ativos', Valor: stats.activeQrUsers },
        { Metrica: 'Usuarios QR Inativos', Valor: stats.inactiveQrUsers },
      ];

      const companyData = stats.usersByCompany.map(c => ({
        Empresa: c.company,
        Quantidade: c.count
      }));

      if (format === 'xlsx') {
        const wb = XLSX.utils.book_new();
        const ws1 = XLSX.utils.json_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, ws1, 'Resumo');
        const ws2 = XLSX.utils.json_to_sheet(companyData);
        XLSX.utils.book_append_sheet(wb, ws2, 'Por Empresa');
        XLSX.writeFile(wb, 'estatisticas_suporte.xlsx');
      } else {
        // CSV simplificado (combina os dois)
        const headers = ['Metrica/Empresa', 'Valor/Quantidade'];
        const rows = [
            ...summaryData.map(d => [d.Metrica, d.Valor.toString()]),
            ['---', '---'],
            ...companyData.map(d => [d.Empresa, d.Quantidade.toString()])
        ];
        exportToCSV(headers, rows, 'estatisticas_suporte');
      }

       toast({ title: 'Sucesso', description: 'Relatório de estatísticas baixado.' });
    } catch (error) {
       console.error(error);
       toast({ title: 'Erro', description: 'Falha ao exportar estatísticas.', variant: 'destructive' });
    }
  };

  const handleExportScans = async (format: 'csv' | 'xlsx') => {
    try {
      toast({ title: 'Gerando relatório de acessos...', description: 'Isso pode levar alguns segundos.' });
      const logs = await fetchAllScanLogs();
      
      const data = logs.map(log => {
        const emp = log.crachas?.funcionarios;
        const mapLink = (log.latitude && log.longitude) 
          ? `https://www.google.com/maps?q=${log.latitude},${log.longitude}` 
          : '';

        return {
          'Data/Hora': new Date(log.scanned_at).toLocaleString('pt-AO'),
          'Funcionário': emp?.nome || 'Desconhecido',
          'Cargo': emp?.role || '',
          'Unidade': emp?.unidade_negocio || '',
          'Departamento': emp?.departmento || '',
          'Dispositivo': log.user_agent || 'Desconhecido',
          'Latitude': log.latitude || '',
          'Longitude': log.longitude || '',
          'Link Mapa': mapLink
        };
      });

      if (format === 'xlsx') {
        exportToExcel(data, 'historico_acessos', 'Acessos');
      } else {
        if (data.length === 0) {
             toast({ title: 'Aviso', description: 'Nenhum registro encontrado.' });
             return;
        }
        const headers = Object.keys(data[0]);
        const rows = data.map(item => Object.values(item).map(val => `"${val}"`));
        exportToCSV(headers, rows, 'historico_acessos');
      }

      toast({ title: 'Sucesso', description: 'Relatório de acessos baixado.' });

    } catch (error) {
      console.error(error);
      toast({ title: 'Erro', description: 'Falha ao exportar histórico de acessos.', variant: 'destructive' });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Central de Relatórios</h1>
          <p className="text-muted-foreground">
            Acompanhe as métricas e exporte dados do sistema.
          </p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Extrair Relatórios
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Users className="mr-2 h-4 w-4" />
                <span>Lista de Funcionários</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => handleExportEmployees('xlsx')}>
                  Excel (.xlsx)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportEmployees('csv')}>
                  CSV (.csv)
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <MapPin className="mr-2 h-4 w-4" />
                <span>Histórico de Acessos</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => handleExportScans('xlsx')}>
                   Excel (.xlsx)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportScans('csv')}>
                   CSV (.csv)
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Download className="mr-2 h-4 w-4" />
                <span>Estatísticas Gerais</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => handleExportStats('xlsx')}>
                   Excel (.xlsx)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportStats('csv')}>
                   CSV (.csv)
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* --- SEÇÃO DE ESTATÍSTICAS --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingStats ? '...' : stats?.totalUsers}
            </div>
            <p className="text-xs text-muted-foreground">Cadastrados no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários QR Ativos</CardTitle>
            <QrCode className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">
              {loadingStats ? '...' : stats?.activeQrUsers}
            </div>
            <p className="text-xs text-muted-foreground">Crachás válidos</p>
          </CardContent>
        </Card>

        <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários QR Inativos</CardTitle>
            <Ban className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">
              {loadingStats ? '...' : stats?.inactiveQrUsers}
            </div>
            <p className="text-xs text-muted-foreground">Crachás revogados/inativos</p>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 lg:col-span-1">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">
              {loadingStats ? '...' : stats?.usersByCompany.length}
            </div>
            <p className="text-xs text-muted-foreground">Unidades de negócio</p>
          </CardContent>
        </Card>
      </div>
      
      {/* --- DETALHE POR EMPRESA --- */}
      {!loadingStats && stats && stats.usersByCompany.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Usuários por Empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {stats.usersByCompany.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 border rounded-lg bg-muted/20">
                  <span className="font-medium truncate pr-2" title={item.company}>{item.company}</span>
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm font-bold">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
