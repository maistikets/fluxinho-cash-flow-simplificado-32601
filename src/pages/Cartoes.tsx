import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Plus, CreditCard as CreditCardIcon, Trash2, Edit2 } from 'lucide-react';
import CreditCardSpendingChart from '@/components/CreditCardSpendingChart';
import { useCreditCards } from '@/hooks/useCreditCards';
import CreditCardForm from '@/components/CreditCardForm';
import CreditCardDetail from '@/components/CreditCardDetail';
import type { CreditCard } from '@/types/financial';

const brandLabels: Record<string, string> = {
  visa: 'Visa', mastercard: 'Mastercard', elo: 'Elo', amex: 'Amex', outro: 'Outro',
};

const Cartoes: React.FC = () => {
  const { cards, cardTransactions, isLoading, addCard, updateCard, deleteCard, getCardUsed, getCardAvailable } = useCreditCards();
  const [formOpen, setFormOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const [detailCard, setDetailCard] = useState<CreditCard | null>(null);

  const handleEdit = (card: CreditCard) => { setEditingCard(card); setFormOpen(true); };
  const handleCloseForm = () => { setFormOpen(false); setEditingCard(null); };

  if (isLoading) return <div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Carregando cartões...</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cartões de Crédito</h1>
          <p className="text-muted-foreground">Gerencie seus cartões e acompanhe faturas</p>
        </div>
        <Button onClick={() => setFormOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Novo Cartão
        </Button>
      </div>

      {cards.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCardIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-1">Nenhum cartão cadastrado</p>
            <p className="text-sm text-muted-foreground mb-4">Adicione seu primeiro cartão de crédito</p>
            <Button onClick={() => setFormOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> Adicionar Cartão</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map(card => {
            const used = getCardUsed(card.id);
            const limit = Number(card.credit_limit);
            const available = getCardAvailable(card.id);
            const pct = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;

            return (
              <Card key={card.id} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={() => setDetailCard(card)}>
                <div className="h-2" style={{ backgroundColor: card.color || '#6366f1' }} />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CreditCardIcon className="h-5 w-5" style={{ color: card.color || '#6366f1' }} />
                      {card.name}
                    </CardTitle>
                    <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(card)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => deleteCard(card.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{brandLabels[card.brand] || card.brand}</Badge>
                    {card.last_four_digits && <span className="text-xs text-muted-foreground">•••• {card.last_four_digits}</span>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Usado</span>
                      <span className="font-medium">R$ {used.toFixed(2)} / R$ {limit.toFixed(2)}</span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Disponível</span>
                    <span className="font-semibold text-green-600">R$ {available.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground pt-1 border-t">
                    <span>Fecha dia {card.closing_day}</span>
                    <span>Vence dia {card.due_day}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Gráfico de evolução */}
      {cards.length > 0 && (
        <CreditCardSpendingChart cards={cards} transactions={cardTransactions} />
      )}

      <CreditCardForm
        isOpen={formOpen}
        onClose={handleCloseForm}
        onSubmit={editingCard ? (data) => updateCard(editingCard.id, data) : addCard}
        editingCard={editingCard}
      />

      {detailCard && (
        <CreditCardDetail
          isOpen={!!detailCard}
          onClose={() => setDetailCard(null)}
          card={detailCard}
          transactions={cardTransactions}
        />
      )}
    </div>
  );
};

export default Cartoes;
