
import React, { useState } from 'react';
import { Transaction } from '@/types/financial';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CreditCard, CheckCircle, User, Phone, Calendar, Badge } from 'lucide-react';
import PaymentModal from './PaymentModal';

interface TransactionListProps {
  transactions: Transaction[];
  title: string;
  type?: 'income' | 'expense' | 'all';
  onPaymentComplete?: (transactionId: string, paymentMethod: string) => void;
  showPaymentActions?: boolean;
  limit?: number;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusConfig = (status: Transaction['status']) => {
    switch (status) {
      case 'paid':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-200',
          label: 'Pago',
          icon: '✓'
        };
      case 'pending':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-200',
          label: 'Pendente',
          icon: '⏳'
        };
      case 'overdue':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          border: 'border-red-200',
          label: 'Vencido',
          icon: '⚠️'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-200',
          label: status,
          icon: '●'
        };
    }
  };

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
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {filteredTransactions.length > 0 && (
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>
                  Total: {formatCurrency(filteredTransactions.reduce((sum, t) => sum + t.amount, 0))}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {displayTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Nenhuma transação encontrada</h4>
              <p className="text-gray-500">
                {type === 'income' 
                  ? 'Suas receitas aparecerão aqui quando você adicionar novas entradas.' 
                  : 'Suas despesas aparecerão aqui quando você adicionar novos gastos.'
                }
              </p>
            </div>
          ) : (
            displayTransactions.map((transaction) => {
              const statusConfig = getStatusConfig(transaction.status);
              return (
                <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-base font-medium text-gray-900 mb-1">
                            {transaction.description}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Badge className="h-3 w-3" />
                              <span>{transaction.category}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(transaction.dueDate)}</span>
                            </div>
                            {transaction.paymentMethod && (
                              <div className="flex items-center space-x-1">
                                <CreditCard className="h-3 w-3" />
                                <span>{transaction.paymentMethod}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 ml-6">
                          <div className="text-right">
                            <div className={cn(
                              "text-lg font-semibold",
                              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                            )}>
                              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </div>
                            <div className={cn(
                              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                              statusConfig.bg,
                              statusConfig.text,
                              statusConfig.border
                            )}>
                              <span className="mr-1">{statusConfig.icon}</span>
                              {statusConfig.label}
                            </div>
                          </div>
                          
                          {showPaymentActions && transaction.status !== 'paid' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePaymentClick(transaction)}
                              className="flex-shrink-0"
                            >
                              {transaction.status === 'overdue' ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <CreditCard className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {(transaction.client || transaction.phone) && (
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          {transaction.client && (
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{transaction.client}</span>
                            </div>
                          )}
                          {transaction.phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="h-3 w-3" />
                              <span>{transaction.phone}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          
          {limit && filteredTransactions.length > limit && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium py-2">
                Ver todas ({filteredTransactions.length - limit} transações restantes)
              </button>
            </div>
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

export default TransactionList;
