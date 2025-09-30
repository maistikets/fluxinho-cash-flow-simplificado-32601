
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Key, Globe, Mail, Save, AlertCircle } from 'lucide-react';

interface AdminConfig {
  stripeTestKey: string;
  stripeLiveKey: string;
  stripeWebhookUrl: string;
  emailNotifications: boolean;
  systemEmail: string;
}

const AdminSettings = () => {
  const [config, setConfig] = useState<AdminConfig>({
    stripeTestKey: '',
    stripeLiveKey: '',
    stripeWebhookUrl: '',
    emailNotifications: true,
    systemEmail: ''
  });
  
  const [showKeys, setShowKeys] = useState({
    test: false,
    live: false
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Carregar configurações do localStorage
    const savedConfig = localStorage.getItem('admin-config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Simular delay de salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Salvar no localStorage
      localStorage.setItem('admin-config', JSON.stringify(config));
      
      toast({
        title: "Configurações salvas!",
        description: "As configurações do sistema foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Houve um erro ao salvar as configurações. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const maskApiKey = (key: string, show: boolean) => {
    if (!key || show) return key;
    if (key.length <= 8) return '*'.repeat(key.length);
    return key.substring(0, 4) + '*'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações do Sistema</h1>
        <p className="text-gray-600 mt-2">
          Configure as integrações e parâmetros do sistema
        </p>
      </div>

      <div className="grid gap-6">
        {/* Configurações do Stripe */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Integração Stripe
            </CardTitle>
            <CardDescription>
              Configure as chaves de API do Stripe para processar pagamentos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stripe-test-key">Chave de Teste (Test Key)</Label>
                <div className="relative">
                  <Input
                    id="stripe-test-key"
                    type={showKeys.test ? "text" : "password"}
                    placeholder="sk_test_..."
                    value={showKeys.test ? config.stripeTestKey : maskApiKey(config.stripeTestKey, showKeys.test)}
                    onChange={(e) => setConfig(prev => ({ ...prev, stripeTestKey: e.target.value }))}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeys(prev => ({ ...prev, test: !prev.test }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showKeys.test ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stripe-live-key">Chave de Produção (Live Key)</Label>
                <div className="relative">
                  <Input
                    id="stripe-live-key"
                    type={showKeys.live ? "text" : "password"}
                    placeholder="sk_live_..."
                    value={showKeys.live ? config.stripeLiveKey : maskApiKey(config.stripeLiveKey, showKeys.live)}
                    onChange={(e) => setConfig(prev => ({ ...prev, stripeLiveKey: e.target.value }))}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeys(prev => ({ ...prev, live: !prev.live }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showKeys.live ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhook-url">URL do Webhook</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="webhook-url"
                  type="url"
                  placeholder="https://seu-projeto.supabase.co/functions/v1/stripe-webhook"
                  value={config.stripeWebhookUrl}
                  onChange={(e) => setConfig(prev => ({ ...prev, stripeWebhookUrl: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Instruções de configuração:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>As chaves de teste são usadas durante o desenvolvimento</li>
                    <li>As chaves de produção são usadas quando o sistema está no ar</li>
                    <li>Configure o webhook no dashboard do Stripe apontando para a URL acima</li>
                    <li>Mantenha as chaves seguras e nunca as compartilhe</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Configurações de Email
            </CardTitle>
            <CardDescription>
              Configure as notificações e emails do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="system-email">Email do Sistema</Label>
              <Input
                id="system-email"
                type="email"
                placeholder="admin@financeapp.com"
                value={config.systemEmail}
                onChange={(e) => setConfig(prev => ({ ...prev, systemEmail: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Botão de Salvar */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
