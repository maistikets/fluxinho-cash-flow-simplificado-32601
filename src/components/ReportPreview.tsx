
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { Transaction } from '@/types/financial';

interface ReportPreviewProps {
  transactions: Transaction[];
  startDate: string;
  endDate: string;
  selectedCategory: string;
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({
  transactions,
  startDate,
  endDate,
  selectedCategory,
  isOpen,
  onClose,
  onDownload
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Prévia do Relatório Financeiro</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="bg-white p-6 space-y-6">
          {/* Header */}
          <div className="text-center border-b pb-4">
            <h1 className="text-2xl font-bold text-gray-900">Relatório Financeiro - Fluxinho</h1>
            <p className="text-gray-600 mt-2">
              Período: {startDate ? formatDate(startDate) : 'Início'} até {endDate ? formatDate(endDate) : 'Hoje'}
            </p>
            {selectedCategory && (
              <p className="text-gray-600">Categoria: {selectedCategory}</p>
            )}
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Resumo Financeiro</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-100 rounded-lg">
                <p className="text-2xl font-bold text-green-700">{formatCurrency(totalIncome)}</p>
                <p className="text-sm text-green-600">Total de Receitas</p>
              </div>
              <div className="text-center p-4 bg-red-100 rounded-lg">
                <p className="text-2xl font-bold text-red-700">{formatCurrency(totalExpenses)}</p>
                <p className="text-sm text-red-600">Total de Despesas</p>
              </div>
              <div className={`text-center p-4 rounded-lg ${balance >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
                <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                  {formatCurrency(balance)}
                </p>
                <p className={`text-sm ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  Saldo Final
                </p>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Transações ({transactions.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Data</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Descrição</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Categoria</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Valor</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.slice(0, 20).map((transaction, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatDate(transaction.dueDate)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {transaction.description}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {transaction.category}
                      </td>
                      <td className={`px-4 py-3 text-sm text-right font-medium ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          transaction.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status === 'paid' ? 'Pago' : 
                           transaction.status === 'pending' ? 'Pendente' : 'Vencido'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {transactions.length > 20 && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Mostrando 20 de {transactions.length} transações. O relatório completo incluirá todas.
                </p>
              )}
            </div>
          </div>

          {/* Download Button */}
          <div className="flex justify-center pt-6 border-t">
            <Button onClick={onDownload} className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Baixar Relatório PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportPreview;
