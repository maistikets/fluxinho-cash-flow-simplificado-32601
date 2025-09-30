import { useState, useEffect, useMemo } from 'react';
import { NotificationAlert, Transaction } from '@/types/financial';
import { differenceInDays, parseISO, addDays, format } from 'date-fns';

export const useNotifications = (transactions: Transaction[]) => {
  const [alerts, setAlerts] = useState<NotificationAlert[]>([]);
  const [notificationSettings, setNotificationSettings] = useState({
    daysBeforeDue: 3,
    enableDueAlerts: true,
    enableOverdueAlerts: true,
    enableRecurringAlerts: true
  });

  // Gerar alertas baseados nas transações
  const generateAlerts = useMemo(() => {
    const newAlerts: NotificationAlert[] = [];
    const today = new Date();

    transactions.forEach(transaction => {
      if (transaction.status === 'paid') return;

      const dueDate = parseISO(transaction.dueDate);
      const daysUntilDue = differenceInDays(dueDate, today);

      // Alerta de vencimento próximo
      if (daysUntilDue <= notificationSettings.daysBeforeDue && daysUntilDue >= 0 && notificationSettings.enableDueAlerts) {
        const existingAlert = alerts.find(alert => 
          alert.transactionId === transaction.id && alert.type === 'due_soon'
        );

        if (!existingAlert) {
          newAlerts.push({
            id: `due_soon_${transaction.id}_${Date.now()}`,
            transactionId: transaction.id,
            type: 'due_soon',
            message: `${transaction.type === 'income' ? 'Receita' : 'Despesa'} "${transaction.description}" vence em ${daysUntilDue === 0 ? 'hoje' : `${daysUntilDue} dia(s)`}`,
            dueDate: transaction.dueDate,
            isRead: false,
            createdAt: new Date().toISOString()
          });
        }
      }

      // Alerta de vencido
      if (daysUntilDue < 0 && notificationSettings.enableOverdueAlerts) {
        const existingAlert = alerts.find(alert => 
          alert.transactionId === transaction.id && alert.type === 'overdue'
        );

        if (!existingAlert) {
          newAlerts.push({
            id: `overdue_${transaction.id}_${Date.now()}`,
            transactionId: transaction.id,
            type: 'overdue',
            message: `${transaction.type === 'income' ? 'Receita' : 'Despesa'} "${transaction.description}" está vencida há ${Math.abs(daysUntilDue)} dia(s)`,
            dueDate: transaction.dueDate,
            isRead: false,
            createdAt: new Date().toISOString()
          });
        }
      }
    });

    return newAlerts;
  }, [transactions, notificationSettings, alerts]);

  // Atualizar alertas quando necessário
  useEffect(() => {
    const newAlerts = generateAlerts;
    if (newAlerts.length > 0) {
      setAlerts(prev => [...prev, ...newAlerts]);
    }
  }, [generateAlerts]);

  const markAsRead = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  };

  const clearAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  return {
    alerts,
    unreadCount,
    markAsRead,
    clearAlert,
    notificationSettings,
    setNotificationSettings
  };
};