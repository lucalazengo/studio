import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { CrachaPreview } from '@/components/app/cracha-preview';
import { PrintAutoTrigger } from '@/components/app/print-auto-trigger';

// Desativa o cache para garantir que os dados do crachá estejam sempre atualizados
export const revalidate = 0;

interface PrintPageProps {
  params: Promise<{
    crachaId: string;
  }>;
}

export default async function PrintPage({ params }: PrintPageProps) {
  // Aguarda os parâmetros (obrigatório no Next.js 15)
  const { crachaId } = await params;

  // 1. Validação básica de segurança para o formato UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(crachaId)) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 font-bold">
        ID de crachá inválido.
      </div>
    );
  }

  // 2. Busca os dados do crachá e do funcionário associado
  const { data: cracha, error } = await supabase
    .from('crachas')
    .select(`
      *,
      funcionario:funcionarios (*)
    `)
    .eq('id', crachaId)
    .single();

  if (error || !cracha || !cracha.funcionario) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 font-bold">
        Erro: Crachá não encontrado.
      </div>
    );
  }

  // 3. Reconstrói a URL de validação para o QR Code
  // Tenta usar a variável de ambiente, ou fallback para localhost
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const qrCodeUrl = `${baseUrl}/validar/${cracha.id}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-0 m-0">
      
      {/* Renderiza o componente visual do crachá */}
      <CrachaPreview 
        employee={cracha.funcionario} 
        qrCodeUrl={qrCodeUrl} 
      />
      
      {/* Componente invisível que dispara window.print() ao carregar */}
      <PrintAutoTrigger />
      
      {/* Estilos globais apenas para esta página de impressão */}
      <style>{`
        @page {
          size: auto;
          margin: 0mm;
        }
        @media print {
          body {
            background: white;
            -webkit-print-color-adjust: exact; /* Garante cores exatas */
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}