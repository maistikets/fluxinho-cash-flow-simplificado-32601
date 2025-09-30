
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-6">
        <div className="mb-8">
          <div className="text-9xl font-bold text-gray-200 mb-4">404</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Página não encontrada
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Ops! A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Voltar ao Início
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link to="/dashboard" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Ir para Dashboard
            </Link>
          </Button>
        </div>

        <div className="mt-12 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Precisa de ajuda?
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Se você chegou aqui através de um link, ele pode estar quebrado ou desatualizado.
          </p>
          <div className="flex justify-center">
            <Button variant="ghost" asChild>
              <Link to="/" className="flex items-center gap-2 text-blue-600">
                <ArrowLeft className="h-4 w-4" />
                Voltar para a página inicial
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
