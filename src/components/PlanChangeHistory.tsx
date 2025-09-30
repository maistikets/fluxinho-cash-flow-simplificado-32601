import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight } from 'lucide-react';

interface PlanChangeRecord {
  id: string;
  userId: string;
  userName: string;
  fromPlan: string;
  toPlan: string;
  changeDate: string;
  reason?: string;
}

interface PlanChangeHistoryProps {
  changes?: PlanChangeRecord[];
  maxRecords?: number;
}

const PlanChangeHistory: React.FC<PlanChangeHistoryProps> = ({ 
  changes = [], 
  maxRecords = 10 
}) => {
  // Simular alguns registros de exemplo para demonstração
  const mockChanges: PlanChangeRecord[] = [
    {
      id: '1',
      userId: '2',
      userName: 'João Silva',
      fromPlan: 'trial',
      toPlan: 'basic',
      changeDate: new Date().toISOString(),
      reason: 'Upgrade automático'
    },
    {
      id: '2',
      userId: '3',
      userName: 'Maria Santos',
      fromPlan: 'basic',
      toPlan: 'premium',
      changeDate: new Date(Date.now() - 86400000).toISOString(),
      reason: 'Solicitação do cliente'
    },
    {
      id: '3',
      userId: '4',
      userName: 'Pedro Costa',
      fromPlan: 'premium',
      toPlan: 'annual',
      changeDate: new Date(Date.now() - 172800000).toISOString(),
      reason: 'Upgrade para anual'
    }
  ];

  const displayChanges = changes.length > 0 ? changes : mockChanges;
  const limitedChanges = displayChanges.slice(0, maxRecords);

  const getPlanBadge = (planType: string) => {
    const planNames = {
      trial: 'Trial',
      basic: 'Mensal',
      premium: 'Trimestral',
      annual: 'Anual'
    };

    const planColors = {
      trial: 'bg-blue-100 text-blue-800',
      basic: 'bg-gray-100 text-gray-800',
      premium: 'bg-purple-100 text-purple-800',
      annual: 'bg-green-100 text-green-800'
    };

    return (
      <Badge className={planColors[planType as keyof typeof planColors] || 'bg-gray-100 text-gray-800'}>
        {planNames[planType as keyof typeof planNames] || planType}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Histórico de Mudanças de Planos
        </CardTitle>
        <CardDescription>
          Registro das últimas alterações de planos realizadas no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        {limitedChanges.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhuma alteração de plano registrada ainda.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {limitedChanges.map((change) => (
              <div key={change.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{change.userName}</h4>
                      <div className="flex items-center gap-2">
                        {getPlanBadge(change.fromPlan)}
                        <ArrowRight className="h-3 w-3 text-gray-400" />
                        {getPlanBadge(change.toPlan)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(change.changeDate).toLocaleDateString('pt-BR')} às {' '}
                        {new Date(change.changeDate).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    {change.reason && (
                      <p className="text-xs text-gray-500 mt-1">{change.reason}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs">
                    Efetivado
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlanChangeHistory;