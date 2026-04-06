import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CreditCard, CreditCardTransaction } from '@/types/financial';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CreditCardDetailProps {
  isOpen: boolean;
  onClose: () => void;
  card: CreditCard;
  transactions: CreditCardTransaction[];
}

const CreditCardDetail: React.FC<CreditCardDetailProps> = ({ isOpen, onClose, card, transactions }) => {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthTxs = transactions.filter(t => t.card_id === card.id && t.reference_month.startsWith(currentMonth));
  const totalFatura = monthTxs.reduce((s, t) => s + Number(t.installment_amount), 0);

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

export default CreditCardDetail;
