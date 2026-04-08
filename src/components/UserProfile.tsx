import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Edit, Save, X, MapPin, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UserProfile = () => {
  const { user, profile, roles } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    cpf: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  });

  // Load profile data from DB
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setFormData({
            name: data.name || '',
            email: data.email || '',
            phone: (data as any).phone || '',
            company: (data as any).company || '',
            cpf: (data as any).cpf || '',
            cep: (data as any).cep || '',
            street: (data as any).street || '',
            number: (data as any).address_number || '',
            complement: (data as any).complement || '',
            neighborhood: (data as any).neighborhood || '',
            city: (data as any).city || '',
            state: (data as any).state || '',
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, [user]);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 8);
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const searchCEP = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    setIsLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          street: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || ''
        }));
        toast({ title: "CEP encontrado!", description: "Endereço preenchido automaticamente." });
      } else {
        toast({ title: "CEP não encontrado", description: "Verifique o CEP informado.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Erro ao buscar CEP", description: "Tente novamente mais tarde.", variant: "destructive" });
    } finally {
      setIsLoadingCep(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          phone: formData.phone,
          cpf: formData.cpf,
          company: formData.company,
          cep: formData.cep,
          street: formData.street,
          address_number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
        } as any)
        .eq('id', user.id);

      if (error) throw error;

      toast({ title: "Perfil salvo!", description: "Suas informações foram atualizadas com sucesso." });
      setIsEditing(false);
    } catch (error: any) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = async () => {
    // Reload from DB
    if (!user) return;
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
    if (data) {
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: (data as any).phone || '',
        company: (data as any).company || '',
        cpf: (data as any).cpf || '',
        cep: (data as any).cep || '',
        street: (data as any).street || '',
        number: (data as any).address_number || '',
        complement: (data as any).complement || '',
        neighborhood: (data as any).neighborhood || '',
        city: (data as any).city || '',
        state: (data as any).state || '',
      });
    }
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    if (field === 'cpf') formattedValue = formatCPF(value);
    else if (field === 'phone') formattedValue = formatPhone(value);
    else if (field === 'cep') formattedValue = formatCEP(value);

    setFormData(prev => ({ ...prev, [field]: formattedValue }));

    if (field === 'cep' && formattedValue.replace(/\D/g, '').length === 8) {
      searchCEP(formattedValue);
    }
  };

  const displayName = formData.name || user?.email || 'Usuário';
  const userRole = roles.length > 0 ? roles[0].role : 'user';

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>Perfil do Usuário</CardTitle>
              <CardDescription>Gerencie suas informações pessoais</CardDescription>
            </div>
          </div>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" /> Editar
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel} disabled={isSaving}>
                <X className="h-4 w-4 mr-2" /> Cancelar
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Salvar
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">
              {displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{displayName}</p>
            <p className="text-sm text-muted-foreground capitalize">{userRole}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Dados Pessoais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} disabled={!isEditing} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input id="cpf" value={formData.cpf} onChange={(e) => handleInputChange('cpf', e.target.value)} disabled={!isEditing} placeholder="000.000.000-00" maxLength={14} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={formData.email} disabled className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} disabled={!isEditing} placeholder="(00) 00000-0000" maxLength={15} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="company">Empresa</Label>
              <Input id="company" value={formData.company} onChange={(e) => handleInputChange('company', e.target.value)} disabled={!isEditing} placeholder="Nome da empresa" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5" /> Endereço
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <div className="relative">
                <Input id="cep" value={formData.cep} onChange={(e) => handleInputChange('cep', e.target.value)} disabled={!isEditing || isLoadingCep} placeholder="00000-000" maxLength={9} />
                {isLoadingCep && (
                  <div className="absolute right-3 top-3">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="street">Rua/Avenida</Label>
              <Input id="street" value={formData.street} onChange={(e) => handleInputChange('street', e.target.value)} disabled={!isEditing} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="number">Número</Label>
              <Input id="number" value={formData.number} onChange={(e) => handleInputChange('number', e.target.value)} disabled={!isEditing} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="complement">Complemento</Label>
              <Input id="complement" value={formData.complement} onChange={(e) => handleInputChange('complement', e.target.value)} disabled={!isEditing} placeholder="Opcional" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input id="neighborhood" value={formData.neighborhood} onChange={(e) => handleInputChange('neighborhood', e.target.value)} disabled={!isEditing} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} disabled={!isEditing} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input id="state" value={formData.state} onChange={(e) => handleInputChange('state', e.target.value)} disabled={!isEditing} maxLength={2} placeholder="SP" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
