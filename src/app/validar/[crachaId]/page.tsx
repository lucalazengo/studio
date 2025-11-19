import { supabase } from '@/lib/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle2, XCircle, AlertTriangle, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';

// Desativa o cache para validação em tempo real
export const revalidate = 0;

interface ValidationPageProps {
  params: Promise<{
    crachaId: string;
  }>;
}

export default async function ValidationPage({ params }: ValidationPageProps) {
  const { crachaId } = await params;

  // Validação de UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(crachaId)) {
      return <InvalidState message="Código Inválido" />;
  }

  // Busca dados
  const { data: cracha, error } = await supabase
    .from('crachas')
    .select(`*, funcionario:funcionarios (*)`)
    .eq('id', crachaId)
    .single();

  if (error || !cracha || !cracha.funcionario) {
    return <InvalidState message="Crachá não encontrado." />;
  }

  const employee = cracha.funcionario;
  const expiryDate = employee.expiry_date ? new Date(employee.expiry_date) : null;
  const now = new Date();

  // --- Lógica de Status ---
  let status: 'valid' | 'invalid' | 'expired' = 'valid';
  let statusText = 'FUNCIONÁRIO ATIVO';
  let statusColor = 'text-green-500';
  let Icon = CheckCircle2;

  if (employee.status !== 'Ativo') {
    status = 'invalid';
    statusText = 'FUNCIONÁRIO INATIVO';
    statusColor = 'text-red-500';
    Icon = XCircle;
  } else if (expiryDate && expiryDate < now) {
    status = 'expired';
    statusText = 'CRACHÁ VENCIDO';
    statusColor = 'text-red-500'; // Usando vermelho para vencido também, conforme imagem
    Icon = XCircle;
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans">
      
      {/* Logo (Opcional, se tiver em public/logo.png) */}
      {/* <div className="absolute top-8 left-8">
        <Image src="/logo.png" alt="Logo" width={100} height={40} className="object-contain" />
      </div> */}

      {/* Design estilo 'App Mobile' Limpo */}
      <div className="w-full max-w-md flex flex-col items-center text-center space-y-6">
        
        {/* Foto do Funcionário com Borda Decorativa */}
        <div className="relative">
          {/* Círculo de fundo decorativo */}
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-green-50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          
          <Avatar className="h-48 w-48 border-4 border-white shadow-2xl relative z-10">
            <AvatarImage 
              src={employee.photo_url ?? undefined} 
              alt={employee.nome} 
              className="object-cover"
            />
            <AvatarFallback className="text-5xl bg-gray-100 text-gray-400">
              {employee.nome.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="space-y-1 relative z-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {employee.nome}
          </h1>
          <p className="text-lg font-medium text-gray-500 uppercase tracking-wide">
            {employee.role}
          </p>
          <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">
            {employee.unidade_negocio}
          </p>
        </div>

        {/* Divisor */}
        <div className="w-16 h-1 bg-gray-100 rounded-full"></div>

        {/* Indicador de Status Grande */}
        <div className="flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className={`text-sm font-bold uppercase tracking-widest ${statusColor}`}>
            {statusText}
          </p>
          
          <Icon className={`w-24 h-24 ${statusColor}`} strokeWidth={0} fill="currentColor" />
          
          <div className="text-sm text-gray-400 font-medium mt-2">
            VÁLIDO ATÉ <br/>
            <span className="text-gray-800 text-lg font-bold">
              {expiryDate ? format(expiryDate, 'dd/MM/yyyy', { locale: ptBR }) : 'INDETERMINADO'}
            </span>
          </div>
        </div>

      </div>

      <div className="mt-auto pt-12 pb-4 text-center">
        <p className="text-[10px] text-gray-300 font-mono">
          ID: {crachaId.split('-')[0]} • Verificado em {format(new Date(), 'HH:mm', { locale: ptBR })}
        </p>
      </div>

    </main>
  );
}

function InvalidState({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
      <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <XCircle className="w-12 h-12 text-red-500" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h1>
      <p className="text-gray-500 mb-8">{message}</p>
    </div>
  );
}