'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  Users,
  Settings,
  HelpCircle,
  Building2,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { UserNav } from './user-nav';

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="h-16 items-center">
        <div className="flex items-center gap-2">
          <Building2 className="size-6 text-primary" />
          <h1 className="text-lg font-semibold tracking-tight">
            Employee Manager
          </h1>
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/dashboard" passHref>
              <SidebarMenuButton
                isActive={pathname.startsWith('/dashboard')}
                tooltip="Dashboard"
              >
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
             <Link href="#" passHref>
              <SidebarMenuButton tooltip="Employees">
                <Users />
                <span>Employees</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
           <Link href="#" passHref>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
        </SidebarMenu>
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <HelpCircle />
              <span>Support</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="mt-auto p-2 group-data-[collapsible=icon]:hidden">
          <UserNav />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
