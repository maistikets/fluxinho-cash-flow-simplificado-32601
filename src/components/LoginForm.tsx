import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {
    signIn,
    getAllUsers
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    console.log('LoginForm - Attempting login for:', email);
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      setIsLoading(false);
      return;
    }
    try {
      // Verificar se o usuário existe
      const users = getAllUsers();
      const foundUser = users.find(u => u.email === email);
      if (!foundUser) {
        console.log('LoginForm - User not found');
        setError('Email ou senha incorretos');
        setIsLoading(false);
        return;
      }

      // Verificar credenciais específicas (simulação simples)
      const isValidCredentials = email === 'teste@financeiro.com' && password === '123456' || email === 'admin@financeiro.com' && password === 'admin123';
      if (isValidCredentials) {
        await signIn(email, password);
        console.log('LoginForm - Login successful for:', foundUser.email, 'Role:', foundUser.role);
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo, ${foundUser.name}!`
        });

        // Redirecionar baseado no role
        if (foundUser.role === 'admin') {
          console.log('LoginForm - Redirecting admin to /admin');
          navigate('/admin');
        } else {
          console.log('LoginForm - Redirecting user to /dashboard');
          navigate('/dashboard');
        }
      } else {
        console.log('LoginForm - Invalid credentials');
        setError('Email ou senha incorretos');
      }
    } catch (error: any) {
      console.error('LoginForm - Error:', error);
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  return <Card className="w-full shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-8">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <LogIn className="h-6 w-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">Fazer Login</CardTitle>
        <CardDescription className="text-gray-600">
          Digite suas credenciais para acessar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
            <Input id="email" type="email" placeholder="teste@financeiro.com" value={email} onChange={e => setEmail(e.target.value)} className="h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500" disabled={isLoading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium">Senha</Label>
            <div className="relative">
              <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Digite sua senha" value={password} onChange={e => setPassword(e.target.value)} className="h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-12" disabled={isLoading} />
              <Button type="button" variant="ghost" size="sm" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100" onClick={() => setShowPassword(!showPassword)} disabled={isLoading}>
                {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
              </Button>
            </div>
          </div>
          
          {error && <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>}

          <Button type="submit" className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar no Sistema"}
          </Button>
        </form>

        <div className="mt-8 space-y-4">
          

          
        </div>
      </CardContent>
    </Card>;
};
export default LoginForm;