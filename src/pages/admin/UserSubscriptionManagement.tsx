import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePlans } from '@/contexts/PlansContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, TrendingUp, TrendingDown, UserCheck, Download, Filter, RefreshCw, Settings } from 'lucide-react';
import { formatCurrency } from '@/utils/planHelpers';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  plan_type: string;
  is_active: boolean;
  total_paid: number;
  monthly_revenue: number;
  trial_end_date: string | null;
  subscription_start_date: string | null;
  last_payment_date: string | null;
  role: string;
}

const UserSubscriptionManagement = () => {
  const { plans } = usePlans();
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      if (profilesError) throw profilesError;

      const { data: subs, error: subsError } = await supabase
        .from('subscriptions')
        .select('*');
      if (subsError) throw subsError;

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');
      if (rolesError) throw rolesError;

      const merged = (profiles || []).map(p => {
        const sub = (subs || []).find(s => s.user_id === p.id);
        const role = (roles || []).find(r => r.user_id === p.id);
        return {
          id: p.id,
          name: p.name,
          email: p.email,
          plan_type: sub?.plan_type || 'trial',
          is_active: sub?.is_active ?? true,
          total_paid: Number(sub?.total_paid || 0),
          monthly_revenue: Number(sub?.monthly_revenue || 0),
          trial_end_date: sub?.trial_end_date,
          subscription_start_date: sub?.subscription_start_date,
          last_payment_date: sub?.last_payment_date,
          role: role?.role || 'user',
        };
      });

      setUsers(merged);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({ title: 'Erro', description: 'Não foi possível carregar usuários.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(user =>
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedPlan === 'all' || user.plan_type === selectedPlan) &&
    (selectedStatus === 'all' ||
      (selectedStatus === 'active' && user.is_active) ||
      (selectedStatus === 'inactive' && !user.is_active))
  );

  const totalRevenue = users.reduce((sum, u) => sum + u.total_paid, 0);
  const monthlyRevenue = users.reduce((sum, u) => sum + u.monthly_revenue, 0);
  const activeSubscriptions = users.filter(u => u.is_active && u.plan_type !== 'trial').length;
  const churnRate = users.length > 0 ? (users.filter(u => !u.is_active).length / users.length * 100) : 0;

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('subscriptions')
      .update({ is_active: !currentStatus })
      .eq('user_id', userId);

    if (error) {
      toast({ title: 'Erro', description: 'Falha ao alterar status.', variant: 'destructive' });
    } else {
      toast({ title: 'Sucesso', description: `Status alterado.` });
      fetchUsers();
    }
  };

  const handleChangePlan = async (userId: string, newPlan: string) => {
    const { error } = await supabase
      .from('subscriptions')
      .update({ plan_type: newPlan as any })
      .eq('user_id', userId);

    if (error) {
      toast({ title: 'Erro', description: 'Falha ao alterar plano.', variant: 'destructive' });
    } else {
      toast({ title: 'Plano alterado', description: `Plano atualizado com sucesso.` });
      fetchUsers();
    }
  };

  const handleExportData = () => {
    const csvData = filteredUsers.map(u => ({
      Nome: u.name, Email: u.email, Plano: u.plan_type,
      Status: u.is_active ? 'Ativo' : 'Inativo',
      'Total Pago': u.total_paid, 'Receita Mensal': u.monthly_revenue
    }));
    const csv = [Object.keys(csvData[0] || {}).join(','), ...csvData.map(row => Object.values(row).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `usuarios-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast({ title: 'Exportado', description: 'Relatório baixado com sucesso.' });
  };

  const getPlanBadge = (planType: string) => {
    switch (planType) {
      case 'trial': return <Badge className="bg-blue-100 text-blue-800">Teste</Badge>;
      case 'basic': return <Badge variant="outline">Básico</Badge>;
      case 'premium': return <Badge className="bg-purple-100 text-purple-800">Premium</Badge>;
      case 'annual': return <Badge className="bg-green-100 text-green-800">Anual</Badge>;
      default: return <Badge variant="secondary">{planType}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usuários e Assinaturas</h1>
          <p className="text-gray-600">Gestão completa de usuários e receitas</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchUsers} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />Atualizar
          </Button>
          <Button onClick={handleExportData} className="flex items-center gap-2">
            <Download className="h-4 w-4" />Exportar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatCurrency(monthlyRevenue)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{activeSubscriptions}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Churn</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{churnRate.toFixed(1)}%</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5" />Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Buscar</Label>
              <Input placeholder="Nome ou email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Plano</Label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {plans.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuários ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-8 text-gray-500">Carregando...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Pago</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getPlanBadge(user.plan_type)}</TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? "default" : "destructive"}>
                        {user.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(user.total_paid)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleToggleStatus(user.id, user.is_active)}>
                          {user.is_active ? 'Desativar' : 'Ativar'}
                        </Button>
                        <Select onValueChange={(val) => handleChangePlan(user.id, val)}>
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue placeholder="Plano" />
                          </SelectTrigger>
                          <SelectContent>
                            {plans.filter(p => p.id !== user.plan_type).map(p => (
                              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSubscriptionManagement;
