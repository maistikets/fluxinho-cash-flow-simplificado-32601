
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileSpreadsheet, ArrowRight, Zap, CheckCircle } from 'lucide-react';

const SystemPurposeBanner = () => {
  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 mb-8">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Chega de Planilhas! 📊 ➡️ 🚀
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            O FinanceApp foi criado para <strong>substituir suas planilhas</strong> de controle financeiro, 
            seja para uso pessoal ou pequenos comércios.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <FileSpreadsheet className="h-10 w-10 text-red-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Antes (Planilhas)</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Controle manual</li>
              <li>• Risco de erros</li>
              <li>• Perda de tempo</li>
              <li>• Sem alertas</li>
            </ul>
          </div>

          <div className="flex items-center justify-center">
            <ArrowRight className="h-8 w-8 text-blue-600" />
          </div>

          <div className="text-center">
            <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Zap className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Agora (FinanceApp)</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Automático</li>
              <li>• 100% confiável</li>
              <li>• Economia de tempo</li>
              <li>• Alertas inteligentes</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4 text-center">Perfeito para:</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-gray-700">Controle de contas pessoais</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-gray-700">Gestão de pequenos negócios</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-gray-700">Contas a pagar e receber</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-gray-700">Controle de fluxo de caixa</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemPurposeBanner;
