import { getCrachaDetails } from '@/lib/crachas';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { format, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Define os parâmetros da página
interface ValidationPageProps {
  params: {
    id: string; // O UUID [id] vindo da URL
  };
}

// Página de servidor para buscar dados antes de renderizar
export default async function ValidationPage({ params }: ValidationPageProps) {
  const cracha = await getCrachaDetails(params.id);

  // --- Caso 1: Crachá Inválido / Não Encontrado ---
  if (!cracha || !cracha.funcionarios) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted p-4">
        <Card className="w-full max-w-md border-destructive">
          <CardHeader className="items-center text-center">
            <XCircle className="h-16 w-16 text-destructive" />
            <CardTitle className="text-2xl text-destructive">
              Crachá Inválido
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p>O código QR escaneado não corresponde a um crachá válido no nosso sistema. Por favor, tente novamente ou contate o suporte.</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  const { funcionarios: func } = cracha;
  const estaAtivo = func.status === 'Ativo';
  const dataExpiracao = func.expiry_date ? new Date(func.expiry_date) : null;
  const estaExpirado = dataExpiracao ? isPast(dataExpiracao) : false;
  
  const isValid = estaAtivo && !estaExpirado;

  // --- Caso 2: Crachá Válido ---
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className={`w-full max-w-md ${isValid ? 'border-primary' : 'border-destructive'}`}>
        <CardHeader className="items-center text-center">
          {isValid ? (
            <CheckCircle className="h-16 w-16 text-green-500" />
          ) : (
            <AlertCircle className="h-16 w-16 text-destructive" />
          )}
          <CardTitle className={`text-2xl ${isValid ? 'text-primary' : 'text-destructive'}`}>
            {isValid ? 'Crachá Válido' : 'Crachá Inválido'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center space-y-4">
          <Avatar className="h-32 w-32">
            <AvatarImage src={func.photo_url ?? undefined} alt={func.nome} />
            <AvatarFallback className="text-4xl">
              {func.nome.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="w-full space-y-2 text-center">
            <h2 className="text-2xl font-bold">{func.nome}</h2>
            <p className="text-lg text-muted-foreground">{func.role ?? 'Sem função'}</p>
          </div>

          <div className="w-full space-y-2 pt-4">
            <div className="flex justify-between">
              <span className="font-medium">Status</span>
              <Badge variant={estaAtivo ? 'default' : 'destructive'}>
                {func.status}
              </Badge>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium">Validade</span>
              {dataExpiracao ? (
                <span className={estaExpirado ? 'text-destructive font-bold' : ''}>
                  {format(dataExpiracao, 'PPP', { locale: ptBR })}
                </span>
              ) : (
                <span>Indeterminada</span>
              )}
            </div>
            {estaExpirado && (
              <p className="text-center text-sm font-medium text-destructive">
                Este crachá expirou!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}