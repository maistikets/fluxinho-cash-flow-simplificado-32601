
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { CreditCard, CreditCardTransaction } from '@/types/financial';
import { TrendingUp } from 'lucide-react';

interface CreditCardSpendingChartProps {
  cards: CreditCard[];
  transactions: CreditCardTransaction[];
}

const CreditCardSpendingChart: React.FC<CreditCardSpendingChartProps> = ({ cards, transactions }) => {
  const chartData = useMemo(() => {
    const now = new Date();
    const months: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    }

    return months.map(month => {
      const label = new Date(parseInt(month.split('-')[0]), parseInt(month.split('-')[1]) - 1, 1)
        .toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      
      const entry: Record<string, any> = { month: label };
      
      cards.forEach(card => {
        const total = transactions
          .filter(t => t.card_id === card.id && t.reference_month.startsWith(month))
          .reduce((sum, t) => sum + Number(t.installment_amount), 0);
        entry[card.name] = total;
      });

      return entry;
    });
  }, [cards, transactions]);

  const colors = useMemo(() => {
    const defaults = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
    return cards.map((card, i) => card.color || defaults[i % defaults.length]);
  }, [cards]);

  if (cards.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-indigo-500" />
          Evolução de Gastos por Cartão
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `R$${v}`} />
            <Tooltip
              formatter={(value: number, name: string) => [`R$ ${value.toFixed(2)}`, name]}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
            />
            <Legend />
            {cards.map((card, i) => (
              <Bar key={card.id} dataKey={card.name} fill={colors[i]} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default CreditCardSpendingChart;
