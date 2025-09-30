import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePlans } from '@/contexts/PlansContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Users, Plus, Pencil, Trash2, UserCheck, UserX, Shield } from 'lucide-react';

const UserManagement = () => {
  const { getAllUsers, updateUser, deleteUser, createUser, toggleUserStatus, changeUserPlan } = useAuth();
  const { plans } = usePlans();
  const { toast } = useToast();
  const [users, setUsers] = useState(getAllUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
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
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(user => 
    selectedPlan === 'all' || user.planType === selectedPlan
  );

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

  const getPlanBadge = (planType: string) => {
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

  const getRoleBadge = (role: string) => {
    if (role === 'admin') {
      return <Badge className="bg-red-100 text-red-800"><Shield className="h-3 w-3 mr-1" />Admin</Badge>;
    }
    return <Badge variant="outline">Usuário</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Usuários</h1>
            <p className="text-gray-600">Gerencie todos os usuários do sistema</p>
          </div>
        </div>
        
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre os usuários por nome, email ou plano</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por plano" />
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
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedPlan('all');
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuários ({filteredUsers.length})</CardTitle>
          <CardDescription>Lista de todos os usuários cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{user.name}</h3>
                      {getRoleBadge(user.role)}
                      {!user.isActive && <Badge variant="destructive">Inativo</Badge>}
                    </div>
                    <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {getPlanBadge(user.planType)}
                        {user.createdAt && (
                          <span className="text-xs text-gray-500">
                            Criado em: {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                        {user.subscriptionStartDate && user.subscriptionStartDate !== user.createdAt && (
                          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            Plano atual desde: {new Date(user.subscriptionStartDate).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Select
                    value={user.planType}
                    onValueChange={(value: any) => handleChangePlan(user.id, user.name, value)}
                  >
                    <SelectTrigger className="w-40">
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
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o usuário {user.name}? 
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum usuário encontrado com os filtros aplicados.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
