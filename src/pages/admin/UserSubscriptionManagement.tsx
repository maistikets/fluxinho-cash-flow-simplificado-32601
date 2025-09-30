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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
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
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
  UserX
} from 'lucide-react';
import { getPlanBadge, getRoleBadge, formatCurrency, getStatusBadge } from '@/utils/planHelpers';

const UserSubscriptionManagement = () => {
  const { getAllUsers, updateUser, deleteUser, createUser, toggleUserStatus, changeUserPlan } = useAuth();
  const { plans } = usePlans();
  const { toast } = useToast();
  const [users, setUsers] = useState(getAllUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user' as 'user' | 'admin',
    planType: 'trial' as 'trial' | 'basic' | 'premium' | 'annual',
    isActive: true
  });

  const refreshUsers = () => {
    setUsers(getAllUsers());
  };

  const filteredUsers = users.filter(user => 
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedPlan === 'all' || user.planType === selectedPlan) &&
    (selectedStatus === 'all' || 
     (selectedStatus === 'active' && user.isActive) ||
     (selectedStatus === 'inactive' && !user.isActive) ||
     (selectedStatus === 'trial_expired' && user.isTrialExpired)) &&
    (selectedRole === 'all' || user.role === selectedRole)
  );

  // Cálculos de métricas financeiras
  const totalRevenue = users.reduce((sum, user) => sum + (user.totalPaid || 0), 0);
  const monthlyRevenue = users.reduce((sum, user) => sum + (user.monthlyRevenue || 0), 0);
  const activeSubscriptions = users.filter(user => user.isActive && user.planType !== 'trial').length;
  const expiredTrials = users.filter(user => user.isTrialExpired).length;
  const churnRate = users.filter(user => !user.isActive).length / users.length * 100;

  const planRevenue = plans.reduce((acc, plan) => {
    acc[plan.id] = users.filter(u => u.planType === plan.id && u.isActive).reduce((sum, u) => sum + (u.monthlyRevenue || 0), 0);
    return acc;
  }, {} as Record<string, number>);

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const userToCreate = {
      ...newUser,
      createdAt: new Date().toISOString(),
      totalPaid: 0,
      monthlyRevenue: 0
    };

    const success = createUser(userToCreate);
    if (success) {
      toast({
        title: "Usuário criado",
        description: `Usuário ${newUser.name} foi criado com sucesso.`,
      });
      setNewUser({
        name: '',
        email: '',
        role: 'user',
        planType: 'trial',
        isActive: true
      });
      setIsCreateDialogOpen(false);
      refreshUsers();
    } else {
      toast({
        title: "Erro",
        description: "Email já existe ou erro interno.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;

    const success = updateUser(editingUser.id, {
      name: editingUser.name,
      email: editingUser.email,
      role: editingUser.role,
      planType: editingUser.planType,
      isActive: editingUser.isActive
    });

    if (success) {
      toast({
        title: "Usuário atualizado",
        description: `Usuário ${editingUser.name} foi atualizado com sucesso.`,
      });
      setEditingUser(null);
      refreshUsers();
    } else {
      toast({
        title: "Erro",
        description: "Erro ao atualizar usuário.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    const success = deleteUser(userId);
    if (success) {
      toast({
        title: "Usuário removido",
        description: `Usuário ${userName} foi removido com sucesso.`,
      });
      refreshUsers();
    }
  };

  const handleToggleStatus = (userId: string, userName: string, currentStatus: boolean) => {
    const success = toggleUserStatus(userId);
    if (success) {
      toast({
        title: "Status alterado",
        description: `Usuário ${userName} foi ${currentStatus ? 'desativado' : 'ativado'}.`,
      });
      refreshUsers();
    }
  };

  const handleChangePlan = (userId: string, userName: string, newPlan: 'trial' | 'basic' | 'premium' | 'annual') => {
    const success = changeUserPlan(userId, newPlan);
    if (success) {
      const currentDate = new Date().toLocaleDateString('pt-BR');
      const planNames = {
        trial: 'Teste Gratuito',
        basic: 'Mensal',
        premium: 'Trimestral', 
        annual: 'Anual'
      };
      
      toast({
        title: "✅ Plano alterado efetivamente!",
        description: `${userName} foi movido para o plano ${planNames[newPlan]} em ${currentDate}. Datas de cobrança atualizadas automaticamente.`,
      });
      refreshUsers();
    }
  };

  const handleManageSubscription = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleExportData = () => {
    const csvData = filteredUsers.map(user => ({
      Nome: user.name,
      Email: user.email,
      Role: user.role,
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
    a.download = `relatorio-usuarios-assinantes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    toast({
      title: "Relatório exportado",
      description: "O relatório foi baixado com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usuários e Assinaturas</h1>
          <p className="text-gray-600">Gestão completa de usuários, assinaturas e receitas</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Criar Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Usuário</DialogTitle>
                <DialogDescription>
                  Preencha os dados para criar um novo usuário no sistema.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="create-name">Nome</Label>
                  <Input
                    id="create-name"
                    value={newUser.name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-email">Email</Label>
                  <Input
                    id="create-email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="usuario@exemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-role">Papel</Label>
                  <Select value={newUser.role} onValueChange={(value: 'user' | 'admin') => setNewUser(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Usuário</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-plan">Plano</Label>
                  <Select value={newUser.planType} onValueChange={(value: 'trial' | 'basic' | 'premium' | 'annual') => setNewUser(prev => ({ ...prev, planType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {plans.filter(p => p.active).map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name} - {plan.price} {plan.period}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateUser}>
                  Criar Usuário
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button 
            variant="outline" 
            onClick={refreshUsers}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
          <Button onClick={handleExportData} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar
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
            Filtros Avançados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
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
            <div className="space-y-2">
              <Label>Tipo de Usuário</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="user">Usuários</SelectItem>
                  <SelectItem value="admin">Administradores</SelectItem>
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
                setSelectedRole('all');
              }}
            >
              Limpar Todos os Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela Unificada */}
      <Card>
        <CardHeader>
          <CardTitle>Gestão Completa ({filteredUsers.length} usuários)</CardTitle>
          <CardDescription>Todos os usuários e assinaturas em um único local</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Pago</TableHead>
                <TableHead>Receita Mensal</TableHead>
                <TableHead>Último Pgto</TableHead>
                <TableHead>Próximo Pgto</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{user.name}</p>
                        {getRoleBadge(user.role)}
                      </div>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-400">
                        Criado: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '-'}
                      </p>
                      {user.subscriptionStartDate && user.subscriptionStartDate !== user.createdAt && (
                        <p className="text-xs text-blue-600">
                          Plano desde: {new Date(user.subscriptionStartDate).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getPlanBadge(user.planType, user.isActive, plans)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(user)}
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
                    <div className="flex items-center gap-2">
                      <Select
                        value={user.planType}
                        onValueChange={(value: any) => handleChangePlan(user.id, user.name, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {plans.filter(p => p.active).map((plan) => (
                            <SelectItem key={plan.id} value={plan.id}>
                              {plan.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleManageSubscription(user)}
                      >
                        <Settings className="h-3 w-3" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(user.id, user.name, user.isActive || false)}
                        className={user.isActive ? "text-red-600" : "text-green-600"}
                      >
                        {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingUser({ ...user })}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Usuário</DialogTitle>
                            <DialogDescription>
                              Edite as informações do usuário.
                            </DialogDescription>
                          </DialogHeader>
                          {editingUser && (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Nome</Label>
                                <Input
                                  value={editingUser.name}
                                  onChange={(e) => setEditingUser(prev => ({ ...prev, name: e.target.value }))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                  value={editingUser.email}
                                  onChange={(e) => setEditingUser(prev => ({ ...prev, email: e.target.value }))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Papel</Label>
                                <Select
                                  value={editingUser.role}
                                  onValueChange={(value) => setEditingUser(prev => ({ ...prev, role: value }))}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="user">Usuário</SelectItem>
                                    <SelectItem value="admin">Administrador</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Plano</Label>
                                <Select
                                  value={editingUser.planType}
                                  onValueChange={(value) => setEditingUser(prev => ({ ...prev, planType: value }))}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {plans.filter(p => p.active).map((plan) => (
                                      <SelectItem key={plan.id} value={plan.id}>
                                        {plan.name} - {plan.price} {plan.period}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingUser(null)}>
                              Cancelar
                            </Button>
                            <Button onClick={handleUpdateUser}>
                              Salvar Alterações
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      {user.role !== 'admin' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja remover o usuário {user.name}? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteUser(user.id, user.name)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Confirmar Exclusão
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum usuário encontrado com os filtros aplicados.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Gestão de Assinatura */}
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

export default UserSubscriptionManagement;
