
import React from 'react';
import { Transaction } from '@/types/financial';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  CheckCircle, 
  User, 
  Phone, 
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface TransactionCardProps {
  transaction: Transaction;
  onPaymentClick?: (transaction: Transaction) => void;
  showPaymentActions?: boolean;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onPaymentClick,
  showPaymentActions = false
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

  const getStatusConfig = (status: Transaction['status']) => {
    switch (status) {
      case 'paid':
        return {
          bg: 'border-l-green-500 bg-gradient-to-r from-green-50 to-emerald-50',
          text: 'text-green-800',
          badge: 'bg-green-500 text-white',
          label: '✅ Pago',
          icon: CheckCircle
        };
      case 'pending':
        return {
          bg: 'border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-amber-50',
          text: 'text-yellow-800',
          badge: 'bg-yellow-500 text-white',
          label: '⏳ Pendente',
          icon: Clock
        };
      case 'overdue':
        return {
          bg: 'border-l-red-500 bg-gradient-to-r from-red-50 to-rose-50',
          text: 'text-red-800',
          badge: 'bg-red-500 text-white',
          label: '🔴 Vencido',
          icon: AlertTriangle
        };
      default:
        return {
          bg: 'border-l-gray-500 bg-gradient-to-r from-gray-50 to-slate-50',
          text: 'text-gray-800',
          badge: 'bg-gray-500 text-white',
          label: status,
          icon: Clock
        };
    }
  };

  const statusConfig = getStatusConfig(transaction.status);
  const isIncome = transaction.type === 'income';

  const getActionButtonConfig = () => {
    if (transaction.status === 'paid') return null;
    
    if (transaction.status === 'overdue') {
      return {
        text: isIncome ? '💰 Confirmar Recebimento' : '✅ Confirmar Pagamento',
        icon: CheckCircle,
        className: `w-full ${isIncome ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'} text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`
      };
    }
    
    return {
      text: isIncome ? '💳 Receber Agora' : '💳 Pagar Agora',
      icon: CreditCard,
      className: `w-full ${isIncome ? 'bg-white border-2 border-green-400 text-green-700 hover:bg-green-50' : 'bg-white border-2 border-blue-400 text-blue-700 hover:bg-blue-50'} font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200`
    };
  };

  const actionConfig = getActionButtonConfig();

  return (
    <div className={cn(
      "bg-white rounded-2xl border-l-4 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden max-w-full",
      statusConfig.bg,
      "hover:scale-[1.02] transform group"
    )}>
      {/* Header com ícone de tipo e status */}
      <div className="p-4 sm:p-5 lg:p-6">
        <div className="flex items-start justify-between mb-4 gap-3">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className={cn(
              "p-2 sm:p-3 rounded-xl shadow-md flex-shrink-0",
              isIncome 
                ? "bg-gradient-to-r from-green-500 to-emerald-600" 
                : "bg-gradient-to-r from-red-500 to-rose-600"
            )}>
              {isIncome ? (
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              ) : (
                <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-100 px-2 py-1 rounded-full line-clamp-1">
                {transaction.category}
              </span>
            </div>
          </div>
          
          <span className={cn(
            "px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-md flex-shrink-0",
            statusConfig.badge
          )}>
            {statusConfig.label}
          </span>
        </div>

        {/* Título e valor - Destaque maior */}
        <div className="mb-4 sm:mb-6">
          <h3 className="font-bold text-gray-900 text-lg sm:text-xl mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors">
            {transaction.description}
          </h3>
          <div className="flex items-center space-x-3 p-3 sm:p-4 rounded-xl bg-white shadow-inner border">
            <div className={cn(
              "p-2 rounded-lg flex-shrink-0",
              isIncome ? "bg-green-100" : "bg-red-100"
            )}>
              <DollarSign className={cn(
                "h-5 w-5 sm:h-6 sm:w-6",
                isIncome ? "text-green-600" : "text-red-600"
              )} />
            </div>
            <div className="min-w-0 flex-1">
              <span className={cn(
                "text-2xl sm:text-3xl font-black tracking-tight line-clamp-1",
                isIncome ? "text-green-600" : "text-red-600"
              )}>
                {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
              </span>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {isIncome ? 'Valor a receber' : 'Valor a pagar'}
              </p>
            </div>
          </div>
        </div>

        {/* Informações organizadas em cards menores */}
        <div className="grid grid-cols-1 gap-3 mb-4 sm:mb-6">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-xs sm:text-sm font-medium text-gray-900 block">Vencimento</span>
              <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">{formatDate(transaction.dueDate)}</p>
            </div>
          </div>
          
          {transaction.client && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-xs sm:text-sm font-medium text-gray-900 block">Cliente</span>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">{transaction.client}</p>
              </div>
            </div>
          )}
          
          {transaction.phone && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border">
              <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-xs sm:text-sm font-medium text-gray-900 block">Telefone</span>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">{transaction.phone}</p>
              </div>
            </div>
          )}
          
          {transaction.paymentMethod && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-xs sm:text-sm font-medium text-blue-900">Método de Pagamento: </span>
              <span className="text-xs sm:text-sm text-blue-700 font-semibold line-clamp-1">{transaction.paymentMethod}</span>
            </div>
          )}
        </div>

        {/* Botão de ação mais atrativo */}
        {showPaymentActions && actionConfig && (
          <div className="border-t border-gray-100 pt-4 sm:pt-6 -mx-4 sm:-mx-5 lg:-mx-6 px-4 sm:px-5 lg:px-6 bg-gray-50">
            <Button
              onClick={() => onPaymentClick && onPaymentClick(transaction)}
              className={actionConfig.className}
              size="lg"
            >
              <actionConfig.icon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
              <span className="text-sm sm:text-base line-clamp-1">{actionConfig.text}</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionCard;
