// Esta interface define o formato dos dados vindos da tabela 'funcionarios'
export interface Employee {
  id: number;
  nome: string;
  email: string;
  bi_nr: string;
  role: string | null;
  departmento: string | null;
  unidade_negocio: string | null;
  telefone: string | null;
  status: 'Ativo' | 'Inativo' | 'Suspenso'; // Ajuste se tiver mais status
  expiry_date: string | null; // O Supabase retorna datas como string
  photo_url: string | null;
  created_at: string;
}

// Esta interface define os dados do crachá
export interface Cracha {
  id: string; // O UUID
  funcionario_id: number;
  issued_at: string;
  is_active: boolean;
  
  // Incluímos os dados do funcionário que queremos mostrar na validação
  funcionarios: Pick<Employee, 'nome' | 'photo_url' | 'role' | 'status' | 'expiry_date'>;
}