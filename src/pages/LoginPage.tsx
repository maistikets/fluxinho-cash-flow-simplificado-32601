
import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';
import { ArrowLeft, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
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
                <p className="text-xs text-gray-500">Sistema Inteligente</p>
              </div>
            </div>
            
            <Button variant="outline" asChild className="flex items-center gap-2">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Voltar para o site
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Login Content */}
      <div className="flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Bem-vindo de volta!
            </h2>
            <p className="text-gray-600">
              Entre com suas credenciais para acessar o sistema
            </p>
          </div>
          
          <LoginForm />
          
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              Ainda não tem uma conta?{' '}
              <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
                Conhecer os planos
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 FinanceApp. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
