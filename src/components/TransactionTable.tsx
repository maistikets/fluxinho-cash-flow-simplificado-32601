import React, { useState, useMemo } from 'react';
import { Transaction } from '@/types/financial';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, CheckCircle, Search, ChevronLeft, ChevronRight, ArrowUpDown, Edit2, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import PaymentModal from './PaymentModal';

interface TransactionTableProps {
  transactions: Transaction[];
  type?: 'income' | 'expense' | 'all';
  onPaymentComplete?: (transactionId: string, paymentMethod: string, paymentDate?: string) => void;
  onEditTransaction?: (transaction: Transaction) => void;
  onDeleteTransaction?: (transactionId: string) => void;
  showPaymentActions?: boolean;
  showEditActions?: boolean;
  hideTotal?: boolean;
}

type SortField = 'date' | 'description' | 'amount' | 'status' | 'category' | 'client';
type SortOrder = 'asc' | 'desc';

const TransactionTable: React.FC<TransactionTableProps> = ({ 
  transactions, 
  type = 'all',
  onPaymentComplete,
  onEditTransaction,
  onDeleteTransaction,
  showPaymentActions = false,
  showEditActions = false,
  hideTotal = false
}) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const filteredTransactions = useMemo(() => {
    let filtered = type === 'all' 
      ? transactions 
      : transactions.filter(t => t.type === type);

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.client && t.client.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'date':
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'description':
          comparison = a.description.localeCompare(b.description);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'status':
          const statusOrder = { 'overdue': 0, 'pending': 1, 'paid': 2 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'client':
          const clientA = a.client || '';
          const clientB = b.client || '';
          comparison = clientA.localeCompare(clientB);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [transactions, type, searchTerm, statusFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        return { label: 'Pago', className: 'bg-green-100 text-green-800 border-green-200' };
      case 'pending':
        return { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
      case 'overdue':
        return { label: 'Vencido', className: 'bg-red-100 text-red-800 border-red-200' };
      default:
        return { label: status, className: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handlePaymentClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentComplete = (transactionId: string, paymentMethod: string, paymentDate?: string) => {
    if (onPaymentComplete) {
      onPaymentComplete(transactionId, paymentMethod, paymentDate);
    }
    setIsPaymentModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleEditClick = (transaction: Transaction) => {
    if (onEditTransaction) {
      onEditTransaction(transaction);
    }
  };

  const handleDeleteClick = (transactionId: string) => {
    if (onDeleteTransaction) {
      onDeleteTransaction(transactionId);
    }
  };

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Header with filters */}
        <div className="p-3 sm:p-4 border-b border-gray-200 space-y-3 sm:space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 sm:items-center sm:justify-between">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-1">
              Transações ({filteredTransactions.length})
            </h3>
            {!hideTotal && (
              <div className="text-sm sm:text-base text-gray-600 font-medium">
                Total: {formatCurrency(totalAmount)}
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por descrição ou cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm sm:text-base"
              />
            </div>
            
            <div className="flex gap-3 sm:gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-32 min-w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="overdue">Vencido</SelectItem>
                </SelectContent>
              </Select>

              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger className="w-full sm:w-24 min-w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 text-xs sm:text-sm"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Data</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 text-xs sm:text-sm"
                  onClick={() => handleSort('description')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Descrição</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 text-xs sm:text-sm"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Categoria</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 text-xs sm:text-sm"
                  onClick={() => handleSort('client')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Cliente</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 text-right text-xs sm:text-sm"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Valor</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 text-xs sm:text-sm"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                {(showPaymentActions || showEditActions) && <TableHead className="text-center text-xs sm:text-sm">Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={(showPaymentActions || showEditActions) ? 7 : 6} className="text-center py-8 text-gray-500">
                    Nenhuma transação encontrada
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTransactions.map((transaction) => {
                  const statusConfig = getStatusConfig(transaction.status);
                  return (
                    <TableRow key={transaction.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-xs sm:text-sm">
                        <div className="whitespace-nowrap">
                          {formatDate(transaction.dueDate)}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        <div className="max-w-[120px] sm:max-w-xs truncate" title={transaction.description}>
                          {transaction.description}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        <div className="max-w-[80px] truncate" title={transaction.category}>
                          {transaction.category}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        <div className="max-w-[100px] truncate" title={transaction.client || '-'}>
                          {transaction.client || '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-xs sm:text-sm">
                        <span className={cn(
                          "font-semibold whitespace-nowrap",
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        )}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        <span className={cn(
                          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap",
                          statusConfig.className
                        )}>
                          {statusConfig.label}
                        </span>
                      </TableCell>
                      {(showPaymentActions || showEditActions) && (
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1 flex-wrap">
                            {showEditActions && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditClick(transaction)}
                                  className="h-9 w-9 sm:h-8 sm:w-8 p-0 min-w-[36px] min-h-[36px]"
                                  title="Editar transação"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-9 w-9 sm:h-8 sm:w-8 p-0 text-red-600 hover:text-red-700 min-w-[36px] min-h-[36px]"
                                      title="Excluir transação"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className="w-[95vw] max-w-lg">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle className="text-base sm:text-lg">Excluir Transação</AlertDialogTitle>
                                      <AlertDialogDescription className="text-sm sm:text-base">
                                        Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                      <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDeleteClick(transaction.id)}
                                        className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                                      >
                                        Excluir
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </>
                            )}
                            {showPaymentActions && transaction.status !== 'paid' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePaymentClick(transaction)}
                                className="h-9 w-9 sm:h-8 sm:w-8 p-0 min-w-[36px] min-h-[36px]"
                                title="Marcar como pago"
                              >
                                {transaction.status === 'overdue' ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <CreditCard className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-3 sm:px-4 py-3 border-t border-gray-200 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} a{' '}
              {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} de{' '}
              {filteredTransactions.length} resultados
            </div>
            <div className="flex items-center justify-center sm:justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs sm:text-sm text-gray-700 px-2">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
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

export default TransactionTable;
