'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';
import { Bell, User, Globe, Shield, Moon, Sun } from 'lucide-react';

export default function SettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState(''); // Placeholder, já que Auth do Supabase básico só tem email/id geralmente

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || '');
        // Tentar pegar nome do metadata se existir
        setUserName(user.user_metadata?.full_name || '');
      }
    }
    getUser();
  }, []);

  const handleSaveProfile = async () => {
    setLoading(true);
    // Simulação de update de perfil
    // Em um cenário real, atualizaria user_metadata ou uma tabela 'profiles'
    setTimeout(() => {
      setLoading(false);
      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram salvas com sucesso.',
      });
    }, 1000);
  };

  const handleSaveNotifications = () => {
      toast({
        title: 'Preferências salvas',
        description: 'Suas configurações de notificação foram atualizadas.',
      });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie sua conta e preferências do sistema.
        </p>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="account">Conta</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="appearance">Sistema</TabsTrigger>
        </TabsList>
        
        {/* --- TAB CONTA --- */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" /> Informações do Perfil
              </CardTitle>
              <CardDescription>
                Atualize suas informações pessoais. O email é gerenciado pelo administrador.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input 
                  id="name" 
                  placeholder="Seu nome" 
                  value={userName} 
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" value={userEmail} disabled className="bg-muted" />
              </div>
              <div className="grid gap-2">
                 <Label htmlFor="role">Função</Label>
                 <Input id="role" value="Administrador" disabled className="bg-muted" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile} disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* --- TAB NOTIFICAÇÕES --- */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                 <Bell className="h-5 w-5" /> Preferências de Notificação
              </CardTitle>
              <CardDescription>
                Escolha como você deseja ser notificado sobre atividades do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="new-employees" className="flex flex-col space-y-1">
                  <span>Novos Funcionários</span>
                  <span className="font-normal text-xs text-muted-foreground">Receber alerta quando um funcionário for cadastrado.</span>
                </Label>
                <Switch id="new-employees" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="security-alerts" className="flex flex-col space-y-1">
                  <span>Alertas de Segurança</span>
                  <span className="font-normal text-xs text-muted-foreground">Notificar sobre tentativas de acesso suspeitas.</span>
                </Label>
                <Switch id="security-alerts" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="marketing-emails" className="flex flex-col space-y-1">
                  <span>Relatórios Semanais</span>
                  <span className="font-normal text-xs text-muted-foreground">Receber resumo de atividades por e-mail.</span>
                </Label>
                <Switch id="marketing-emails" />
              </div>
            </CardContent>
            <CardFooter>
               <Button onClick={handleSaveNotifications} variant="outline">Salvar Preferências</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* --- TAB APARÊNCIA / SISTEMA --- */}
        <TabsContent value="appearance">
          <div className="grid gap-4">
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <Globe className="h-5 w-5" /> Idioma e Região
                  </CardTitle>
                  <CardDescription>
                     Ajuste as configurações regionais do sistema.
                  </CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="grid gap-2">
                     <Label>Idioma do Sistema</Label>
                     <Select defaultValue="pt-BR">
                        <SelectTrigger>
                           <SelectValue placeholder="Selecione o idioma" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                           <SelectItem value="en-US">English (United States)</SelectItem>
                           <SelectItem value="es-ES">Español</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
                  <div className="grid gap-2">
                     <Label>Fuso Horário</Label>
                     <Select defaultValue="luanda">
                        <SelectTrigger>
                           <SelectValue placeholder="Selecione o fuso horário" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="luanda">Horário da África Ocidental (Luanda)</SelectItem>
                           <SelectItem value="brasilia">Horário de Brasília</SelectItem>
                           <SelectItem value="utc">UTC</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
               </CardContent>
            </Card>

             <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <Shield className="h-5 w-5" /> Segurança
                  </CardTitle>
                  <CardDescription>
                     Configurações de segurança da sessão.
                  </CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                   <div className="flex items-center justify-between space-x-2">
                     <Label htmlFor="2fa" className="flex flex-col space-y-1">
                        <span>Autenticação de Dois Fatores (2FA)</span>
                        <span className="font-normal text-xs text-muted-foreground">Adicionar uma camada extra de segurança.</span>
                     </Label>
                     <Switch id="2fa" disabled />
                  </div>
               </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
