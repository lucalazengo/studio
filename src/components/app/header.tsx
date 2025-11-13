import { SidebarTrigger } from '@/components/ui/sidebar';
import { Building2 } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <SidebarTrigger />
         <Building2 className="size-6 text-primary" />
          <h1 className="text-lg font-semibold tracking-tight">
            Employee Manager
          </h1>
      </div>
      <div className="flex w-full items-center justify-end gap-4">
        {/* Can add search or other header items here */}
      </div>
    </header>
  );
}
