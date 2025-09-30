
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Transaction } from '@/types/financial';
import { CreditCard, Banknote, Smartphone, Building, CheckCircle, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: (transactionId: string, paymentMethod: string, paymentDate?: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  transaction,
  isOpen,
  onClose,
  onPaymentComplete
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const paymentMethods = [
    { id: 'dinheiro', name: 'Dinheiro', icon: Banknote },
    { id: 'cartao_credito', name: 'Cartão de Crédito', icon: CreditCard },
    { id: 'cartao_debito', name: 'Cartão de Débito', icon: CreditCard },
    { id: 'pix', name: 'PIX', icon: Smartphone },
    { id: 'transferencia', name: 'Transferência Bancária', icon: Building },
  ];

  const handlePayment = async () => {
    if (!selectedPaymentMethod || !transaction || !paymentDate) return;

    setIsProcessing(true);
    
    // Simular processamento de pagamento
    setTimeout(() => {
      onPaymentComplete(transaction.id, selectedPaymentMethod, paymentDate);
      setIsProcessing(false);
      setSelectedPaymentMethod('');
      setPaymentDate(new Date().toISOString().split('T')[0]);
      onClose();
      
      toast({
        title: "Pagamento registrado!",
        description: `${transaction.type === 'income' ? 'Receita' : 'Despesa'} marcada como paga via ${paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}`,
      });
    }, 1500);
  };

  if (!transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Finalizar {transaction.type === 'income' ? 'Recebimento' : 'Pagamento'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900">{transaction.description}</h3>
            <p className="text-sm text-gray-600 mt-1">Categoria: {transaction.category}</p>
            <p className="text-lg font-bold text-blue-600 mt-2">
              {formatCurrency(transaction.amount)}
            </p>
          </div>

          <div>
            <Label className="text-base font-medium">Data do Pagamento</Label>
            <div className="mt-2">
              <Input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">Forma de Pagamento</Label>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={`flex items-center space-x-3 p-3 border rounded-lg transition-colors ${
                      selectedPaymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium">{method.name}</span>
                    {selectedPaymentMethod === method.id && (
                      <CheckCircle className="h-4 w-4 text-blue-500 ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button
              onClick={handlePayment}
              disabled={!selectedPaymentMethod || !paymentDate || isProcessing}
              className="flex-1"
            >
              {isProcessing ? 'Processando...' : 'Confirmar Pagamento'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
