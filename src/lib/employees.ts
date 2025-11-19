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

// --- ARQUIVO ATUALIZADO AQUI ---

/**
 * ATUALIZA um funcionário completo.
 * ✅ Retorna o funcionário atualizado.
 */
export async function updateEmployee(id: number, input: EmployeeFormValues): Promise<Employee> {
  const { data, error } = await supabase
    .from('funcionarios')
    .update(input)
    .eq('id', id)
    .select()
    .single(); // Garante que o registro atualizado seja retornado

  if (error) {
    console.error('Erro ao atualizar funcionário:', error);
    throw error;
  }

  return data as Employee;
}

/**
 * ATUALIZA apenas o status de um funcionário.
 * ✅ Retorna o funcionário atualizado.
 */
export async function updateEmployeeStatus(
  id: number,
  status: Employee['status']
): Promise<Employee> {
  const { data, error } = await supabase
    .from('funcionarios')
    .update({ status })
    .eq('id', id)
    .select()
    .single(); // Garante que o registro atualizado seja retornado
    
  if (error) {
    console.error('Erro ao atualizar status:', error);
    throw error;
  }
  return data as Employee;
}