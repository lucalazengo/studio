import { supabase } from '@/lib/supabase/client';

export interface CompanyStats {
  company: string;
  count: number;
}

export interface SupportStats {
  totalUsers: number;
  usersByCompany: CompanyStats[];
  activeQrUsers: number;
  inactiveQrUsers: number;
}

export async function fetchSupportStats(): Promise<SupportStats> {
  // 1. Total Users
  const { count: totalUsers, error: totalError } = await supabase
    .from('funcionarios')
    .select('*', { count: 'exact', head: true });

  if (totalError) console.error('Error fetching total users:', totalError);

  // 2. Users by Company (Unidade de Negocio)
  const { data: employees, error: empError } = await supabase
    .from('funcionarios')
    .select('unidade_negocio');
  
  if (empError) console.error('Error fetching employees for company stats:', empError);

  const companyMap = new Map<string, number>();
  employees?.forEach((emp) => {
    const company = emp.unidade_negocio || 'Sem Empresa';
    companyMap.set(company, (companyMap.get(company) || 0) + 1);
  });

  const usersByCompany: CompanyStats[] = Array.from(companyMap.entries()).map(([company, count]) => ({
    company,
    count,
  }));

  // 3. QR Stats
  const { data: qrStats, error: qrError } = await supabase
    .from('crachas')
    .select('is_active');

  if (qrError) console.error('Error fetching QR stats:', qrError);

  let activeQrUsers = 0;
  let inactiveQrUsers = 0;

  qrStats?.forEach((qr) => {
    if (qr.is_active) {
      activeQrUsers++;
    } else {
      inactiveQrUsers++;
    }
  });

  return {
    totalUsers: totalUsers || 0,
    usersByCompany,
    activeQrUsers,
    inactiveQrUsers,
  };
}

