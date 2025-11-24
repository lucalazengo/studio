import { fetchScanLogs } from '@/lib/logs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { MapWrapper } from '@/components/app/map-wrapper'; // ✅ Usamos o Wrapper aqui

export default async function MapPage() {
  // Busca os logs no servidor (Supabase)
  const logs = await fetchScanLogs();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <MapPin className="h-8 w-8 text-blue-600" />
          Mapa de Acessos
        </h1>
        <p className="text-muted-foreground">
          Visualize onde os crachás foram validados em tempo real.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Últimas Validações com GPS</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
           {/* ✅ Renderizamos o Wrapper seguro em vez do mapa direto */}
           <MapWrapper logs={logs} />
        </CardContent>
      </Card>
    </div>
  );
}