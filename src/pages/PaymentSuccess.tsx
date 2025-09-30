
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePlans } from '@/contexts/PlansContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Download } from 'lucide-react';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { plans } = usePlans();

  const planId = location.state?.planId;
  const selectedPlan = plans.find(p => p.id === planId);

  useEffect(() => {
    // Auto-redirect após 10 segundos
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-green-800">
              Pagamento Aprovado!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">
                Assinatura {selectedPlan?.name} Ativada
              </h3>
              <p className="text-gray-600">
                Sua assinatura foi ativada com sucesso e você já pode acessar todos os recursos premium.
              </p>
              {selectedPlan && (
                <div className="mt-4 p-4 bg-white rounded border">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Plano:</span>
                    <span>{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-medium">Valor:</span>
                    <span className="font-bold">{selectedPlan.price}/{selectedPlan.period}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">O que fazer agora:</h4>
              <div className="text-left space-y-2">
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <span>Configure sua conta no dashboard</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <span>Explore os novos recursos disponíveis</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <span>Comece a gerenciar suas finanças</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/dashboard')} size="lg">
                <ArrowRight className="h-4 w-4 mr-2" />
                Ir para Dashboard
              </Button>
              <Button variant="outline" onClick={() => window.print()}>
                <Download className="h-4 w-4 mr-2" />
                Baixar Recibo
              </Button>
            </div>

            <p className="text-sm text-gray-500">
              Você será redirecionado automaticamente em alguns segundos...
            </p>

            <div className="bg-gray-50 p-4 rounded text-sm text-gray-600">
              <p>
                📧 Um email de confirmação foi enviado para seu endereço.
                Se precisar de ajuda, entre em contato com nosso suporte.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
