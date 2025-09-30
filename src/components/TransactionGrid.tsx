
import React, { useState } from 'react';
import { Transaction } from '@/types/financial';
import TransactionCard from './TransactionCard';
import PaymentModal from './PaymentModal';

interface TransactionGridProps {
  transactions: Transaction[];
  title: string;
  type?: 'income' | 'expense' | 'all';
  onPaymentComplete?: (transactionId: string, paymentMethod: string) => void;
  showPaymentActions?: boolean;
  limit?: number;
}

const TransactionGrid: React.FC<TransactionGridProps> = ({
  transactions,
  title,
  type = 'all',
  onPaymentComplete,
  showPaymentActions = false,
  limit
}) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const filteredTransactions = type === 'all' 
    ? transactions 
    : transactions.filter(t => t.type === type);

  const displayTransactions = limit ? filteredTransactions.slice(0, limit) : filteredTransactions;

  const handlePaymentClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentComplete = (transactionId: string, paymentMethod: string) => {
    if (onPaymentComplete) {
      onPaymentComplete(transactionId, paymentMethod);
    }
    setIsPaymentModalOpen(false);
    setSelectedTransaction(null);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-slate-100 px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
              <p className="text-gray-600 mt-1">Gerencie suas transações de forma visual e intuitiva</p>
            </div>
            {filteredTransactions.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full border shadow-sm">
                  📊 {filteredTransactions.length} {filteredTransactions.length === 1 ? 'transação' : 'transações'}
                </span>
                <span className="text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                  💰 Total: R$ {filteredTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString('pt-BR')}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="p-8">
          {displayTransactions.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-300 mb-6">
                <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="max-w-md mx-auto">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  📋 Nenhuma transação encontrada
                </h4>
                <p className="text-gray-500 mb-6">
                  {type === 'income' 
                    ? 'Suas receitas aparecerão aqui quando você adicionar novas entradas.' 
                    : 'Suas despesas aparecerão aqui quando você adicionar novos gastos.'
                  }
                </p>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-700">
                    💡 <strong>Dica:</strong> Use o botão "Nova {type === 'income' ? 'Receita' : 'Despesa'}" 
                    no canto superior direito para começar a registrar suas transações.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {displayTransactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    onPaymentClick={handlePaymentClick}
                    showPaymentActions={showPaymentActions}
                  />
                ))}
              </div>

              {limit && filteredTransactions.length > limit && (
                <div className="mt-8 text-center bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
                  <p className="text-gray-600 mb-4">
                    🔍 Mostrando {limit} de {filteredTransactions.length} transações
                  </p>
                  <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm bg-blue-50 hover:bg-blue-100 px-6 py-3 rounded-lg border border-blue-200 transition-all hover:shadow-md transform hover:scale-105">
                    📋 Ver todas as {filteredTransactions.length - limit} transações restantes
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <PaymentModal
        transaction={selectedTransaction}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentComplete={handlePaymentComplete}
      />
    </>
  );
};

export default TransactionGrid;
