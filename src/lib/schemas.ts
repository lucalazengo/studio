import { z } from 'zod';

// Este schema valida o *formulário* de novo funcionário
export const employeeSchema = z.object({
  // ID foi removido. O banco de dados cuida disso.
  
  nome: z.string().min(2, 'O nome completo é obrigatório.'),
  
  email: z
    .string({ required_error: 'O email é obrigatório.' })
    .email('Formato de email inválido.'),
  
  // Nome da coluna no banco: bi_nr
  bi_nr: z
    .string({ required_error: 'O Nº do Documento é obrigatório.' })
    .min(3, 'O Nº do Documento é obrigatório.'),

  // Campos opcionais
  role: z.string().optional(),
  departmento: z.string().optional(),
  
  // Nome da coluna no banco: unidade_negocio
  unidade_negocio: z.string().optional(),
  telefone: z.string().optional(),
  
  // Nome da coluna no banco: expiry_date
  expiry_date: z.date().optional().nullable(),
  
  status: z.enum(['Ativo', 'Inativo']).default('Ativo'),
  
  photo_url: z.string().optional().nullable(),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;