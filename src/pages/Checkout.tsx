import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePlans } from '@/contexts/PlansContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PlanHeader from '@/components/PlanHeader';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, changeUserPlan } = useAuth();
  const { plans } = usePlans();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    email: user?.email || ''
  });

  const planId = location.state?.planId;
  const selectedPlan = plans.find(p => p.id === planId);

  if (!selectedPlan || !user) {
    navigate('/plans');
    return null;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePayment = async () => {
    setLoading(true);
    
    // Simular processamento de pagamento
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular 90% de sucesso
      const success = Math.random() > 0.1;
      
      if (success) {
        changeUserPlan(user.id, planId as any);
        toast({
          title: "Pagamento aprovado!",
          description: "Sua assinatura foi ativada com sucesso"
        });
        navigate('/payment-success', { state: { planId } });
      } else {
        toast({
          title: "Pagamento recusado",
          description: "Verifique os dados do cartão e tente novamente",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro no pagamento",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PlanHeader showBackButton={true} backPath="/plans" />
      
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Finalizar Assinatura</h1>
            <p className="text-gray-600">Complete seu pagamento de forma segura</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Resumo do Plano */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Resumo do Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg">{selectedPlan.name}</h3>
                  <p className="text-gray-600">{selectedPlan.description}</p>
                  <div className="mt-2">
                    <span className="text-2xl font-bold">{selectedPlan.price}</span>
                    <span className="text-gray-600">/{selectedPlan.period}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium">Recursos inclusos:</h4>
                  <ul className="space-y-1">
                    {selectedPlan.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>{selectedPlan.price}</span>
                </div>
              </CardContent>
            </Card>

            {/* Formulário de Pagamento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  Dados de Pagamento
                </CardTitle>
                <CardDescription>
                  Ambiente de teste - Use qualquer número de cartão
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Seu nome completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="seu@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Número do cartão</Label>
                  <Input
                    id="cardNumber"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Validade</Label>
                    <Input
                      id="expiryDate"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      placeholder="MM/AA"
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    🔒 Pagamento 100% seguro. Seus dados são protegidos por criptografia SSL.
                  </p>
                </div>

                <Button 
                  onClick={handlePayment}
                  disabled={loading || !formData.name || !formData.cardNumber}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Processando...' : `Pagar ${selectedPlan.price}`}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Ao continuar, você concorda com nossos termos de serviço
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
