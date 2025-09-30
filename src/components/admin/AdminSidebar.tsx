
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  CreditCard,
  Settings,
  LogOut,
  Cog,
  UserCheck
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      title: 'Gestão de Usuários',
      href: '/admin/users',
      icon: Users,
    },
    {
      title: 'Gestão de Assinantes',
      href: '/admin/financial',
      icon: UserCheck,
    },
    {
      title: 'Gestão de Planos',
      href: '/admin/plans',
      icon: CreditCard,
    },
    {
      title: 'Relatórios Financeiros',
      href: '/admin/reports',
      icon: DollarSign,
    },
    {
      title: 'Configurações do Sistema',
      href: '/admin/settings',
      icon: Cog,
    },
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-72 bg-gray-50 border-r border-gray-200 py-4">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <div className="text-center">
          <span className="text-lg font-semibold">Painel Administrativo</span>
          <p className="text-xs text-gray-500 mt-1">FinanceApp - Sistema Financeiro</p>
        </div>
      </div>
      <div className="flex flex-col h-[calc(100vh-128px)] justify-between">
        <div className="flex-grow pt-6 px-2">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.title}>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start font-normal',
                    isActive(item.href)
                      ? 'bg-gray-100 hover:bg-gray-100'
                      : 'hover:bg-gray-50'
                  )}
                  onClick={() => navigate(item.href)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <div className="pb-6 px-2">
          <div className="border-t border-gray-200 pt-4">
            <Button
              variant="ghost"
              className="w-full justify-start font-normal hover:bg-gray-50"
              onClick={() => navigate('/settings')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start font-normal hover:bg-gray-50 mt-2"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm text-blue-700">
            Logado como: {user?.email} ({user?.role})
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
