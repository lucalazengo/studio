'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell,
  Home,
  LifeBuoy,
  LineChart,
  Map,
  Package,
  Package2,
  Settings,
  ShoppingCart,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';

interface SidebarProps {
  className?: string;
}

function UserInfo({ isCollapsed }: { isCollapsed: boolean }) {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email ?? 'Usuário');
      }
      setLoading(false);
    }
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (loading) {
     return (
        <div className="mt-auto p-4">
           <div className={cn("bg-[hsl(var(--sidebar-accent))] rounded-lg animate-pulse", isCollapsed ? "h-10 w-10" : "h-24")}></div>
        </div>
     )
  }

  if (isCollapsed) {
    return (
      <div className="mt-auto p-2 flex justify-center">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
               <Button 
                size="icon" 
                variant="ghost"
                onClick={handleLogout}
                className="bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-primary))] hover:bg-[hsl(var(--sidebar-primary))] hover:text-[hsl(var(--sidebar-primary-foreground))]"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Sair ({userEmail})</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <div className="mt-auto p-4">
      <Card className="bg-[hsl(var(--sidebar-accent))] border-none shadow-none transition-all duration-300 fade-in">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-medium text-[hsl(var(--sidebar-primary))]">
            Conta
          </CardTitle>
          <CardDescription className="text-xs text-[hsl(var(--sidebar-foreground))] opacity-80 truncate max-w-[180px]" title={userEmail || ''}>
            {userEmail || 'Não logado'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Button 
            size="sm" 
            onClick={handleLogout}
            className="w-full bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))] hover:bg-[hsl(var(--sidebar-primary))] hover:brightness-110 border-none flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" /> Sair
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Recupera estado do localStorage se existir (opcional, para persistir entre reloads)
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved) {
      setIsCollapsed(saved === 'true');
    }
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/employees', label: 'Funcionários', icon: Users },
    { href: '/map', label: 'Mapa de Acessos', icon: Map },
    { href: '/support', label: 'Suporte', icon: LifeBuoy },
    { href: '/settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div 
      className={cn(
        "hidden md:flex flex-col border-r bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] border-[hsl(var(--sidebar-border))] transition-all duration-300 ease-in-out z-20 relative",
        isCollapsed ? "w-[80px]" : "w-[280px]"
      )}
    >
      {/* Botão de Toggle na Borda */}
      <div className="absolute -right-3 top-8 z-30">
        <Button
          onClick={toggleCollapse}
          variant="outline"
          size="icon"
          className="h-6 w-6 rounded-full border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-primary))] hover:text-white shadow-md p-0"
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
      </div>

      <div className="flex h-full max-h-screen flex-col gap-2">
        {/* Header Logo */}
        <div className={cn(
          "flex h-16 items-center border-b px-4 border-[hsl(var(--sidebar-border))] transition-all",
           isCollapsed ? "justify-center px-2" : "justify-start px-6"
        )}>
          <Link href="/" className="flex items-center gap-2 font-semibold text-[hsl(var(--sidebar-foreground))]">
            <div className="flex items-center justify-center min-w-8 min-h-8 w-8 h-8 rounded bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))] transition-transform hover:scale-105">
              <Package2 className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <span className="animate-in fade-in slide-in-from-left-2 duration-300 whitespace-nowrap">
                OkPass
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 pt-4 overflow-x-hidden">
          <nav className="grid items-start gap-1 px-2 text-sm font-medium">
            {navItems.map((item) => (
               <TooltipProvider key={item.label} delayDuration={0}>
                 <Tooltip>
                   <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 transition-all group relative overflow-hidden',
                        pathname === item.href
                          ? 'bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-primary))] font-bold' // Active
                          : 'text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))]/50 hover:text-[hsl(var(--sidebar-primary))]', // Inactive
                        isCollapsed && "justify-center px-2"
                      )}
                    >
                      <item.icon className={cn("h-5 w-5 shrink-0 transition-colors", pathname === item.href ? "text-[hsl(var(--sidebar-primary))]" : "text-muted-foreground group-hover:text-[hsl(var(--sidebar-primary))]")} />
                      
                      {!isCollapsed && (
                        <span className="animate-in fade-in slide-in-from-left-1 duration-200 whitespace-nowrap">
                          {item.label}
                        </span>
                      )}
                      
                      {/* Active Indicator Strip */}
                      {pathname === item.href && !isCollapsed && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[hsl(var(--sidebar-primary))]" />
                      )}
                    </Link>
                   </TooltipTrigger>
                   {isCollapsed && (
                     <TooltipContent side="right" className="bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-foreground))] border-[hsl(var(--sidebar-border))]">
                       {item.label}
                     </TooltipContent>
                   )}
                 </Tooltip>
               </TooltipProvider>
            ))}
          </nav>
        </div>

        {/* Footer User Info */}
        <UserInfo isCollapsed={isCollapsed} />
      </div>
    </div>
  );
}
