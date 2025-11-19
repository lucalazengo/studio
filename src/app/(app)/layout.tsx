import { Sidebar } from '@/components/app/sidebar'; // Vamos criar este
import { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* 1. O Menu Lateral Persistente */}
      <Sidebar />

      {/* 2. A Área de Conteúdo (que mudará com a navegação) */}
      <div className="flex flex-col">
        {/* Você pode adicionar um Header/Navbar aqui se quiser */}
        {/* <header className="flex h-14 items-center gap-4 ...">...</header> */}
        
        {/* O conteúdo da página atual (dashboard, employees, etc.) */}
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}