import { z } from 'zod';

export const employeeSchema = z.object({
  nome: z.string().min(2, 'O nome completo é obrigatório.'),
  email: z
    .string({ required_error: 'O email é obrigatório.' })
    .email('Formato de email inválido.'),
  bi_nr: z
    .string({ required_error: 'O Nº do Documento é obrigatório.' })
    .min(3, 'O Nº do Documento é obrigatório.'),
  role: z.string().optional(),
  departmento: z.string().optional(),
  
  // ✅ ATUALIZADO: Lista restrita de opções
  unidade_negocio: z.enum(['RIKAUTO', 'GESGLOBAL', 'ABRECOME'], {
    errorMap: () => ({ message: 'Selecione uma unidade válida.' }),
  }),

  telefone: z.string().optional(),
  expiry_date: z.date().optional().nullable(),
  status: z.enum(['Ativo', 'Inativo']).default('Ativo'),
  photo_url: z.string().optional().nullable(),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;