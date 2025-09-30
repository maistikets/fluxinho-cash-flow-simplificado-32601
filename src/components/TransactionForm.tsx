
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Transaction, Category } from '@/types/financial';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  User, 
  Phone, 
  CreditCard,
  Tag,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Repeat
} from 'lucide-react';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction?: (transaction: Omit<Transaction, 'id'>) => void;
  onUpdateTransaction?: (transactionId: string, transaction: Omit<Transaction, 'id'>) => void;
  categories: Category[];
  type: 'income' | 'expense';
  editingTransaction?: Transaction | null;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
  onUpdateTransaction,
  categories,
  type,
  editingTransaction
}) => {
  const [formData, setFormData] = useState({
    description: editingTransaction?.description || '',
    amount: editingTransaction?.amount?.toString() || '',
    category: editingTransaction?.category || '',
    customCategory: '',
    dueDate: editingTransaction?.dueDate || '',
    client: editingTransaction?.client || '',
    phone: editingTransaction?.phone || '',
    paymentMethod: editingTransaction?.paymentMethod || '',
    paymentDate: editingTransaction?.paymentDate || '',
    isPaid: editingTransaction?.status === 'paid' || false,
    isRecurring: editingTransaction?.isRecurring || false,
    recurringFrequency: (editingTransaction?.recurringFrequency || 'monthly') as Transaction['recurringFrequency'],
    recurringEndDate: editingTransaction?.recurringEndDate || ''
  });
  const { toast } = useToast();

  const filteredCategories = categories.filter(cat => cat.type === type);

  const paymentMethods = [
    { id: 'dinheiro', name: 'Dinheiro', icon: DollarSign },
    { id: 'cartao_credito', name: 'Cartão de Crédito', icon: CreditCard },
    { id: 'cartao_debito', name: 'Cartão de Débito', icon: CreditCard },
    { id: 'pix', name: 'PIX', icon: DollarSign },
    { id: 'transferencia', name: 'Transferência Bancária', icon: CreditCard },
    { id: 'boleto', name: 'Boleto', icon: FileText },
    { id: 'cheque', name: 'Cheque', icon: FileText }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.description || !formData.amount || (!formData.category && !formData.customCategory) || !formData.dueDate) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Se marcou como pago, precisa ter forma de pagamento
    if (formData.isPaid && !formData.paymentMethod) {
      toast({
        title: "Erro",
        description: "Para marcar como pago, selecione a forma de pagamento.",
        variant: "destructive"
      });
      return;
    }

    // Determinar categoria final
    const finalCategory = formData.category === 'Outros' ? formData.customCategory : formData.category;

    const transactionData: Omit<Transaction, 'id'> = {
      type,
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: finalCategory,
      dueDate: formData.dueDate,
      status: formData.isPaid ? 'paid' : 'pending',
      client: formData.client || undefined,
      phone: formData.phone || undefined,
      paymentMethod: formData.isPaid ? formData.paymentMethod : undefined,
      paymentDate: formData.isPaid ? (formData.paymentDate || new Date().toISOString().split('T')[0]) : undefined,
      isRecurring: formData.isRecurring,
      recurringFrequency: formData.isRecurring ? formData.recurringFrequency : undefined,
      recurringEndDate: formData.isRecurring && formData.recurringEndDate ? formData.recurringEndDate : undefined
    };

    if (editingTransaction && onUpdateTransaction) {
      onUpdateTransaction(editingTransaction.id, transactionData);
    } else if (onAddTransaction) {
      onAddTransaction(transactionData);
    }
    
    // Reset form
    setFormData({
      description: '',
      amount: '',
      category: '',
      customCategory: '',
      dueDate: '',
      client: '',
      phone: '',
      paymentMethod: '',
      paymentDate: '',
      isPaid: false,
      isRecurring: false,
      recurringFrequency: 'monthly',
      recurringEndDate: ''
    });
    
    onClose();
    
    toast({
      title: "Sucesso!",
      description: editingTransaction 
        ? `${type === 'income' ? 'Receita' : 'Despesa'} atualizada com sucesso.`
        : `${type === 'income' ? 'Receita' : 'Despesa'} cadastrada com sucesso${formData.isPaid ? ' e marcada como paga' : ''}.`,
    });
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const typeConfig = {
    income: {
      title: editingTransaction ? 'Editar Receita' : 'Nova Receita',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    expense: {
      title: editingTransaction ? 'Editar Despesa' : 'Nova Despesa',
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  };

  const config = typeConfig[type];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className={`${config.bgColor} ${config.borderColor} border-2 rounded-lg p-4 mb-4`}>
          <DialogTitle className="flex items-center gap-3">
            <div className={`p-2 ${config.bgColor} rounded-lg`}>
              <config.icon className={`h-6 w-6 ${config.color}`} />
            </div>
            <span className={config.color}>{config.title}</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4 text-gray-500" />
              Descrição *
            </Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Ex: Venda de produtos, Aluguel..."
              required
              className="h-11"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center gap-2 text-sm font-medium">
                <DollarSign className="h-4 w-4 text-gray-500" />
                Valor (R$) *
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                placeholder="0,00"
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-gray-500" />
                Data de Vencimento *
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                required
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="flex items-center gap-2 text-sm font-medium">
              <Tag className="h-4 w-4 text-gray-500" />
              Categoria *
            </Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.category === 'Outros' && (
            <div className="space-y-2">
              <Label htmlFor="customCategory" className="flex items-center gap-2 text-sm font-medium">
                <Tag className="h-4 w-4 text-gray-500" />
                Especificar Categoria *
              </Label>
              <Input
                id="customCategory"
                value={formData.customCategory}
                onChange={(e) => handleInputChange('customCategory', e.target.value)}
                placeholder="Digite a categoria personalizada"
                required
                className="h-11"
              />
            </div>
          )}

          {type === 'income' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client" className="flex items-center gap-2 text-sm font-medium">
                  <User className="h-4 w-4 text-gray-500" />
                  Nome do Cliente
                </Label>
                <Input
                  id="client"
                  value={formData.client}
                  onChange={(e) => handleInputChange('client', e.target.value)}
                  placeholder="Nome do cliente"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
                  <Phone className="h-4 w-4 text-gray-500" />
                  Telefone
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="h-11"
                />
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isPaid" 
                checked={formData.isPaid}
                onCheckedChange={(checked) => handleInputChange('isPaid', checked as boolean)}
              />
              <Label htmlFor="isPaid" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Marcar como já pago
              </Label>
            </div>

            {formData.isPaid && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentDate" className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    Data do Pagamento *
                  </Label>
                  <Input
                    id="paymentDate"
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) => handleInputChange('paymentDate', e.target.value)}
                    className="h-11"
                    max={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod" className="flex items-center gap-2 text-sm font-medium">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    Forma de Pagamento *
                  </Label>
                  <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecione a forma de pagamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          <div className="flex items-center gap-2">
                            <method.icon className="h-4 w-4" />
                            {method.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {!formData.isPaid && (
              <div className="space-y-2">
                <Label htmlFor="paymentMethodOptional" className="flex items-center gap-2 text-sm font-medium">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  Forma de Pagamento (Opcional)
                </Label>
                <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecione a forma de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id}>
                        <div className="flex items-center gap-2">
                          <method.icon className="h-4 w-4" />
                          {method.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Seção de Recorrência */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isRecurring" 
                checked={formData.isRecurring}
                onCheckedChange={(checked) => handleInputChange('isRecurring', checked as boolean)}
              />
              <Label htmlFor="isRecurring" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <Repeat className="h-4 w-4 text-blue-600" />
                Transação Recorrente
              </Label>
            </div>

            {formData.isRecurring && (
              <div className="grid grid-cols-2 gap-4 pl-6">
                <div className="space-y-2">
                  <Label htmlFor="recurringFrequency" className="text-sm font-medium">
                    Frequência
                  </Label>
                  <Select 
                    value={formData.recurringFrequency} 
                    onValueChange={(value: Transaction['recurringFrequency']) => handleInputChange('recurringFrequency', value)}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="quarterly">Trimestral</SelectItem>
                      <SelectItem value="yearly">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recurringEndDate" className="text-sm font-medium">
                    Data de Fim (opcional)
                  </Label>
                  <Input
                    id="recurringEndDate"
                    type="date"
                    value={formData.recurringEndDate}
                    onChange={(e) => handleInputChange('recurringEndDate', e.target.value)}
                    className="h-11"
                    min={formData.dueDate}
                  />
                </div>
              </div>
            )}

            {formData.isRecurring && (
              <div className="pl-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  ℹ️ Esta transação será automaticamente recriada com base na frequência selecionada quando for marcada como paga.
                </p>
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-11">
              Cancelar
            </Button>
            <Button type="submit" className={`flex-1 h-11 ${type === 'income' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
              {editingTransaction 
                ? 'Atualizar' 
                : formData.isPaid 
                  ? 'Cadastrar e Marcar como Pago' 
                  : 'Cadastrar'
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionForm;
