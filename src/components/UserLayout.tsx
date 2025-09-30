
import React from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Menu } from 'lucide-react';

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
  return (
    <SidebarProvider>
      {/* Header com trigger visível em mobile e tablet */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-gray-200 flex items-center px-4 lg:hidden">
        <SidebarTrigger className="mr-2 p-2 hover:bg-gray-100 rounded-md transition-colors">
          <Menu className="h-5 w-5" />
        </SidebarTrigger>
        <h1 className="font-semibold text-gray-900 text-lg">FinanceApp</h1>
      </header>

      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <main className="h-full pt-14 lg:pt-0 min-h-screen">
            <div className="p-4 sm:p-5 lg:p-6 max-w-full overflow-hidden">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default UserLayout;
