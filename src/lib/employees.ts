import { supabase } from '@/lib/supabase/client';
// Assegure-se que o tipo 'Employee' está correto ou importe-o adequadamente
import type { Employee } from '@/types'; 

// --- FIX 1: NOME DA TABELA CORRIGIDO ---
export async function fetchEmployees(): Promise<Employee[]> {
  const { data, error } = await supabase
    .from('Funcionarios') // ❌ 'employees' -> ✅ 'Funcionarios'
    .select('*')
    // 💡 Bônus: Mudei a ordenação para 'nome' (coluna real)
    .order('nome', { ascending: true }); 
  if (error) throw error;
  return (data ?? []) as Employee[];
}

// --- FIX 2: NOME DA TABELA CORRIGIDO ---
export async function updateEmployeeStatus(
  // 💡 Bônus: Mudei para 'number' para ser consistente com o 'id' (bigint)
  id: number, 
  status: Employee['status']
): Promise<void> {
  const { error } = await supabase
    .from('Funcionarios') // ❌ 'employees' -> ✅ 'Funcionarios'
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

// --- FIX 3: TIPO DE INPUT E FUNÇÃO CORRIGIDOS ---

// Este tipo agora reflete o objeto que o 'new-employee-dialog.tsx'
// está enviando, que são os nomes das colunas do banco.
export type CreateEmployeeInput = {
  id: number;
  nome: string;
  email: string;
  bi_Nr: string;
  role?: string | null;
  departmento?: string | null; // <-- Nome da coluna do banco
  unidadeNegocio?: string | null; // <-- Nome da coluna do banco
  telefone?: string | null; // <-- Nome da coluna do banco
  status?: 'Ativo' | 'Inativo'; // O schema trata 'Suspenso' se necessário
  expiryDate?: Date | string | null; // Aceita Date ou string
  photoUrl?: string | null;
  photoHint?: string | null;
};

export async function createEmployee(input: CreateEmployeeInput) {
  // O 'input' que vem do 'new-employee-dialog.tsx'
  // já está no formato do banco (ex: { nome: '...', departmento: '...' })
  // Não precisamos da variável 'payload' nem de mapeamento duplicado.

  const { data, error } = await supabase
    .from('Funcionarios') // ❌ 'employees' -> ✅ 'Funcionarios'
    .insert(input)        // ✅ Passa o objeto 'input' diretamente
    .select('*')
    .single();
    
  if (error) {
    // Log do erro real para facilitar o debug
    console.error('Erro detalhado do Supabase:', error);
    throw error;
  }
  
  return data as unknown as Employee;
}