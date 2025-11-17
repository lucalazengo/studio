// 1. Importamos o *novo* componente de cliente
import { DashboardClient } from '@/components/app/dashboard-client';

// 2. A página agora é um Componente de Servidor super simples
export default function DashboardPage() {
  
  // 3. Ela apenas renderiza o componente de cliente, que fará todo o trabalho
  return <DashboardClient />;
}