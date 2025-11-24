'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Mail, Phone, MessageSquare, Clock, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SupportPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Simulação de envio de formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Aqui você conectaria com sua API de e-mail (ex: Resend, SendGrid)
    // Simulamos um delay de 1.5s
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Mensagem enviada!',
        description: 'Nossa equipe entrará em contato em breve.',
      });
      // Resetar o formulário (opcional)
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Central de Ajuda</h1>
        <p className="text-muted-foreground">
          Estamos aqui para ajudar. Encontre respostas ou entre em contato.
        </p>
      </div>

      {/* --- SEÇÃO 1: CARDS DE CONTATO --- */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">E-mail</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">suporte@rikauto.ao</div>
            <p className="text-xs text-muted-foreground">Resposta em até 24h</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Telefone / WhatsApp</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+244 925 724 780</div>
            <p className="text-xs text-muted-foreground">Seg. a Sex. das 8h às 17h</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horário de Atendimento</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">08:00 - 17:00</div>
            <p className="text-xs text-muted-foreground">Dias úteis</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        
        {/* --- SEÇÃO 2: PERGUNTAS FREQUENTES (FAQ) --- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Perguntas Frequentes
            </CardTitle>
            <CardDescription>
              Respostas rápidas para as dúvidas mais comuns.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              
              <AccordionItem value="item-1">
                <AccordionTrigger>Como imprimo um crachá?</AccordionTrigger>
                <AccordionContent>
                  Vá até a aba <strong>Funcionários</strong>, encontre o colaborador na lista, clique nos três pontos (...) e selecione <strong>"Gerar Crachá"</strong>. Uma janela abrirá com a opção de imprimir ou salvar em PDF.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>O QR Code não está funcionando.</AccordionTrigger>
                <AccordionContent>
                  Verifique se o dispositivo que está lendo o QR Code tem acesso à internet. Além disso, certifique-se de que o crachá impresso não está danificado ou amassado na área do código.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Como desativar um funcionário?</AccordionTrigger>
                <AccordionContent>
                  Na lista de funcionários, clique no menu de ações (...) e selecione <strong>"Desativar"</strong>. O status mudará imediatamente e o crachá não será mais validado pelo sistema.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Posso alterar a foto depois de cadastrar?</AccordionTrigger>
                <AccordionContent>
                  Sim. Utilize a opção <strong>"Editar Funcionário"</strong> no menu de ações. Clique na foto atual para carregar uma nova imagem e salve as alterações.
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </CardContent>
        </Card>

        {/* --- SEÇÃO 3: FORMULÁRIO DE MENSAGEM --- */}
        <Card>
          <CardHeader>
            <CardTitle>Envie uma mensagem</CardTitle>
            <CardDescription>
              Não encontrou o que procurava? Preencha o formulário abaixo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="subject">Assunto</Label>
                <Input id="subject" placeholder="Ex: Problema na impressão" required />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea 
                  id="message" 
                  placeholder="Descreva detalhadamente o que está acontecendo..." 
                  className="min-h-[120px]"
                  required 
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Enviando...' : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Enviar Solicitação
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}