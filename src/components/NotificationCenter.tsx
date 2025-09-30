import React from 'react';
import { NotificationAlert } from '@/types/financial';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Clock, AlertTriangle, CheckCircle, X, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

interface NotificationCenterProps {
  alerts: NotificationAlert[];
  unreadCount: number;
  onMarkAsRead: (alertId: string) => void;
  onClearAlert: (alertId: string) => void;
  onOpenSettings?: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  alerts,
  unreadCount,
  onMarkAsRead,
  onClearAlert,
  onOpenSettings
}) => {
  const getAlertIcon = (type: NotificationAlert['type']) => {
    switch (type) {
      case 'due_soon':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'recurring_generated':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAlertColor = (type: NotificationAlert['type']) => {
    switch (type) {
      case 'due_soon':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'overdue':
        return 'border-l-red-500 bg-red-50';
      case 'recurring_generated':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getTypeLabel = (type: NotificationAlert['type']) => {
    switch (type) {
      case 'due_soon':
        return 'Vencimento Próximo';
      case 'overdue':
        return 'Vencido';
      case 'recurring_generated':
        return 'Recorrência Gerada';
      default:
        return 'Notificação';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div>
              <CardTitle>Central de Notificações</CardTitle>
              <CardDescription>
                Alertas de vencimento e notificações importantes
              </CardDescription>
            </div>
          </div>
          {onOpenSettings && (
            <Button variant="outline" size="sm" onClick={onOpenSettings}>
              <Settings className="h-4 w-4 mr-2" />
              Configurar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Nenhuma notificação</p>
            <p className="text-sm text-gray-400">
              Você será notificado sobre vencimentos e transações recorrentes
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "p-4 rounded-lg border-l-4 transition-all",
                  getAlertColor(alert.type),
                  !alert.isRead && "border-2 border-l-4"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          {getTypeLabel(alert.type)}
                        </span>
                        {!alert.isRead && (
                          <Badge variant="secondary" className="text-xs">
                            Nova
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-900 mb-2">
                        {alert.message}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>
                          Vencimento: {format(parseISO(alert.dueDate), 'dd/MM/yyyy')}
                        </span>
                        <span>
                          {format(parseISO(alert.createdAt), 'dd/MM/yyyy HH:mm')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {!alert.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMarkAsRead(alert.id)}
                        className="text-xs"
                      >
                        Marcar como Lida
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onClearAlert(alert.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;