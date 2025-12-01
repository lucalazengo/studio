"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw error;
      }
      toast({
        title: 'Login realizado',
        description: 'Você foi autenticado com sucesso.',
      });
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Erro de login:', err);
      toast({
        title: 'Falha no login',
        description: err?.message ?? 'Verifique suas credenciais e tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      {/* Esquerda: Imagem / Mascote */}
      <div className="hidden relative lg:block h-full w-full overflow-hidden bg-[#0f766e]"> {/* Teal-700/800ish to match image bg */}
         <Image 
            src="/login-hero.png" 
            alt="OkPass Login" 
            fill
            className="object-cover" // Cover to remove any borders if ratio doesn't match perfectly
            priority
          />
         {/* Subtle Gradient Overlay to blend */}
         <div className="absolute inset-0 bg-gradient-to-r from-[#0f766e]/50 to-transparent pointer-events-none" />
      </div>

      {/* Direita: Formulário de Login */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10 bg-slate-50">
        
        {/* Background blobs for modern effect */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-teal-100 blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-100 blur-3xl opacity-50 pointer-events-none"></div>

        <div className="mx-auto grid w-full max-w-[350px] gap-6 relative z-20">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold text-slate-800">Bem-vindo</h1>
            <p className="text-balance text-slate-500">
              Entre com suas credenciais para acessar o sistema
            </p>
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-slate-700">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@exemplo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-slate-200 focus:ring-teal-500 focus:border-teal-500 transition-all"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password" className="text-slate-700">Senha</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white border-slate-200 focus:ring-teal-500 focus:border-teal-500 transition-all"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-teal-600 text-white hover:bg-teal-700 hover:brightness-110 shadow-lg shadow-teal-600/20 transition-all"
              disabled={loading}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
