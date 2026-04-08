import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Key, LogOut, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SecuritySettings = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [isChanging, setIsChanging] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePasswordChange = async () => {
    if (!passwords.new || !passwords.confirm) {
      toast({ title: "Erro", description: "Preencha todos os campos de senha.", variant: "destructive" });
      return;
    }

    if (passwords.new.length < 6) {
      toast({ title: "Erro", description: "A senha deve ter no mínimo 6 caracteres.", variant: "destructive" });
      return;
    }

    if (passwords.new !== passwords.confirm) {
      toast({ title: "Erro", description: "As senhas não coincidem.", variant: "destructive" });
      return;
    }

    setIsChanging(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: passwords.new });
      if (error) throw error;

      setPasswords({ new: '', confirm: '' });
      toast({ title: "Senha alterada!", description: "Sua senha foi alterada com sucesso." });
    } catch (error: any) {
      toast({ title: "Erro ao alterar senha", description: error.message, variant: "destructive" });
    } finally {
      setIsChanging(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <div>
            <CardTitle>Segurança</CardTitle>
            <CardDescription>Configure opções de segurança da sua conta</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Key className="h-4 w-4" /> Alterar Senha
          </h3>
          <p className="text-sm text-muted-foreground">
            Escolha uma nova senha com pelo menos 6 caracteres.
          </p>
          
          <div className="grid gap-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNew ? 'text' : 'password'}
                  value={passwords.new}
                  onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                  placeholder="Mínimo 6 caracteres"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirm ? 'text' : 'password'}
                  value={passwords.confirm}
                  onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                  placeholder="Repita a nova senha"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            {passwords.new && passwords.confirm && passwords.new !== passwords.confirm && (
              <p className="text-sm text-destructive">As senhas não coincidem.</p>
            )}
            <Button onClick={handlePasswordChange} disabled={isChanging || !passwords.new || !passwords.confirm} className="w-fit">
              {isChanging ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Alterando...</> : 'Alterar Senha'}
            </Button>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-destructive">Zona de Perigo</h3>
            <p className="text-sm text-muted-foreground">Você será desconectado e redirecionado para a página de login.</p>
            <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" /> Sair da Conta
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;
