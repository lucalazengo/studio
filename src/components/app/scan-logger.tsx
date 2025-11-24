'use client';

import { useEffect, useRef } from 'react';
import { registrarScan } from '@/lib/logs';
import { useToast } from '@/hooks/use-toast';
import { MapPin } from 'lucide-react';

interface ScanLoggerProps {
  crachaId: string;
}

export function ScanLogger({ crachaId }: ScanLoggerProps) {
  const { toast } = useToast();
  const logSent = useRef(false); // Garante que só registre 1 vez por acesso

  useEffect(() => {
    if (logSent.current) return;
    logSent.current = true;

    // Verifica se o navegador suporta geolocalização
    if (!('geolocation' in navigator)) {
      console.warn('Geolocalização não suportada.');
      registrarScan(crachaId, null, null); // Registra sem local
      return;
    }

    // Solicita a posição do GPS
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Envia coordenadas para o banco
        registrarScan(crachaId, latitude, longitude);
        
        // Aviso discreto para quem validou (opcional)
        toast({
          description: (
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <MapPin className="w-4 h-4" />
              <span>Localização validada</span>
            </div>
          ),
          duration: 3000,
        });
      },
      (error) => {
        console.warn('Permissão de GPS negada:', error);
        // IMPORTANTE: Registra o scan mesmo se o usuário negar o GPS
        // Assim você sabe que o crachá foi lido, mesmo sem saber onde.
        registrarScan(crachaId, null, null);
      },
      { 
        enableHighAccuracy: true, // Tenta usar GPS preciso
        timeout: 15000, // Espera até 15s
        maximumAge: 0 
      }
    );
  }, [crachaId, toast]);

  return null; // Componente invisível
}