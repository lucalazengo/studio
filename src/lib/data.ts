import type { Employee } from '@/types';

export const employees: Employee[] = [
  {
    id: 'EMP001',
    photoUrl: 'https://picsum.photos/seed/1/100/100',
    photoHint: 'woman face',
    name: 'Ana Silva',
    role: 'Gerente de Vendas',
    status: 'Ativo',
    expiryDate: '2025-12-31',
    department: 'Vendas',
    businessUnit: 'Varejo',
    phone: '(11) 98765-4321',
  },
  {
    id: 'EMP002',
    photoUrl: 'https://picsum.photos/seed/2/100/100',
    photoHint: 'man face',
    name: 'Bruno Gomes',
    role: 'Desenvolvedor Frontend',
    status: 'Ativo',
    expiryDate: '2026-06-15',
    department: 'Tecnologia',
    businessUnit: 'Software',
    phone: '(21) 91234-5678',
  },
  {
    id: 'EMP003',
    photoUrl: 'https://picsum.photos/seed/3/100/100',
    photoHint: 'woman face',
    name: 'Carla Dias',
    role: 'Analista de Marketing',
    status: 'Inativo',
    expiryDate: '2024-08-20',
    department: 'Marketing',
    businessUnit: 'Serviços',
    phone: '(31) 95555-1212',
  },
  {
    id: 'EMP004',
    photoUrl: 'https://picsum.photos/seed/4/100/100',
    photoHint: 'man face',
    name: 'Daniel Costa',
    role: 'Designer UX/UI',
    status: 'Suspenso',
    expiryDate: '2025-02-28',
    department: 'Produto',
    businessUnit: 'Software',
    phone: '(41) 94444-3333',
  },
  {
    id: 'EMP005',
    photoUrl: 'https://picsum.photos/seed/5/100/100',
    photoHint: 'woman face',
    name: 'Elisa Ferreira',
    role: 'Gerente de RH',
    status: 'Ativo',
    expiryDate: '2027-01-10',
    department: 'Recursos Humanos',
    businessUnit: 'Corporativo',
    phone: '(51) 93333-2222',
  },
];

export function getEmployeeById(id: string): Employee | undefined {
  return employees.find((employee) => employee.id === id);
}
