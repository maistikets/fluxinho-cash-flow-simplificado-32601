import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { CreditCard, CreditCardTransaction } from '@/types/financial';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Lock, Unlock, DollarSign, FileText, CreditCard as CreditCardIcon } from 'lucide-react';

interface CreditCardDetailProps {
  isOpen: boolean;
  onClose: () => void;
  card: CreditCard;
  transactions: CreditCardTransaction[];
  onPayInvoice?: (cardId: string, amount: number, paymentMethod: string) => Promise<void>;
}

function getInvoiceStatus(card: CreditCard) {
  const now = new Date();
  const day = now.getDate();
  const isClosed = day >= card.closing_day;
  return {
    isClosed,
    label: isClosed ? 'Fatura Fechada' : 'Fatura Aberta',
    color: isClosed ? 'text-red-600' : 'text-green-600',
    bgColor: isClosed ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200',
    badgeVariant: isClosed ? 'destructive' as const : 'default' as const,
  };
}

const paymentMethods = [
  { id: 'dinheiro', name: 'Dinheiro', icon: DollarSign },
  { id: 'pix', name: 'PIX', icon: DollarSign },
  { id: 'transferencia', name: 'Transferência Bancária', icon: CreditCardIcon },
  { id: 'boleto', name: 'Boleto', icon: FileText },
];

const CreditCardDetail: React.FC<CreditCardDetailProps> = ({ isOpen, onClose, card, transactions, onPayInvoice }) => {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthTxs = transactions.filter(t => t.card_id === card.id && t.reference_month.startsWith(currentMonth));
  const totalFatura = monthTxs.reduce((s, t) => s + Number(t.installment_amount), 0);
  const status = getInvoiceStatus(card);

  const [showPayForm, setShowPayForm] = useState(false);
  const [payMethod, setPayMethod] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  const handlePay = async () => {
    if (!payMethod || !onPayInvoice) return;
    setIsPaying(true);
    try {
      await onPayInvoice(card.id, totalFatura, payMethod);
      setShowPayForm(false);
      setPayMethod('');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: card.color || '#6366f1' }} />
            {card.name} {card.last_four_digits && `•••• ${card.last_four_digits}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status da fatura */}
          <div className={`flex items-center gap-2 p-3 rounded-lg border ${status.bgColor}`}>
            {status.isClosed ? <Lock className="h-4 w-4 text-red-500" /> : <Unlock className="h-4 w-4 text-green-500" />}
            <span className={`font-semibold text-sm ${status.color}`}>{status.label}</span>
            <span className="text-xs text-muted-foreground ml-auto">Fecha dia {card.closing_day} · Vence dia {card.due_day}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Card><CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Fatura Atual</p>
              <p className="text-lg font-bold text-destructive">R$ {totalFatura.toFixed(2)}</p>
            </CardContent></Card>
            <Card><CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Vencimento</p>
              <p className="text-lg font-bold">Dia {card.due_day}</p>
            </CardContent></Card>
          </div>

          {/* Botão pagar fatura */}
          {totalFatura > 0 && onPayInvoice && (
            <div className="space-y-3">
              {!showPayForm ? (
                <Button onClick={() => setShowPayForm(true)} className="w-full gap-2" variant="default">
                  <DollarSign className="h-4 w-4" /> Pagar Fatura — R$ {totalFatura.toFixed(2)}
                </Button>
              ) : (
                <div className="p-4 border rounded-lg space-y-3 bg-muted/30">
                  <Label className="text-sm font-medium">Forma de Pagamento</Label>
                  <Select value={payMethod} onValueChange={setPayMethod}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map(m => (
                        <SelectItem key={m.id} value={m.id}>
                          <div className="flex items-center gap-2"><m.icon className="h-4 w-4" />{m.name}</div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button onClick={handlePay} disabled={!payMethod || isPaying} className="flex-1">
                      {isPaying ? 'Pagando...' : `Confirmar Pagamento`}
                    </Button>
                    <Button variant="outline" onClick={() => { setShowPayForm(false); setPayMethod(''); }}>Cancelar</Button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2">Compras do Mês ({format(now, 'MMMM yyyy', { locale: ptBR })})</h3>
            {monthTxs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhuma compra registrada neste mês.</p>
            ) : (
              <div className="space-y-2">
                {monthTxs.map(tx => (
                  <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{tx.description}</p>
                      {tx.total_installments > 1 && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          {tx.installment_number}/{tx.total_installments}x
                        </Badge>
                      )}
                    </div>
                    <p className="font-semibold text-sm">R$ {Number(tx.installment_amount).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { getInvoiceStatus };
export default CreditCardDetail;
