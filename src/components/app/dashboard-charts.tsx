'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, DonutChart, Legend } from '@tremor/react';
import { Employee } from '@/types';

// Helper: Transforma dados para que cada unidade seja uma categoria (cor diferente)
function transformDataForColorBars(employees: Employee[]) {
  // Inicializa contadores
  const counts: Record<string, number> = {
    'RIKAUTO': 0,
    'GESGLOBAL': 0,
    'ABRECOME': 0
  };

  // Conta funcionários
  employees.forEach(emp => {
    const unit = emp.unidade_negocio || 'Outros';
    if (counts[unit] !== undefined) {
      counts[unit]++;
    } else {
      counts[unit] = 1; // Caso tenha alguma unidade fora do padrão
    }
  });

  // Retorna no formato que o Tremor precisa para colorir separadamente
  // Criamos um único objeto onde as chaves são as unidades
  return [
    {
      name: "Total", // Label do eixo X (invisível ou genérico)
      'RIKAUTO': counts['RIKAUTO'],
      'GESGLOBAL': counts['GESGLOBAL'],
      'ABRECOME': counts['ABRECOME'],
    }
  ];
}

function getCountByStatus(employees: Employee[]) {
  const active = employees.filter(e => e.status === 'Ativo').length;
  const inactive = employees.filter(e => e.status === 'Inativo').length;

  return [
    { name: 'Ativos', value: active },
    { name: 'Inativos', value: inactive },
  ];
}

export function DashboardCharts({ employees }: { employees: Employee[] }) {
  const unitData = transformDataForColorBars(employees);
  const statusData = getCountByStatus(employees);
  
  // Cores: Ativo (Verde), Inativo (Vermelho/Rose)
  const statusColors = ['emerald', 'rose']; 
  
  // Cores: RIKAUTO (Verde), GESGLOBAL (Azul), ABRECOME (Laranja) - Matching theme
  const unitColors = ['emerald', 'blue', 'amber'];
  const unitCategories = ['RIKAUTO', 'GESGLOBAL', 'ABRECOME'];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      
      {/* Gráfico 1: Unidades (Barras Coloridas) */}
      <Card>
        <CardHeader>
          <CardTitle>Funcionários por Unidade de Negócio</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart
            className="mt-4 h-72"
            data={unitData}
            index="name"
            categories={unitCategories} // Cada unidade é uma categoria
            colors={unitColors} // Cada categoria ganha uma cor
            yAxisWidth={40}
            showAnimation={true}
            valueFormatter={(value) => `${value}`}
          />
          <div className="mt-4 flex justify-center">
             <Legend categories={unitCategories} colors={unitColors} />
          </div>
        </CardContent>
      </Card>

      {/* Gráfico 2: Status (Donut) */}
      <Card>
        <CardHeader>
          <CardTitle>Status dos Funcionários</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <DonutChart
            className="mt-6 h-60"
            data={statusData}
            category="value"
            index="name"
            colors={statusColors}
            showLabel={true}
            showAnimation={true}
            valueFormatter={(number) => `${number}`}
          />
          <div className="mt-6">
            <Legend categories={['Ativos', 'Inativos']} colors={statusColors} />
          </div>
        </CardContent>
      </Card>

    </div>
  );
}