import { getEmployeeById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import { StatusBadge } from '@/components/app/status-badge';
import { format } from 'date-fns';

function QrCodePlaceholder() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full">
            <rect width="100" height="100" fill="#fff"/>
            <rect x="10" y="10" width="20" height="20" fill="#000"/>
            <rect x="15" y="15" width="10" height="10" fill="#fff"/>
            <rect x="70" y="10" width="20" height="20" fill="#000"/>
            <rect x="75" y="15" width="10" height="10" fill="#fff"/>
            <rect x="10" y="70" width="20" height="20" fill="#000"/>
            <rect x="15" y="75" width="10" height="10" fill="#fff"/>
            <rect x="40" y="10" width="10" height="10" fill="#000"/>
            <rect x="10" y="40" width="10" height="10" fill="#000"/>
            <rect x="40" y="40" width="50" height="50" fill="#000"/>
            <rect x="45" y="45" width="40" height="40" fill="#fff"/>
            <rect x="50" y="50" width="30" height="30" fill="#000"/>
            <rect x="60" y="20" width="5" height="15" fill="#000"/>
            <rect x="25" y="30" width="15" height="5" fill="#000"/>
            <rect x="70" y="70" width="10" height="10" fill="#000" />
            <rect x="35" y="65" width="5" height="5" fill="#000" />
            <rect x="55" y="75" width="5" height="5" fill="#000" />
        </svg>
    )
}

export default function EmployeeBadgePage({ params }: { params: { id: string } }) {
  const employee = getEmployeeById(params.id);

  if (!employee) {
    notFound();
  }

  return (
    <main className="flex flex-1 items-center justify-center p-4 bg-muted/40">
      <Card className="w-full max-w-sm rounded-2xl shadow-2xl">
        <CardHeader className="bg-primary text-primary-foreground p-6 rounded-t-2xl flex-row items-center gap-4">
          <Building2 className="w-8 h-8" />
          <h1 className="text-xl font-bold">Employee Manager ID</h1>
        </CardHeader>
        <CardContent className="p-8 flex flex-col items-center gap-6">
          <Avatar className="w-32 h-32 border-4 border-background ring-4 ring-primary">
            <AvatarImage src={employee.photoUrl} alt={employee.name} data-ai-hint={employee.photoHint}/>
            <AvatarFallback className="text-4xl">
              {employee.name.split(' ').map((n) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>

          <div className="text-center">
            <h2 className="text-2xl font-bold">{employee.name}</h2>
            <p className="text-muted-foreground text-lg">{employee.role}</p>
          </div>

          <div className="w-full flex justify-between items-center text-sm">
            <div className='flex flex-col items-start'>
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status={employee.status} />
            </div>
            <div className='flex flex-col items-end'>
                <span className="text-muted-foreground">Validade</span>
                <span className="font-semibold">{format(new Date(employee.expiryDate), 'MM/yy')}</span>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border w-full max-w-[200px]">
            <QrCodePlaceholder />
          </div>

           <p className="text-xs text-muted-foreground text-center">
             ID: {employee.id} &bull; {employee.department} / {employee.businessUnit}
            </p>

        </CardContent>
      </Card>
    </main>
  );
}
