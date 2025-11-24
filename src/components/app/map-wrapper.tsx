'use client';

import dynamic from 'next/dynamic';
import { ScanLog } from '@/lib/logs';

const ScansMap = dynamic(() => import('./scans-map'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400 rounded-xl">
      Carregando Mapa...
    </div>
  ),
});

// ✅ Certifique-se de que a palavra "export" está aqui:
export function MapWrapper({ logs }: { logs: ScanLog[] }) {
  return <ScansMap logs={logs} />;
}