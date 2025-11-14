import { z } from 'zod';

export const employeeSchema = z.object({
  // --- CAMPOS OBRIGATÓRIOS (is_nullable: NO no Supabase) ---
  
  // 'nome' no banco
  name: z.string().min(2, 'O nome completo é obrigatório.'),

  // 'id' no banco (convertendo string do input para number)
  id: z.coerce
    .number({
      required_error: 'A Matrícula (ID) é obrigatória.',
      invalid_type_error: 'A Matrícula deve ser um número.',
    })
    .min(1, 'A Matrícula é obrigatória.'),

  // 'email' no banco
  email: z
    .string({ required_error: 'O email é obrigatório.' })
    .email('Formato de email inválido.'),

  // 'bi_Nr' no banco
  bi_Nr: z
    .string({ required_error: 'O Nº do Documento é obrigatório.' })
    .min(3, 'O Nº do Documento é obrigatório.'),

  // --- CAMPOS OPCIONAIS (is_nullable: YES no Supabase) ---
  
  role: z.string().optional(),
  department: z.string().optional(),
  businessUnit: z.string().optional(),
  phone: z.string().optional(),
  
  expiryDate: z.date().optional(),
  
  status: z.enum(['Ativo', 'Inativo']).default('Ativo'),
  
  photoUrl: z.string().optional().nullable(),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;