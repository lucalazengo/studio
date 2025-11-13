import { z } from 'zod';

export const employeeSchema = z.object({
  name: z.string().min(2, 'O nome completo é obrigatório.'),
  role: z.string().min(2, 'A função é obrigatória.'),
  department: z.string().min(2, 'O departamento é obrigatório.'),
  businessUnit: z.string().min(2, 'A unidade de negócio é obrigatória.'),
  phone: z.string().min(10, 'O telefone deve ser válido.'),
  expiryDate: z.date({
    required_error: 'A data de validade do crachá é obrigatória.',
  }),
  status: z.enum(['Ativo', 'Inativo'], {
    required_error: 'O status é obrigatório.',
  }),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
