import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { usePlans, Plan } from '@/contexts/PlansContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

const PlanManagement = () => {
  const { plans, addPlan, updatePlan, deletePlan, togglePlanStatus } = usePlans();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    period: '',
    originalPrice: '',
    features: '',
    badge: '',
    highlight: false,
    active: true,
    order: 1
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      period: '',
      originalPrice: '',
      features: '',
      badge: '',
      highlight: false,
      active: true,
      order: 1
    });
    setEditingPlan(null);
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      period: plan.period,
      originalPrice: plan.originalPrice || '',
      features: plan.features.join('\n'),
      badge: plan.badge || '',
      highlight: plan.highlight,
      active: plan.active,
      order: plan.order
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.price || !formData.period) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const planData = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      period: formData.period,
      originalPrice: formData.originalPrice || undefined,
      features: formData.features.split('\n').filter(f => f.trim()),
      badge: formData.badge || undefined,
      highlight: formData.highlight,
      active: formData.active,
      order: formData.order
    };

    if (editingPlan) {
      updatePlan(editingPlan.id, planData);
      toast({
        title: "Sucesso",
        description: "Plano atualizado com sucesso!"
      });
    } else {
      addPlan(planData);
      toast({
        title: "Sucesso",
        description: "Plano criado com sucesso!"
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (planId: string, planName: string) => {
    if (confirm(`Tem certeza que deseja excluir o plano "${planName}"?`)) {
      deletePlan(planId);
      toast({
        title: "Plano excluído",
        description: `O plano "${planName}" foi removido.`
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Planos</h1>
          <p className="text-gray-600">Gerencie os planos de assinatura da plataforma</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Plano
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPlan ? 'Editar Plano' : 'Criar Novo Plano'}
              </DialogTitle>
              <DialogDescription>
                {editingPlan ? 'Modifique as informações do plano' : 'Preencha as informações do novo plano'}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Plano *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Premium"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Preço *</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="Ex: R$ 29,90"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Período *</Label>
                <Input
                  id="period"
                  value={formData.period}
                  onChange={(e) => setFormData({...formData, period: e.target.value})}
                  placeholder="Ex: por mês"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="originalPrice">Preço Original</Label>
                <Input
                  id="originalPrice"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                  placeholder="Ex: R$ 39,90"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="badge">Badge</Label>
                <Input
                  id="badge"
                  value={formData.badge}
                  onChange={(e) => setFormData({...formData, badge: e.target.value})}
                  placeholder="Ex: Mais Popular"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Ordem de Exibição</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 1})}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Ex: Plano completo"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="features">Funcionalidades (uma por linha)</Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData({...formData, features: e.target.value})}
                  placeholder="Transações ilimitadas&#10;Relatórios avançados&#10;Suporte prioritário"
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="highlight"
                  checked={formData.highlight}
                  onCheckedChange={(checked) => setFormData({...formData, highlight: checked})}
                />
                <Label htmlFor="highlight">Destacar plano</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({...formData, active: checked})}
                />
                <Label htmlFor="active">Plano ativo</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>
                {editingPlan ? 'Atualizar' : 'Criar'} Plano
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Planos Cadastrados</CardTitle>
          <CardDescription>Lista de todos os planos disponíveis</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ordem</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{plan.name}</p>
                      {plan.badge && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          {plan.badge}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{plan.price}</p>
                      {plan.originalPrice && (
                        <p className="text-sm text-gray-500 line-through">{plan.originalPrice}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{plan.period}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={plan.active ? 'default' : 'secondary'}>
                        {plan.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                      {plan.highlight && (
                        <Badge variant="outline">Destaque</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{plan.order}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(plan)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePlanStatus(plan.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(plan.id, plan.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanManagement;
