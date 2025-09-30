
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const PaymentCanceled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-red-800">
              Pagamento Cancelado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-red-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                Seu pagamento foi cancelado e nenhuma cobrança foi realizada.
                Você pode tentar novamente quando quiser.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Possíveis motivos:</h4>
              <div className="text-left space-y-2 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Cancelamento voluntário durante o processo</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Dados do cartão incorretos ou insuficientes</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Problemas temporários na conexão</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/plans')} size="lg">
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Dashboard
              </Button>
            </div>

            <div className="bg-blue-50 p-4 rounded text-sm text-blue-800">
              <p>
                💡 <strong>Dica:</strong> Você ainda pode usar o período de teste gratuito 
                enquanto decide sobre a assinatura.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded text-sm text-gray-600">
              <p>
                Se você continuar tendo problemas com o pagamento, 
                entre em contato com nosso suporte através do chat ou email.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentCanceled;
