import { supabase } from '@/lib/supabase/client';

export async function registrarScan(
  crachaId: string, 
  latitude: number | null, 
  longitude: number | null
) {
  // Tenta identificar o dispositivo (celular/navegador)
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Desconhecido';

  // Insere o registro na tabela scan_logs
  const { error } = await supabase
    .from('scan_logs')
    .insert({
      cracha_id: crachaId,
      latitude: latitude,
      longitude: longitude,
      user_agent: userAgent
    });

  if (error) {
    console.error('Erro ao registrar log de scan:', error);
  } else {
    console.log('Scan registrado com sucesso.');
  }
  
}

// Define o tipo para o Log com os dados aninhados
export interface ScanLog {
    id: number;
    latitude: number;
    longitude: number;
    scanned_at: string;
    crachas: {
      funcionarios: {
        nome: string;
        role: string;
        photo_url: string | null;
      } | null;
    } | null;
  }

  export interface FullScanLog {
    id: number;
    latitude: number | null;
    longitude: number | null;
    scanned_at: string;
    user_agent: string | null;
    crachas: {
      funcionarios: {
        nome: string;
        role: string;
        unidade_negocio: string | null;
        departmento: string | null;
      } | null;
    } | null;
  }
  
  export async function fetchScanLogs(): Promise<ScanLog[]> {
    const { data, error } = await supabase
      .from('scan_logs')
      .select(`
        id,
        latitude,
        longitude,
        scanned_at,
        crachas (
          funcionarios (
            nome,
            role,
            photo_url
          )
        )
      `)
      .not('latitude', 'is', null) // Só traz registros com GPS válido
      .order('scanned_at', { ascending: false })
      .limit(100); // Limita aos últimos 100 para não travar o mapa
  
    if (error) {
      console.error('Erro ao buscar logs:', error);
      return [];
    }
  
    return data as unknown as ScanLog[];
  }

  export async function fetchAllScanLogs(): Promise<FullScanLog[]> {
    const { data, error } = await supabase
      .from('scan_logs')
      .select(`
        id,
        latitude,
        longitude,
        scanned_at,
        user_agent,
        crachas (
          funcionarios (
            nome,
            role,
            unidade_negocio,
            departmento
          )
        )
      `)
      .order('scanned_at', { ascending: false });
  
    if (error) {
      console.error('Erro ao buscar todos os logs:', error);
      return [];
    }
  
    return data as unknown as FullScanLog[];
  }
