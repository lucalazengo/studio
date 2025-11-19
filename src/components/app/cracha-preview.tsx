import React from 'react';
import { Employee } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { QRCodeSVG } from 'qrcode.react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CrachaPreviewProps {
  employee: Employee;
  qrCodeUrl: string;
}

export const CrachaPreview = ({ employee, qrCodeUrl }: CrachaPreviewProps) => {
    
    const expiryDate = employee.expiry_date
      ? format(new Date(employee.expiry_date), 'dd/MM/yyyy', { locale: ptBR })
      : 'N/A';

    const cardClass = "w-[320px] h-[500px] bg-white border border-gray-300 flex flex-col items-center text-center relative overflow-hidden print:border-0 print:shadow-none page-break-after-always";
    const empresaNome = employee.unidade_negocio || 'RIKAUTO';

    return (
      <div className="flex flex-col md:flex-row gap-8 p-4 bg-white items-center justify-center print:flex-col print:p-0 print:gap-0 print:items-start">
        
        {/* --- FRENTE DO CRACHÁ --- */}
        <div className={cardClass}>
          {/* Topo Azul Curvo */}
          <div className="absolute top-0 w-full h-32 bg-blue-600 rounded-b-[50%] scale-125 -translate-y-16 z-0"></div>

          <div className="relative z-10 flex flex-col items-center w-full h-full pt-10 pb-6 px-6 justify-between">
            {/* Foto com borda branca */}
            <div className="p-1 bg-white rounded-full shadow-md mb-2">
              <Avatar className="h-36 w-36">
                <AvatarImage 
                  src={employee.photo_url ?? undefined} 
                  alt={employee.nome} 
                  className="object-cover"
                />
                <AvatarFallback className="text-4xl bg-gray-100 text-gray-400">
                  {employee.nome.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Nome com mais destaque e espaçamento */}
            <div className="mt-4 mb-2">
              <h2 className="text-2xl font-extrabold text-gray-900 leading-tight uppercase tracking-tight px-2">
                {employee.nome}
              </h2>
              {/* Removido Cargo e Unidade conforme pedido */}
            </div>

            <div className="flex-1"></div>

            {/* QR Code com borda e tamanho otimizado */}
            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm mb-3">
               <QRCodeSVG value={qrCodeUrl} size={130} level="M" includeMargin={true} />
            </div>

            {/* Data de Validade */}
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              VÁLIDO ATÉ: <span className="text-gray-800 text-sm">{expiryDate}</span>
            </div>
          </div>
        </div>


        {/* --- VERSO DO CRACHÁ --- */}
        <div className={`${cardClass} print:mt-4`}>
           <div className="w-full h-6 bg-slate-900 absolute top-0 left-0"></div>

           <div className="flex-1 flex flex-col items-center justify-center w-full px-6 pt-12 pb-8">
              
              <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-1">
                {empresaNome}
              </h3>
              <p className="text-sm text-gray-500 mb-12">
                Peças e acessórios Auto Multimarcas
              </p>

              <div className="w-full bg-gray-50 p-6 rounded-lg border border-gray-100 mb-auto">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Call Center
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  Seg. a sex. das 8h às 17h00
                </p>
                <p className="text-2xl font-bold text-blue-600 tabular-nums">
                  +244 925 724 780
                </p>
              </div>

              <div className="mt-auto px-4 text-[10px] leading-tight text-gray-400">
                <p>
                  Este cartão é pessoal e intransmissível. Em caso de perda, por favor contacte a administração.
                </p>
              </div>
           </div>

           <div className="w-full h-4 bg-slate-900 absolute bottom-0 left-0"></div>
        </div>

      </div>
    );
};