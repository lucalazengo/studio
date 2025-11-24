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
    <div 
      // A ref é anexada aqui
      ref={mapContainerRef} 
      className="h-[600px] w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm z-0 relative"
    />
  );
}