import { supabase } from '@/lib/supabase/client';
import type { Employee } from '@/types';
import type { EmployeeFormValues } from './schemas';

export type CreateEmployeeInput = EmployeeFormValues;

export async function fetchEmployees(): Promise<Employee[]> {
  const { data, error } = await supabase
    .from('funcionarios')
    .select('*')
    .order('nome', { ascending: true });
    
  if (error) throw error;
  return (data ?? []) as Employee[];
}

// FUNÇÃO DE CRIAÇÃO (Já existe)
export async function createEmployee(input: CreateEmployeeInput) {
  const { data, error } = await supabase
    .from('funcionarios')
    .insert(input)
    .select('*')
    .single();
    
  if (error) {
    console.error('Erro detalhado do Supabase:', error);
    throw error;
  }
  
  return data as unknown as Employee;
}

// --- ⬇️ NOVAS FUNÇÕES AQUI ⬇️ ---

/**
 * ATUALIZA um funcionário completo com novos dados.
 * 'input' deve ser do tipo EmployeeFormValues (do schema).
 */
export async function updateEmployee(id: number, input: EmployeeFormValues) {
  const { data, error } = await supabase
    .from('funcionarios')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar funcionário:', error);
    throw error;
  }

  return data as unknown as Employee;
}

/**
 * ATUALIZA apenas o status de um funcionário.
 * (Usado para "Desativar" / "Reativar")
 */
export async function updateEmployeeStatus(
  id: number,
  status: Employee['status']
): Promise<void> {
  const { error } = await supabase
    .from('funcionarios')
    .update({ status })
    .eq('id', id);
    
  if (error) {
    console.error('Erro ao atualizar status:', error);
    throw error;
  }
}

/**
 * DELETA permanentemente um funcionário.
 * (Cuidado ao usar! "Desativar" é mais seguro.)
 */
export async function deleteEmployee(id: number): Promise<void> {
  const { error } = await supabase
    .from('funcionarios')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar funcionário:', error);
    throw error;
  }
}