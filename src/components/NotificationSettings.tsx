
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Bell, AlertTriangle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NotificationSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    paymentReminders: true,
    reportAlerts: true,
    frequency: 'daily',
    dueAlerts: true,
    overdueAlerts: true,
    recurringAlerts: true,
    daysBeforeDue: 3
  });

  const handleToggle = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Configuração atualizada",
      description: "Suas preferências de notificação foram salvas.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5 text-gray-500" />
          <div>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Configure como e quando receber notificações</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Notificações por Email</Label>
              <p className="text-sm text-gray-500">Receba notificações importantes por email</p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.emailNotifications}
              onCheckedChange={(value) => handleToggle('emailNotifications', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications">Notificações Push</Label>
              <p className="text-sm text-gray-500">Receba notificações no navegador</p>
            </div>
            <Switch
              id="push-notifications"
              checked={settings.pushNotifications}
              onCheckedChange={(value) => handleToggle('pushNotifications', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="payment-reminders">Lembretes de Pagamento</Label>
              <p className="text-sm text-gray-500">Alertas sobre contas vencendo</p>
            </div>
            <Switch
              id="payment-reminders"
              checked={settings.paymentReminders}
              onCheckedChange={(value) => handleToggle('paymentReminders', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="report-alerts">Alertas de Relatórios</Label>
              <p className="text-sm text-gray-500">Notificações sobre relatórios gerados</p>
            </div>
            <Switch
              id="report-alerts"
              checked={settings.reportAlerts}
              onCheckedChange={(value) => handleToggle('reportAlerts', value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Frequência de Notificações</Label>
          <Select value={settings.frequency} onValueChange={(value) => setSettings(prev => ({ ...prev, frequency: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="realtime">Tempo Real</SelectItem>
              <SelectItem value="daily">Diário</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="monthly">Mensal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Seção de Alertas de Vencimento */}
        <div className="border-t pt-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <h3 className="font-semibold text-gray-900">Alertas de Vencimento</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="due-alerts">Alertas de Vencimento Próximo</Label>
                <p className="text-sm text-gray-500">Notificar sobre transações que estão próximas do vencimento</p>
              </div>
              <Switch
                id="due-alerts"
                checked={settings.dueAlerts}
                onCheckedChange={(value) => handleToggle('dueAlerts', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="overdue-alerts">Alertas de Vencidas</Label>
                <p className="text-sm text-gray-500">Notificar sobre transações vencidas</p>
              </div>
              <Switch
                id="overdue-alerts"
                checked={settings.overdueAlerts}
                onCheckedChange={(value) => handleToggle('overdueAlerts', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="recurring-alerts">Alertas de Recorrência</Label>
                <p className="text-sm text-gray-500">Notificar quando transações recorrentes forem geradas</p>
              </div>
              <Switch
                id="recurring-alerts"
                checked={settings.recurringAlerts}
                onCheckedChange={(value) => handleToggle('recurringAlerts', value)}
              />
            </div>

            {settings.dueAlerts && (
              <div className="space-y-2">
                <Label htmlFor="days-before-due">Dias antes do vencimento</Label>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <Input
                    id="days-before-due"
                    type="number"
                    min="1"
                    max="30"
                    value={settings.daysBeforeDue}
                    onChange={(e) => setSettings(prev => ({ ...prev, daysBeforeDue: parseInt(e.target.value) || 3 }))}
                    className="w-20"
                  />
                  <span className="text-sm text-gray-500">dias</span>
                </div>
                <p className="text-xs text-gray-500">
                  Você será notificado {settings.daysBeforeDue} dias antes do vencimento das transações
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
