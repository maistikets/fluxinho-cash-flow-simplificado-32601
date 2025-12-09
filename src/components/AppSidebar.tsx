import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  Home, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  FileText,
  Target,
  Settings,
  DollarSign,
  User,
  LogOut,
  X
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    color: "text-blue-600"
  },
  {
    title: "Receitas",
    url: "/receitas",
    icon: TrendingUp,
    color: "text-green-600"
  },
  {
    title: "Despesas",
    url: "/despesas",
    icon: TrendingDown,
    color: "text-red-600"
  },
  {
    title: "Fluxo de Caixa",
    url: "/fluxo-caixa",
    icon: BarChart3,
    color: "text-purple-600"
  },
  {
    title: "Relatórios",
    url: "/relatorios",
    icon: FileText,
    color: "text-orange-600"
  },
  {
    title: "Metas",
    url: "/metas",
    icon: Target,
    color: "text-purple-600"
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { user, profile, roles, signOut } = useAuth();
  const navigate = useNavigate();
  const { state, toggleSidebar } = useSidebar();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const displayName = profile?.name || user?.email || 'Usuário';
  const userRole = roles.length > 0 ? roles[0].role : 'user';

  return (
    <Sidebar 
      className="border-r-2 border-gray-100 lg:relative fixed inset-y-0 left-0 z-40 lg:z-auto w-64 data-[state=collapsed]:w-16"
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            {state !== "collapsed" && (
              <div>
                <h1 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FinanceApp
                </h1>
                <p className="text-xs text-gray-500">Sistema Inteligente</p>
              </div>
            )}
          </div>
          <div className="lg:hidden">
            <SidebarTrigger className="p-2 hover:bg-gray-100 rounded-md transition-colors">
              <X className="h-5 w-5" />
            </SidebarTrigger>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="py-4">
        <SidebarGroup>
          {state !== "collapsed" && (
            <SidebarGroupLabel className="px-4 text-gray-500 font-medium text-sm mb-2">
              Menu Principal
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className="h-12 rounded-lg transition-all duration-200 hover:bg-gray-50 hover:scale-105 data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-50 data-[active=true]:to-purple-50 data-[active=true]:border-l-4 data-[active=true]:border-blue-500 data-[active=true]:shadow-md"
                    tooltip={state === "collapsed" ? item.title : undefined}
                  >
                    <Link to={item.url} className="flex items-center gap-3 px-3" onClick={() => {
                      if (window.innerWidth < 1024) {
                        toggleSidebar();
                      }
                    }}>
                      <item.icon className={`h-5 w-5 ${item.color} flex-shrink-0`} />
                      {state !== "collapsed" && (
                        <span className="font-medium text-gray-700">{item.title}</span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-100 bg-gray-50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname === "/configuracoes"}
              className="h-12 hover:bg-gray-100 rounded-lg transition-all duration-200 data-[active=true]:bg-blue-100"
              tooltip={state === "collapsed" ? "Configurações" : undefined}
            >
              <Link to="/configuracoes" className="flex items-center gap-3 px-3" onClick={() => {
                if (window.innerWidth < 1024) {
                  toggleSidebar();
                }
              }}>
                <Settings className="h-5 w-5 text-gray-600 flex-shrink-0" />
                {state !== "collapsed" && (
                  <span className="font-medium text-gray-700">Configurações</span>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <div className="px-3 py-2">
            {state === "collapsed" ? (
              <div className="flex justify-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="h-10 w-10 p-0 hover:bg-red-50 hover:text-red-600 rounded-full"
                  title="Sair"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 text-sm min-w-0">
                  <p className="font-medium text-gray-700 truncate">{displayName}</p>
                  <p className="text-xs text-gray-500 truncate capitalize">{userRole}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 flex-shrink-0"
                  title="Sair"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
