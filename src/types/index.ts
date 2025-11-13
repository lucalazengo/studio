export type Employee = {
  id: string;
  photoUrl: string;
  photoHint: string;
  name: string;
  role: string;
  status: 'Ativo' | 'Inativo' | 'Suspenso';
  expiryDate: string;
  department: string;
  businessUnit: string;
  phone: string;
};
