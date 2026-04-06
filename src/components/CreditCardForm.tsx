import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { CreditCard } from '@/types/financial';
import type { CreditCardInput } from '@/hooks/useCreditCards';
import { CreditCard as CreditCardIcon } from 'lucide-react';

interface CreditCardFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreditCardInput) => Promise<any>;
  editingCard?: CreditCard | null;
}

const brands = [
  { id: 'visa', name: 'Visa' },
  { id: 'mastercard', name: 'Mastercard' },
  { id: 'elo', name: 'Elo' },
  { id: 'amex', name: 'American Express' },
  { id: 'outro', name: 'Outro' },
];

const cardColors = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316',
  '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#1e293b',
];

const CreditCardForm: React.FC<CreditCardFormProps> = ({ isOpen, onClose, onSubmit, editingCard }) => {
  const [form, setForm] = useState<CreditCardInput>({
    name: '', brand: 'visa', last_four_digits: '', credit_limit: 0,
    closing_day: 1, due_day: 10, color: '#6366f1',
  });

  useEffect(() => {
    if (editingCard) {
      setForm({
        name: editingCard.name, brand: editingCard.brand,
        last_four_digits: editingCard.last_four_digits || '',
        credit_limit: Number(editingCard.credit_limit),
        closing_day: editingCard.closing_day, due_day: editingCard.due_day,
        color: editingCard.color || '#6366f1',
      });
    } else {
      setForm({ name: '', brand: 'visa', last_four_digits: '', credit_limit: 0, closing_day: 1, due_day: 10, color: '#6366f1' });
    }
  }, [editingCard, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await onSubmit(form);
    if (!result.error) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCardIcon className="h-5 w-5 text-primary" />
            {editingCard ? 'Editar Cartão' : 'Novo Cartão'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Apelido do Cartão *</Label>
            <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Nubank Pessoal" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Bandeira *</Label>
              <Select value={form.brand} onValueChange={v => setForm(p => ({ ...p, brand: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {brands.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Últimos 4 dígitos</Label>
              <Input value={form.last_four_digits} onChange={e => setForm(p => ({ ...p, last_four_digits: e.target.value.replace(/\D/g, '').slice(0, 4) }))} placeholder="1234" maxLength={4} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Limite (R$) *</Label>
            <Input type="number" step="0.01" min="0" value={form.credit_limit || ''} onChange={e => setForm(p => ({ ...p, credit_limit: parseFloat(e.target.value) || 0 }))} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Dia do Fechamento *</Label>
              <Input type="number" min="1" max="31" value={form.closing_day} onChange={e => setForm(p => ({ ...p, closing_day: parseInt(e.target.value) || 1 }))} />
            </div>
            <div className="space-y-2">
              <Label>Dia do Vencimento *</Label>
              <Input type="number" min="1" max="31" value={form.due_day} onChange={e => setForm(p => ({ ...p, due_day: parseInt(e.target.value) || 10 }))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Cor do Cartão</Label>
            <div className="flex gap-2 flex-wrap">
              {cardColors.map(c => (
                <button key={c} type="button" onClick={() => setForm(p => ({ ...p, color: c }))}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${form.color === c ? 'border-foreground scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancelar</Button>
            <Button type="submit" className="flex-1">{editingCard ? 'Atualizar' : 'Cadastrar'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreditCardForm;
