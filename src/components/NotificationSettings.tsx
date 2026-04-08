import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Bell, AlertTriangle, Clock, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const NotificationSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    paymentReminders: true,
    reportAlerts: true,
    frequency: 'daily',
    dueAlerts: true,
    overdueAlerts: true,
    recurringAlerts: true,
    daysBeforeDue: 3,
  });

  useEffect(() => {
    const loadPrefs = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setSettings({
            emailNotifications: (data as any).email_notifications,
            pushNotifications: (data as any).push_notifications,
            paymentReminders: (data as any).payment_reminders,
            reportAlerts: (data as any).report_alerts,
            frequency: (data as any).frequency,
            dueAlerts: (data as any).due_alerts,
            overdueAlerts: (data as any).overdue_alerts,
            recurringAlerts: (data as any).recurring_alerts,
            daysBeforeDue: (data as any).days_before_due,
          });
        }
      } catch (error) {
        console.error('Error loading notification preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPrefs();
  }, [user]);

  const saveSettings = async (newSettings: typeof settings) => {
    if (!user) return;
    try {
      const payload = {
        user_id: user.id,
        email_notifications: newSettings.emailNotifications,
        push_notifications: newSettings.pushNotifications,
        payment_reminders: newSettings.paymentReminders,
        report_alerts: newSettings.reportAlerts,
        frequency: newSettings.frequency,
        due_alerts: newSettings.dueAlerts,
        overdue_alerts: newSettings.overdueAlerts,
        recurring_alerts: newSettings.recurringAlerts,
        days_before_due: newSettings.daysBeforeDue,
      };

      // Upsert
      const { error } = await supabase
        .from('notification_preferences')
        .upsert(payload as any, { onConflict: 'user_id' });

      if (error) throw error;

      toast({ title: "Configuração salva", description: "Suas preferências de notificação foram atualizadas." });
    } catch (error: any) {
      console.error('Error saving notification preferences:', error);
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    }
  };

  const handleToggle = (key: string, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleFrequencyChange = (value: string) => {
    const newSettings = { ...settings, frequency: value };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleDaysChange = (value: number) => {
    const newSettings = { ...settings, daysBeforeDue: value };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5 text-muted-foreground" />
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
              <p className="text-sm text-muted-foreground">Receba notificações importantes por email</p>
            </div>
            <Switch id="email-notifications" checked={settings.emailNotifications} onCheckedChange={(v) => handleToggle('emailNotifications', v)} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications">Notificações Push</Label>
              <p className="text-sm text-muted-foreground">Receba notificações no navegador</p>
            </div>
            <Switch id="push-notifications" checked={settings.pushNotifications} onCheckedChange={(v) => handleToggle('pushNotifications', v)} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="payment-reminders">Lembretes de Pagamento</Label>
              <p className="text-sm text-muted-foreground">Alertas sobre contas vencendo</p>
            </div>
            <Switch id="payment-reminders" checked={settings.paymentReminders} onCheckedChange={(v) => handleToggle('paymentReminders', v)} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="report-alerts">Alertas de Relatórios</Label>
              <p className="text-sm text-muted-foreground">Notificações sobre relatórios gerados</p>
            </div>
            <Switch id="report-alerts" checked={settings.reportAlerts} onCheckedChange={(v) => handleToggle('reportAlerts', v)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Frequência de Notificações</Label>
          <Select value={settings.frequency} onValueChange={handleFrequencyChange}>
            <SelectTrigger className="max-w-xs">
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

        <div className="border-t pt-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <h3 className="font-semibold">Alertas de Vencimento</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="due-alerts">Alertas de Vencimento Próximo</Label>
                <p className="text-sm text-muted-foreground">Notificar sobre transações próximas do vencimento</p>
              </div>
              <Switch id="due-alerts" checked={settings.dueAlerts} onCheckedChange={(v) => handleToggle('dueAlerts', v)} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="overdue-alerts">Alertas de Vencidas</Label>
                <p className="text-sm text-muted-foreground">Notificar sobre transações vencidas</p>
              </div>
              <Switch id="overdue-alerts" checked={settings.overdueAlerts} onCheckedChange={(v) => handleToggle('overdueAlerts', v)} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="recurring-alerts">Alertas de Recorrência</Label>
                <p className="text-sm text-muted-foreground">Notificar quando transações recorrentes forem geradas</p>
              </div>
              <Switch id="recurring-alerts" checked={settings.recurringAlerts} onCheckedChange={(v) => handleToggle('recurringAlerts', v)} />
            </div>

            {settings.dueAlerts && (
              <div className="space-y-2">
                <Label htmlFor="days-before-due">Dias antes do vencimento</Label>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="days-before-due"
                    type="number"
                    min="1"
                    max="30"
                    value={settings.daysBeforeDue}
                    onChange={(e) => handleDaysChange(parseInt(e.target.value) || 3)}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground">dias</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Você será notificado {settings.daysBeforeDue} dias antes do vencimento
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
