'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { ScanLog } from '@/lib/logs';
import L from 'leaflet';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// --- Correção dos Ícones ---
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface ScansMapProps {
  logs: ScanLog[];
}

export default function ScansMap({ logs }: ScansMapProps) {
  // 1. Referência para a DIV onde o mapa vai morar
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // 2. Referência para a INSTÂNCIA do mapa (para não criar duas vezes)
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Se o container não existe ou o mapa já foi criado, PARE.
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Calcula centro inicial
    const initialPosition: [number, number] = logs.length > 0 
      ? [logs[0].latitude, logs[0].longitude]
      : [-8.839988, 13.289437]; 

    // 3. Cria o mapa MANUALMENTE
    const map = L.map(mapContainerRef.current, {
      center: initialPosition,
      zoom: 13,
      scrollWheelZoom: false
    });

    // Salva a instância na ref para impedir recriação
    mapInstanceRef.current = map;

    // Adiciona Tiles (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // 4. Adiciona Marcadores
    logs.forEach(log => {
      const marker = L.marker([log.latitude, log.longitude], { icon }).addTo(map);
      
      // HTML customizado para o Popup
      const popupContent = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:5px; min-width:150px;">
          ${log.crachas?.funcionarios?.photo_url ? 
            `<img src="${log.crachas.funcionarios.photo_url}" style="width:40px; height:40px; border-radius:50%; object-fit:cover; border:1px solid #ccc;" />` 
            : ''}
          <div style="font-weight:bold; font-size:14px; color:#333;">
            ${log.crachas?.funcionarios?.nome || 'Desconhecido'}
          </div>
          <div style="font-size:12px; color:#666;">
            ${log.crachas?.funcionarios?.role || ''}
          </div>
          <div style="font-size:10px; color:#999; border-top:1px solid #eee; width:100%; text-align:center; padding-top:4px;">
            ${format(new Date(log.scanned_at), "dd 'de' MMM 'às' HH:mm", { locale: ptBR })}
          </div>
        </div>
      `;
      
      marker.bindPopup(popupContent);
    });

    // 5. Função de Limpeza (Cleanup)
    // Quando o componente desmonta, destruímos o mapa corretamente.
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [logs]); // Recria apenas se os logs mudarem

  return (
    <div className="grid lg:grid-cols-[1fr_300px] h-[600px] gap-4">
      {/* Mapa */}
      <div 
        ref={mapContainerRef} 
        className="h-full w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm z-0 relative"
      />
      
      {/* Sidebar de Logs Recentes */}
      <div className="h-full overflow-y-auto border rounded-xl p-4 bg-background shadow-sm">
        <h3 className="font-semibold text-lg mb-4 sticky top-0 bg-background pb-2 border-b">
          Últimos Acessos (48h)
        </h3>
        <div className="flex flex-col gap-3">
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum acesso registrado recentemente.
            </p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors border-b last:border-0">
                 <div className="h-10 w-10 rounded-full overflow-hidden border bg-gray-100 shrink-0">
                    {log.crachas?.funcionarios?.photo_url ? (
                      <img 
                        src={log.crachas.funcionarios.photo_url} 
                        alt="Foto" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xs font-bold text-gray-400">
                        {log.crachas?.funcionarios?.nome?.charAt(0).toUpperCase()}
                      </div>
                    )}
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" title={log.crachas?.funcionarios?.nome}>
                      {log.crachas?.funcionarios?.nome || 'Desconhecido'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {log.crachas?.funcionarios?.role || 'Sem cargo'}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {format(new Date(log.scanned_at), "dd/MM HH:mm", { locale: ptBR })}
                    </p>
                 </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
