import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFromTrial?: boolean;
  selectedPlanId?: string | null;
}

type AuthMode = 'register' | 'login';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, isFromTrial = false, selectedPlanId = null }) => {
  const [mode, setMode] = useState<AuthMode>(isFromTrial ? 'register' : 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const handleSuccessfulAuth = () => {
    // Verificar se há plano selecionado no localStorage ou via prop
    const planToProcess = selectedPlanId || localStorage.getItem('selectedPlan');
    
    if (planToProcess) {
      console.log('Plano selecionado após auth:', planToProcess);
      localStorage.removeItem('selectedPlan'); // Limpar localStorage
      
      if (planToProcess === 'trial') {
        // Para trial, redirecionar para dashboard
        navigate('/dashboard');
      } else {
        // Para planos pagos, redirecionar para checkout
        navigate('/checkout', { state: { planId: planToProcess } });
      }
    } else {
      // Se não há plano selecionado, ir para dashboard
      navigate('/dashboard');
    }
    
    onClose();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "Erro no cadastro",
        description: "As senhas não coincidem.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (registerForm.password.length < 6) {
      toast({
        title: "Erro no cadastro",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      await signUp(registerForm.email, registerForm.password, registerForm.name);
      
      toast({
        title: "🎉 Teste iniciado com sucesso!",
        description: "Bem-vindo ao FinanceApp! Seus 7 dias gratuitos começaram agora.",
      });
      
      handleSuccessfulAuth();
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(loginForm.email, loginForm.password);
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta ao FinanceApp.",
      });
      
      handleSuccessfulAuth();
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message || "Email ou senha incorretos.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForms = () => {
    setLoginForm({ email: '', password: '' });
    setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' });
    setShowPassword(false);
    setIsLoading(false);
    setMode(isFromTrial ? 'register' : 'login');
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[420px] max-h-[90vh] overflow-y-auto p-0">
        <div className="p-4 sm:p-6">
          <DialogHeader className="text-center mb-4 sm:mb-6">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                {mode === 'register' ? (
                  <Zap className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                ) : (
                  <span className="text-xl sm:text-2xl">💼</span>
                )}
              </div>
            </div>
            
            <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">
              {mode === 'register' 
                ? (isFromTrial ? 'Começar teste gratuito' : 'Criar conta')
                : 'Entrar na sua conta'
              }
            </DialogTitle>
            
            <DialogDescription className="text-sm sm:text-base text-gray-600">
              {mode === 'register' 
                ? (isFromTrial 
                    ? 'Preencha os dados para começar seu teste gratuito de 7 dias'
                    : 'Preencha os dados para criar sua conta'
                  )
                : 'Digite suas credenciais para acessar o sistema'
              }
            </DialogDescription>
            
            {mode === 'register' && isFromTrial && (
              <div className="mt-3 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  <span className="text-xs sm:text-sm font-semibold text-green-700">7 dias completamente grátis!</span>
                </div>
                <ul className="text-xs text-green-600 space-y-1">
                  <li>✓ Acesso completo a todas funcionalidades</li>
                  <li>✓ Sem cobrança durante o teste</li>
                  <li>✓ Cancele quando quiser</li>
                </ul>
              </div>
            )}
          </DialogHeader>

          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <Label htmlFor="register-name" className="text-sm">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                    className="pl-9 h-10 sm:h-11"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-sm">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-9 h-10 sm:h-11"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-sm">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-9 pr-9 h-10 sm:h-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-confirm-password" className="text-sm">Confirmar senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite a senha novamente"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="pl-9 h-10 sm:h-11"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-sm sm:text-base"
                disabled={isLoading}
              >
                {isLoading 
                  ? "Criando conta..." 
                  : isFromTrial 
                    ? "🚀 Começar teste gratuito"
                    : "Criar conta"
                }
              </Button>

              <div className="text-center pt-3 sm:pt-4">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-sm text-gray-600 hover:text-gray-700"
                >
                  Já tem uma conta?{' '}
                  <span className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                    Fazer login
                  </span>
                </button>
              </div>
            </form>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-sm">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-9 h-10 sm:h-11"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-sm">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-9 pr-9 h-10 sm:h-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-sm sm:text-base"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar no sistema"}
              </Button>

              <div className="text-center space-y-3 pt-3 sm:pt-4">
                <div className="text-sm text-gray-600">
                  Não tem uma conta?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                  >
                    Criar conta gratuita
                  </button>
                </div>

                <div className="text-center text-xs text-gray-500 mt-3 sm:mt-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <strong>Dados para teste:</strong><br />
                  teste@financeiro.com / 123456
                </div>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
