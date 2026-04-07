import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  Home, TrendingUp, TrendingDown, BarChart3, FileText,
  Target, Settings, DollarSign, User, LogOut, X, CreditCard
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home, color: "text-blue-600" },
  { title: "Receitas", url: "/receitas", icon: TrendingUp, color: "text-green-600" },
  { title: "Despesas", url: "/despesas", icon: TrendingDown, color: "text-red-600" },
  { title: "Fluxo de Caixa", url: "/fluxo-caixa", icon: BarChart3, color: "text-purple-600" },
  { title: "Relatórios", url: "/relatorios", icon: FileText, color: "text-orange-600" },
  { title: "Metas", url: "/metas", icon: Target, color: "text-purple-600" },
  { title: "Cartões", url: "/cartoes", icon: CreditCard, color: "text-indigo-600" },
];

export function AppSidebar() {
  const location = useLocation();
  const { user, profile, roles, signOut } = useAuth();
  const navigate = useNavigate();
  const { state, toggleSidebar } = useSidebar();

  const handleLogout = async () => {
    try { await signOut(); navigate('/'); } catch (error) { console.error('Erro ao fazer logout:', error); }
  };

  const displayName = profile?.name || user?.email || 'Usuário';
  const userRole = roles.length > 0 ? roles[0].role : 'user';

  return (
    <Sidebar 
      className="border-r border-gray-100 lg:relative fixed inset-y-0 left-0 z-40 lg:z-auto w-56 data-[state=collapsed]:w-14"
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50 py-2">
        <div className="flex items-center justify-between px-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
            {state !== "collapsed" && (
              <h1 className="font-bold text-base bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FinanceApp
              </h1>
            )}
          </div>
          <div className="lg:hidden">
            <SidebarTrigger className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
              <X className="h-4 w-4" />
            </SidebarTrigger>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="py-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5 px-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className="h-9 rounded-md transition-all duration-200 hover:bg-gray-50 data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-50 data-[active=true]:to-purple-50 data-[active=true]:border-l-3 data-[active=true]:border-blue-500"
                    tooltip={state === "collapsed" ? item.title : undefined}
                  >
                    <Link to={item.url} className="flex items-center gap-2 px-2" onClick={() => {
                      if (window.innerWidth < 1024) toggleSidebar();
                    }}>
                      <item.icon className={`h-4 w-4 ${item.color} flex-shrink-0`} />
                      {state !== "collapsed" && (
                        <span className="font-medium text-sm text-gray-700">{item.title}</span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-100 bg-gray-50 py-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={location.pathname === "/configuracoes"}
              className="h-9 hover:bg-gray-100 rounded-md transition-all duration-200 data-[active=true]:bg-blue-100"
              tooltip={state === "collapsed" ? "Configurações" : undefined}
            >
              <Link to="/configuracoes" className="flex items-center gap-2 px-2" onClick={() => {
                if (window.innerWidth < 1024) toggleSidebar();
              }}>
                <Settings className="h-4 w-4 text-gray-600 flex-shrink-0" />
                {state !== "collapsed" && (
                  <span className="font-medium text-sm text-gray-700">Configurações</span>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <div className="px-2 py-1">
            {state === "collapsed" ? (
              <div className="flex justify-center">
                <Button variant="ghost" size="sm" onClick={handleLogout} className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 rounded-full" title="Sair">
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-1.5 bg-white rounded-md shadow-sm">
                <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs text-gray-700 truncate">{displayName}</p>
                  <p className="text-[10px] text-gray-500 truncate capitalize">{userRole}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600 flex-shrink-0" title="Sair">
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
