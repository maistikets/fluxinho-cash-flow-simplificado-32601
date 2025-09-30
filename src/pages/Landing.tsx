
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Shield, Zap, ArrowRight, CheckCircle, DollarSign, Clock, Users, Target, Star, Calendar, LogIn, FileSpreadsheet, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from 'recharts';
import AuthModal from '@/components/AuthModal';
import { usePlans } from '@/contexts/PlansContext';
import { useAuth } from '@/contexts/AuthContext';

const Landing = () => {
  const { plans } = usePlans();
  const { user } = useAuth();
  const navigate = useNavigate();
  const activePlans = plans.filter(plan => plan.active).sort((a, b) => a.order - b.order);
  
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const phrases = ['Chega de Planilhas! 📊', 'O futuro é automático! 🚀', 'Controle total em tempo real! ⚡', 'Sem erros, sem perda de tempo! ✨'];
  
  const chartData = [
    { name: 'Jan', value: 4000, growth: 2400 },
    { name: 'Fev', value: 3000, growth: 1398 },
    { name: 'Mar', value: 2000, growth: 9800 },
    { name: 'Abr', value: 2780, growth: 3908 },
    { name: 'Mai', value: 1890, growth: 4800 },
    { name: 'Jun', value: 2390, growth: 3800 },
    { name: 'Jul', value: 3490, growth: 4300 }
  ];

  const features = [
    {
      icon: BarChart3,
      title: 'Dashboards Inteligentes',
      description: 'Visualize seus dados financeiros em tempo real com gráficos dinâmicos e insights automáticos.'
    },
    {
      icon: Shield,
      title: 'Segurança Total',
      description: 'Seus dados protegidos com criptografia de ponta e backup automático na nuvem.'
    },
    {
      icon: Zap,
      title: 'Performance Instantânea',
      description: 'Sistema ultra-rápido que processa milhares de transações em segundos.'
    },
    {
      icon: Target,
      title: 'Análises Precisas',
      description: 'Relatórios detalhados e previsões que ajudam na tomada de decisões estratégicas.'
    }
  ];

  const benefits = [
    'Economia de 80% do tempo gasto com planilhas',
    'Redução de 95% nos erros de cálculo',
    'Acesso em tempo real de qualquer dispositivo',
    'Relatórios automáticos e personalizados',
    'Integração com bancos e cartões',
    'Alertas inteligentes de vencimento'
  ];

  const problemsWithSpreadsheets = [
    { icon: X, text: 'Erros de fórmulas e cálculos manuais', color: 'text-red-600' },
    { icon: X, text: 'Perda de tempo atualizando dados', color: 'text-red-600' },
    { icon: X, text: 'Risco de perder arquivos importantes', color: 'text-red-600' },
    { icon: X, text: 'Dificuldade para gerar relatórios', color: 'text-red-600' },
    { icon: X, text: 'Sem alertas de vencimentos', color: 'text-red-600' },
    { icon: X, text: 'Acesso limitado a um computador', color: 'text-red-600' }
  ];

  const solutionsWithApp = [
    { icon: CheckCircle, text: 'Cálculos automáticos e precisos', color: 'text-green-600' },
    { icon: CheckCircle, text: 'Atualização em tempo real', color: 'text-green-600' },
    { icon: CheckCircle, text: 'Backup automático na nuvem', color: 'text-green-600' },
    { icon: CheckCircle, text: 'Relatórios gerados automaticamente', color: 'text-green-600' },
    { icon: CheckCircle, text: 'Alertas inteligentes de vencimento', color: 'text-green-600' },
    { icon: CheckCircle, text: 'Acesso de qualquer lugar', color: 'text-green-600' }
  ];

  const handlePlanSelection = (planId: string) => {
    console.log('Selecionando plano:', planId);
    
    // Se for trial, abrir modal para cadastro/login
    if (planId === 'trial') {
      setSelectedPlanId(planId);
      setIsAuthModalOpen(true);
      return;
    }

    // Para planos pagos, verificar se usuário está logado
    if (!user) {
      console.log('Usuário não logado, salvando plano e abrindo modal');
      localStorage.setItem('selectedPlan', planId);
      setSelectedPlanId(planId);
      setIsAuthModalOpen(true);
      return;
    }

    // Se usuário está logado, redirecionar direto para checkout
    console.log('Usuário logado, redirecionando para checkout com plano:', planId);
    navigate('/checkout', { state: { planId } });
  };

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
    setSelectedPlanId(null);
  };

  useEffect(() => {
    const currentPhrase = phrases[currentIndex];
    if (typedText.length < currentPhrase.length) {
      const timeout = setTimeout(() => {
        setTypedText(currentPhrase.slice(0, typedText.length + 1));
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setTypedText('');
        setCurrentIndex((currentIndex + 1) % phrases.length);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [typedText, currentIndex, phrases]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Navigation */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FinanceApp
                </h1>
                <p className="text-xs text-gray-500">Substitua suas Planilhas</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild className="flex items-center gap-2">
                <Link to="/login">
                  <LogIn className="h-4 w-4" />
                  Entrar
                </Link>
              </Button>
              
              <Button 
                onClick={() => handlePlanSelection('trial')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Teste Gratuito
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full">
                <Zap className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Substitua suas Planilhas</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  FinanceApp
                </span>
              </h1>
              
              <div className="h-16 flex items-center justify-center lg:justify-start">
                <p className="text-2xl lg:text-3xl font-semibold text-gray-700">
                  {typedText}
                  <span className="animate-pulse">|</span>
                </p>
              </div>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                O sistema que <strong>substitui suas planilhas</strong> de controle financeiro. 
                Perfeito para contas pessoais, pequenos comércios e controle de contas a pagar e receber.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                onClick={() => handlePlanSelection('trial')}
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 h-14 text-lg group"
              >
                Começar Teste Gratuito
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                asChild
                className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 px-8 py-4 h-14 text-lg"
              >
                <Link to="/login">
                  Já tenho conta
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-8 justify-center lg:justify-start">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">+10.000 empresas</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600">Economia de 80% tempo</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <span className="text-sm text-gray-600">100% Seguro</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl blur-3xl opacity-20"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Performance em Tempo Real</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Receitas</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700">R$ 45.2K</p>
                  <p className="text-xs text-green-600">+12% este mês</p>
                </div>
                
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Fluxo</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">R$ 12.8K</p>
                  <p className="text-xs text-blue-600">+8% crescimento</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Purpose Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Por que criamos o 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> FinanceApp</span>?
            </h2>
            <p className="text-xl text-gray-600">
              Sabemos como é frustrante controlar finanças em planilhas. Por isso criamos uma solução moderna, 
              automática e confiável para substituir de vez esses métodos antigos.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-start mb-16">
              <div className="text-center lg:text-left">
                <h3 className="text-3xl font-bold text-red-700 mb-8 flex items-center gap-3 justify-center lg:justify-start">
                  <FileSpreadsheet className="h-8 w-8" />
                  Problemas das Planilhas
                </h3>
                <div className="space-y-6">
                  {problemsWithSpreadsheets.map((problem, index) => (
                    <div key={index} className="flex items-start gap-4 group justify-center lg:justify-start text-center lg:text-left">
                      <problem.icon className={`h-6 w-6 mt-0.5 ${problem.color} flex-shrink-0`} />
                      <p className="text-lg text-gray-700">{problem.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center lg:text-left">
                <h3 className="text-3xl font-bold text-green-700 mb-8 flex items-center gap-3 justify-center lg:justify-start">
                  <Zap className="h-8 w-8" />
                  Soluções do FinanceApp
                </h3>
                <div className="space-y-6">
                  {solutionsWithApp.map((solution, index) => (
                    <div key={index} className="flex items-start gap-4 group justify-center lg:justify-start text-center lg:text-left">
                      <solution.icon className={`h-6 w-6 mt-0.5 ${solution.color} flex-shrink-0`} />
                      <p className="text-lg text-gray-700">{solution.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12 text-center max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Ideal para:</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Pessoas Físicas</h4>
                <p className="text-sm text-gray-600">Controle suas contas pessoais e familiares</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <Target className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Pequenos Negócios</h4>
                <p className="text-sm text-gray-600">Gestão completa para pequenos comércios</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Contas a Pagar</h4>
                <p className="text-sm text-gray-600">Organize e controle todas suas obrigações</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Contas a Receber</h4>
                <p className="text-sm text-gray-600">Monitore seus recebimentos e fluxo</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Por que escolher o 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> FinanceApp</span>?
            </h2>
            <p className="text-xl text-gray-600">
              Deixe as planilhas no passado e entre no futuro da gestão financeira
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="group p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300">
                <div className="mb-4">
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 group-hover:from-blue-200 group-hover:to-purple-200 transition-colors">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Escolha o plano
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> ideal</span>
            </h2>
            <p className="text-xl text-gray-600">
              Comece grátis e escale conforme sua necessidade
            </p>
          </div>

          <div className={`grid gap-8 max-w-7xl mx-auto ${
            activePlans.length === 1 ? 'grid-cols-1 max-w-md' :
            activePlans.length === 2 ? 'md:grid-cols-2 max-w-4xl' :
            activePlans.length === 3 ? 'md:grid-cols-3 max-w-5xl' :
            'md:grid-cols-2 lg:grid-cols-4'
          }`}>
            {activePlans.map((plan, index) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-8 border-2 transition-all duration-300 hover:scale-105 ${
                  plan.highlight
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl'
                    : 'border-gray-200 bg-white hover:border-blue-300 shadow-lg'
                }`}
              >
                {plan.badge && (
                  <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-sm font-semibold text-white ${
                    plan.highlight ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 
                    plan.name === 'Gratuito' ? 'bg-green-500' :
                    plan.name === 'Trimestral' ? 'bg-orange-500' : 'bg-red-500'
                  }`}>
                    {plan.badge}
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    {plan.originalPrice && (
                      <div className="text-lg text-gray-400 line-through mb-1">{plan.originalPrice}</div>
                    )}
                    <div className="text-4xl font-bold text-gray-900">{plan.price}</div>
                    <div className="text-gray-600">{plan.period}</div>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handlePlanSelection(plan.id)}
                  className={`w-full font-semibold py-3 h-12 transition-all ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                      : 'border-2 border-blue-200 text-blue-700 hover:bg-blue-50'
                  }`}
                  variant={plan.highlight ? 'default' : 'outline'}
                >
                  {plan.name === 'Gratuito' ? 'Começar Teste' : 'Assinar Agora'}
                </Button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Todos os planos incluem as mesmas funcionalidades. A diferença está no preço e período de cobrança.
            </p>
            <div className="flex justify-center items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Pagamento seguro</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Cancele quando quiser</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>Satisfação garantida</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
                Resultados que 
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> impressionam</span>
              </h2>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 group justify-center lg:justify-start text-center lg:text-left">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 group-hover:scale-110 transition-transform flex-shrink-0" />
                    <p className="text-lg text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center lg:text-left">
                <Button 
                  onClick={() => handlePlanSelection('trial')}
                  size="lg" 
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold px-8 py-4 h-14 text-lg"
                >
                  Experimentar Gratuitamente
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Análise Comparativa</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Line type="monotone" dataKey="value" stroke="#EF4444" strokeWidth={3} strokeDasharray="5 5" name="Planilhas" />
                    <Line type="monotone" dataKey="growth" stroke="#10B981" strokeWidth={3} name="FinanceApp" />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-red-500"></div>
                    <span className="text-sm text-gray-600">Planilhas Tradicionais</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-green-500"></div>
                    <span className="text-sm text-gray-600">FinanceApp</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Pronto para revolucionar suas finanças?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de empresas que já deixaram as planilhas no passado
          </p>
          
          <div className="flex justify-center">
            <Button 
              onClick={() => handlePlanSelection('trial')}
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 h-14 text-lg"
            >
              Começar Gratuitamente
            </Button>
          </div>
        </div>
      </div>

      {/* Auth Modal - CORREÇÃO: passar selectedPlanId */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={handleAuthModalClose}
        isFromTrial={selectedPlanId === 'trial'}
        selectedPlanId={selectedPlanId}
      />
    </div>
  );
};

export default Landing;
