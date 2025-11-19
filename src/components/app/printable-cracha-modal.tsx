'use client';

import { Employee } from '@/types';
import { CrachaPreview } from './cracha-preview';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Printer } from 'lucide-react';
import Link from 'next/link';

interface PrintableCrachaModalProps {
  employee: Employee;
  qrCodeUrl: string;
  crachaId: string; // ✅ Prop obrigatória agora
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrintableCrachaModal({
  employee,
  qrCodeUrl,
  crachaId,
  open,
  onOpenChange,
}: PrintableCrachaModalProps) {
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle>Visualização do Crachá</DialogTitle>
          <DialogDescription>
             Confira os dados abaixo. Clique em imprimir para abrir a versão de impressão.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-4 gap-6">
          
          {/* Visualização (apenas visual, não imprime daqui) */}
          <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 transform scale-90 sm:scale-100 transition-transform origin-top">
            <CrachaPreview
              employee={employee}
              qrCodeUrl={qrCodeUrl}
            />
          </div>
          
          <div className="flex flex-col items-center gap-3 text-center w-full px-8">
            <p className="text-sm text-muted-foreground">
              Uma nova aba será aberta com a versão pronta para impressora.
            </p>
            
            {/* Botão Link para a rota de impressão */}
            <Button asChild size="lg" className="w-full sm:w-auto gap-2">
              <Link href={`/imprimir/${crachaId}`} target="_blank">
                <Printer className="w-4 h-4" />
                Imprimir / Salvar PDF
              </Link>
            </Button>

            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}