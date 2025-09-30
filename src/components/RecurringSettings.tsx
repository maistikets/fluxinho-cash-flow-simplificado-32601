import React, { useState } from 'react';
import { Transaction } from '@/types/financial';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Repeat, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface RecurringSettingsProps {
  transaction: Transaction;
  onUpdate: (
    transactionId: string,
    isRecurring: boolean,
    frequency?: Transaction['recurringFrequency'],
    endDate?: string
  ) => void;
}

const RecurringSettings: React.FC<RecurringSettingsProps> = ({ transaction, onUpdate }) => {
  const [isRecurring, setIsRecurring] = useState(transaction.isRecurring || false);
  const [frequency, setFrequency] = useState<Transaction['recurringFrequency']>(
    transaction.recurringFrequency || 'monthly'
  );
  const [endDate, setEndDate] = useState(transaction.recurringEndDate || '');

  const handleSave = () => {
    onUpdate(transaction.id, isRecurring, frequency, endDate);
  };

  const frequencyLabels = {
    weekly: 'Semanal',
    monthly: 'Mensal',
    quarterly: 'Trimestral',
    yearly: 'Anual'
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Repeat className="h-5 w-5 text-blue-500" />
          <div>
            <CardTitle>Configurar Recorrência</CardTitle>
            <CardDescription>
              Configure se esta transação deve se repetir automaticamente
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="recurring-switch">Transação Recorrente</Label>
            <p className="text-sm text-gray-500">
              Gerar automaticamente novas ocorrências desta transação
            </p>
          </div>
          <Switch
            id="recurring-switch"
            checked={isRecurring}
            onCheckedChange={setIsRecurring}
          />
        </div>

        {isRecurring && (
          <>
            <div className="space-y-2">
              <Label>Frequência</Label>
              <Select value={frequency} onValueChange={(value: Transaction['recurringFrequency']) => setFrequency(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                  <SelectItem value="quarterly">Trimestral (3 meses)</SelectItem>
                  <SelectItem value="yearly">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date">Data de Fim (opcional)</Label>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  placeholder="Selecione uma data de fim"
                />
              </div>
              <p className="text-xs text-gray-500">
                Deixe em branco para que a recorrência continue indefinidamente
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Resumo da Recorrência</h4>
              <p className="text-sm text-blue-700">
                Esta {transaction.type === 'income' ? 'receita' : 'despesa'} se repetirá {frequencyLabels[frequency!].toLowerCase()}
                {endDate && ` até ${format(new Date(endDate), 'dd/MM/yyyy')}`}.
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Novas transações serão criadas automaticamente quando a atual for marcada como paga.
              </p>
            </div>
          </>
        )}

        <div className="flex justify-end space-x-2">
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Salvar Configurações
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecurringSettings;