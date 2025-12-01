import { Sidebar } from '@/components/app/sidebar';
import { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      {/* 1. O Menu Lateral Persistente */}
      <Sidebar />

      {/* 2. A Área de Conteúdo (que mudará com a navegação) */}
      <div className="flex flex-col flex-1 w-full transition-all duration-300 ease-in-out">
        {/* O conteúdo da página atual (dashboard, employees, etc.) */}
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
