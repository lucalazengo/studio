import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center gap-4">
       <Link href="/" className="flex items-center gap-2 text-foreground">
        <Building2 className="h-6 w-6" />
        <span className="text-xl font-semibold tracking-tight">Employee Manager</span>
      </Link>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Digite seu e-mail abaixo para fazer login em sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="nome@exemplo.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" required />
          </div>
           <Button type="submit" className="w-full">
              Login
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
