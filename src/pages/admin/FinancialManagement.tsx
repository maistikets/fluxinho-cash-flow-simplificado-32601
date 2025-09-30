
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePlans } from '@/contexts/PlansContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import SubscriptionActionsModal from '@/components/admin/SubscriptionActionsModal';
import PlanChangeHistory from '@/components/PlanChangeHistory';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  CreditCard, 
  Calendar,
  AlertTriangle,
  Download,
  Filter,
  Settings,
  UserCheck,
  RefreshCw
} from 'lucide-react';

const FinancialManagement = () => {
  const { getAllUsers } = useAuth();
  const { plans } = usePlans();
  const { toast } = useToast();
  const [users] = useState(getAllUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredUsers = users.filter(user => 
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedPlan === 'all' || user.planType === selectedPlan) &&
    (selectedStatus === 'all' || 
     (selectedStatus === 'active' && user.isActive) ||
     (selectedStatus === 'inactive' && !user.isActive) ||
     (selectedStatus === 'trial_expired' && user.isTrialExpired))
  );

  // Cálculos financeiros
  const totalRevenue = users.reduce((sum, user) => sum + (user.totalPaid || 0), 0);
  const monthlyRevenue = users.reduce((sum, user) => sum + (user.monthlyRevenue || 0), 0);
  const activeSubscriptions = users.filter(user => user.isActive && user.planType !== 'trial').length;
  const trialUsers = users.filter(user => user.planType === 'trial').length;
  const expiredTrials = users.filter(user => user.isTrialExpired).length;
  const churnRate = users.filter(user => !user.isActive).length / users.length * 100;

  const planRevenue = plans.reduce((acc, plan) => {
    acc[plan.id] = users.filter(u => u.planType === plan.id && u.isActive).reduce((sum, u) => sum + (u.monthlyRevenue || 0), 0);
    return acc;
  }, {} as Record<string, number>);

  const handleExportData = () => {
    const csvData = filteredUsers.map(user => ({
      Nome: user.name,
      Email: user.email,
      Plano: user.planType,
      Status: user.isActive ? 'Ativo' : 'Inativo',
      'Total Pago': user.totalPaid || 0,
      'Receita Mensal': user.monthlyRevenue || 0,
      'Data Criação': user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '-',
      'Último Pagamento': user.lastPaymentDate ? new Date(user.lastPaymentDate).toLocaleDateString('pt-BR') : '-'
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-assinantes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    toast({
      title: "Relatório exportado",
      description: "O relatório de assinantes foi baixado com sucesso.",
    });
  };

  const handleManageSubscription = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const getPlanBadge = (planType: string, isActive: boolean) => {
    if (!isActive) return <Badge variant="destructive">Inativo</Badge>;
    
    const plan = plans.find(p => p.id === planType);
    if (!plan) return <Badge variant="secondary">Desconhecido</Badge>;

    switch (planType) {
      case 'trial':
        return <Badge className="bg-blue-100 text-blue-800">{plan.name}</Badge>;
      case 'basic':
        return <Badge variant="outline">{plan.name}</Badge>;
      case 'premium':
        return <Badge className="bg-purple-100 text-purple-800">{plan.name}</Badge>;
      case 'annual':
        return <Badge className="bg-green-100 text-green-800">{plan.name}</Badge>;
      default:
        return <Badge variant="secondary">{plan.name}</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Assinantes</h1>
          <p className="text-gray-600">Gerencie assinaturas, pagamentos e receitas do sistema</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
          <Button onClick={handleExportData} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Valor total arrecadado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(monthlyRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Receita recorrente mensal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              Usuários pagantes ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Churn</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{churnRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Usuários que cancelaram
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas por Plano */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.filter(p => p.active && p.id !== 'trial').map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className={`h-5 w-5 ${plan.id === 'premium' ? 'text-purple-600' : plan.id === 'annual' ? 'text-green-600' : ''}`} />
                {plan.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">{formatCurrency(planRevenue[plan.id] || 0)}</p>
                <p className="text-sm text-gray-600">
                  {users.filter(u => u.planType === plan.id && u.isActive).length} usuários ativos
                </p>
                <p className="text-xs text-gray-500">
                  {plan.price} {plan.period}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Testes Expirados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{expiredTrials}</p>
              <p className="text-sm text-gray-600">
                Conversão necessária
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Assinantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar assinante</Label>
              <Input
                id="search"
                placeholder="Nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Plano</Label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os planos</SelectItem>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                  <SelectItem value="trial_expired">Teste Expirado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedPlan('all');
                setSelectedStatus('all');
              }}
            >
              Limpar Todos os Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Assinantes */}
      <Card>
        <CardHeader>
          <CardTitle>Gestão de Assinantes ({filteredUsers.length})</CardTitle>
          <CardDescription>Gerencie assinaturas e pagamentos individuais</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assinante</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Total Pago</TableHead>
                <TableHead>Receita Mensal</TableHead>
                <TableHead>Último Pagamento</TableHead>
                <TableHead>Próximo Pagamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-400">
                        Desde: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '-'}
                      </p>
                      {user.subscriptionStartDate && user.subscriptionStartDate !== user.createdAt && (
                        <p className="text-xs text-blue-600">
                          Plano atual desde: {new Date(user.subscriptionStartDate).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getPlanBadge(user.planType, user.isActive)}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {formatCurrency(user.totalPaid || 0)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {formatCurrency(user.monthlyRevenue || 0)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.lastPaymentDate ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-sm">
                          {new Date(user.lastPaymentDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.nextPaymentDate ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-blue-500" />
                        <span className="text-sm">
                          {new Date(user.nextPaymentDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.isActive ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Ativo
                      </Badge>
                    ) : user.isTrialExpired ? (
                      <Badge variant="destructive">
                        Teste Expirado
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        Inativo
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleManageSubscription(user)}
                      className="flex items-center gap-1"
                    >
                      <Settings className="h-3 w-3" />
                      Gerenciar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum assinante encontrado com os filtros aplicados.
            </div>
          )}
        </CardContent>
      </Card>

      <SubscriptionActionsModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Histórico de Mudanças de Planos */}
      <PlanChangeHistory />
    </div>
  );
};

export default FinancialManagement;
