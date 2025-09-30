
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CashFlowChart = () => {
  const data = [
    { month: 'Jan', receitas: 4800, despesas: 3200, saldo: 1600 },
    { month: 'Fev', receitas: 5200, despesas: 3500, saldo: 1700 },
    { month: 'Mar', receitas: 4600, despesas: 3800, saldo: 800 },
    { month: 'Abr', receitas: 6100, despesas: 4200, saldo: 1900 },
    { month: 'Mai', receitas: 5800, despesas: 3900, saldo: 1900 },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Fluxo de Caixa - Últimos 5 Meses</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={formatCurrency} />
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
          <Legend />
          <Bar dataKey="receitas" fill="#10b981" name="Receitas" radius={[4, 4, 0, 0]} />
          <Bar dataKey="despesas" fill="#ef4444" name="Despesas" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CashFlowChart;
