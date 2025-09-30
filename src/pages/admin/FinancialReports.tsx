
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Download,
  Calendar,
  BarChart3
} from 'lucide-react';

const FinancialReports = () => {
  const { getAllUsers } = useAuth();
  const [users] = useState(getAllUsers());
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  // Dados simulados para os gráficos
  const monthlyRevenueData = [
    { month: 'Jan', revenue: 15400, subscriptions: 120 },
    { month: 'Fev', revenue: 18200, subscriptions: 135 },
    { month: 'Mar', revenue: 21100, subscriptions: 148 },
    { month: 'Abr', revenue: 19800, subscriptions: 142 },
    { month: 'Mai', revenue: 23500, subscriptions: 160 },
    { month: 'Jun', revenue: 25200, subscriptions: 175 },
  ];

  const planDistributionData = [
    { name: 'Premium', value: 45, color: '#8b5cf6' },
    { name: 'Básico', value: 35, color: '#3b82f6' },
    { name: 'Teste', value: 20, color: '#10b981' },
  ];

  const churnData = [
    { month: 'Jan', churn: 2.1, retention: 97.9 },
    { month: 'Fev', churn: 1.8, retention: 98.2 },
    { month: 'Mar', churn: 2.5, retention: 97.5 },
    { month: 'Abr', churn: 2.0, retention: 98.0 },
    { month: 'Mai', churn: 1.6, retention: 98.4 },
    { month: 'Jun', churn: 1.9, retention: 98.1 },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const totalRevenue = users.reduce((sum, user) => sum + (user.totalPaid || 0), 0);
  const monthlyRevenue = users.reduce((sum, user) => sum + (user.monthlyRevenue || 0), 0);
  const activeSubscriptions = users.filter(user => user.isActive && user.planType !== 'trial').length;
  const avgRevenuePerUser = activeSubscriptions > 0 ? monthlyRevenue / activeSubscriptions : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios Financeiros</h1>
          <p className="text-gray-600">Análise detalhada de receitas e métricas</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
              <SelectItem value="365">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MRR (Receita Mensal)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(monthlyRevenue)}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% vs mês anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ARPU (Receita por Usuário)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(avgRevenuePerUser)}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.3% vs mês anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.8%</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +3.2% vs mês anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Churn</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.9%</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              -0.3% vs mês anterior
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Receita Mensal */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução da Receita</CardTitle>
            <CardDescription>Receita mensal recorrente nos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Receita']}
                />
                <Bar dataKey="revenue" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição de Planos */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Planos</CardTitle>
            <CardDescription>Percentual de usuários por tipo de plano</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={planDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {planDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Churn e Retenção */}
        <Card>
          <CardHeader>
            <CardTitle>Taxa de Churn</CardTitle>
            <CardDescription>Evolução do churn mensal</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={churnData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Taxa']}
                />
                <Line type="monotone" dataKey="churn" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Crescimento de Assinaturas */}
        <Card>
          <CardHeader>
            <CardTitle>Crescimento de Assinaturas</CardTitle>
            <CardDescription>Número de assinaturas ativas por mês</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="subscriptions" 
                  stroke="#10b981" 
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Resumo de Métricas */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Executivo</CardTitle>
          <CardDescription>Principais métricas do período selecionado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Crescimento</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Novos assinantes</span>
                  <Badge variant="outline">+25</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Upgrades</span>
                  <Badge variant="outline">+8</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Downgrades</span>
                  <Badge variant="destructive">-3</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Retenção</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Taxa de retenção</span>
                  <Badge className="bg-green-100 text-green-800">98.1%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Vida útil média</span>
                  <Badge variant="outline">18 meses</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Valor vitalício</span>
                  <Badge variant="outline">{formatCurrency(1850)}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Pagamentos</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Taxa de sucesso</span>
                  <Badge className="bg-green-100 text-green-800">96.5%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Falhas de pagamento</span>
                  <Badge variant="destructive">3.5%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Recuperação</span>
                  <Badge variant="outline">78%</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReports;
