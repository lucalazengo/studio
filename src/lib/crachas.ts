import { supabase } from '@/lib/supabase/client';
import type { Cracha } from '@/types'; // Importamos o tipo que definimos antes

/**
 * Busca os detalhes de um crachá e os dados do funcionário associado.
 * Esta função é pública e será usada pela página de validação.
 * @param id - O UUID do crachá (vindo do QR Code)
 */
export async function getCrachaDetails(id: string): Promise<Cracha | null> {
  if (!id) return null;

  const { data, error } = await supabase
    .from('crachas')
    .select(
      `
      id,
      is_active,
      issued_at,
      funcionarios (
        nome,
        photo_url,
        role,
        status,
        expiry_date
      )
    `
    )
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Erro ao buscar detalhes do crachá:', error?.message);
    return null;
  }

  // O Supabase retorna 'funcionarios' como um objeto, o que é perfeito.
  return data as unknown as Cracha;
}

/**
 * Cria um novo registro de crachá para um funcionário.
 * Esta função é para o admin e requer autenticação (definida pela RLS).
 * @param funcionario_id - O ID (matrícula) do funcionário
 */
export async function createCracha(funcionario_id: number): Promise<{ id: string } | null> {
  const { data, error } = await supabase
    .from('crachas')
    .insert({ funcionario_id })
    .select('id') // Só precisamos que ele retorne o novo UUID
    .single();

  if (error) {
    // Trata o caso de "crachá já existe" (definimos a coluna como UNIQUE)
    if (error.code === '23505') {
      console.warn('Este funcionário já possui um crachá.');
      // Podemos optar por buscar o crachá existente
      const existing = await supabase
        .from('crachas')
        .select('id')
        .eq('funcionario_id', funcionario_id)
        .single();
      return existing.data;
    }
    console.error('Erro ao criar crachá:', error);
    return null;
  }

  return data;
}