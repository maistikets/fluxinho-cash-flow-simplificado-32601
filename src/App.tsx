
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { PlansProvider } from '@/contexts/PlansContext';
import AuthRedirect from '@/components/auth/AuthRedirect';
import ErrorBoundary from '@/components/ErrorBoundary';
import AdminRoute from '@/components/admin/AdminRoute';
import AdminSidebar from '@/components/admin/AdminSidebar';
import UserLayout from '@/components/UserLayout';
import Dashboard from '@/pages/Dashboard';
import Landing from '@/pages/Landing';
import LoginPage from '@/pages/LoginPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import PlanManagement from '@/pages/admin/PlanManagement';
import AdminSettings from '@/pages/admin/AdminSettings';
import ProfileSettings from '@/pages/ProfileSettings';
import PlanSettings from '@/components/PlanSettings';
import PlanSelection from '@/pages/PlanSelection';
import Receitas from '@/pages/Receitas';
import Despesas from '@/pages/Despesas';
import FluxoCaixa from '@/pages/FluxoCaixa';
import Relatorios from '@/pages/Relatorios';
import Metas from '@/pages/Metas';
import Configuracoes from '@/pages/Configuracoes';
import Checkout from '@/pages/Checkout';
import PaymentSuccess from '@/pages/PaymentSuccess';
import PaymentCanceled from '@/pages/PaymentCanceled';
import NotFound from '@/pages/NotFound';
import { Toaster } from '@/components/ui/toaster';
import UserSubscriptionManagement from '@/pages/admin/UserSubscriptionManagement';
import FinancialReports from '@/pages/admin/FinancialReports';

function App() {
  console.log('App component is rendering');
  
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <PlansProvider>
            <Toaster />
            <AuthRedirect>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/plans" element={<PlanSelection />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-canceled" element={<PaymentCanceled />} />

              {/* User Routes with Layout */}
              <Route path="/dashboard" element={
                <UserLayout>
                  <Dashboard />
                </UserLayout>
              } />
              <Route path="/receitas" element={
                <UserLayout>
                  <Receitas />
                </UserLayout>
              } />
              <Route path="/despesas" element={
                <UserLayout>
                  <Despesas />
                </UserLayout>
              } />
              <Route path="/fluxo-caixa" element={
                <UserLayout>
                  <FluxoCaixa />
                </UserLayout>
              } />
              <Route path="/relatorios" element={
                <UserLayout>
                  <Relatorios />
                </UserLayout>
              } />
              <Route path="/metas" element={
                <UserLayout>
                  <Metas />
                </UserLayout>
              } />
              <Route path="/configuracoes" element={
                <UserLayout>
                  <Configuracoes />
                </UserLayout>
              } />
              <Route path="/profile" element={
                <UserLayout>
                  <ProfileSettings />
                </UserLayout>
              } />
              <Route path="/plan-settings" element={
                <UserLayout>
                  <PlanSettings />
                </UserLayout>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminRoute>
                  <div className="min-h-screen bg-gray-50">
                    <AdminSidebar />
                    <main className="lg:pl-72">
                      <div className="p-6">
                        <AdminDashboard />
                      </div>
                    </main>
                  </div>
                </AdminRoute>
              } />
              <Route path="/admin/users-subscriptions" element={
                <AdminRoute>
                  <div className="min-h-screen bg-gray-50">
                    <AdminSidebar />
                    <main className="lg:pl-72">
                      <div className="p-6">
                        <UserSubscriptionManagement />
                      </div>
                    </main>
                  </div>
                </AdminRoute>
              } />
              <Route path="/admin/plans" element={
                <AdminRoute>
                  <div className="min-h-screen bg-gray-50">
                    <AdminSidebar />
                    <main className="lg:pl-72">
                      <div className="p-6">
                        <PlanManagement />
                      </div>
                    </main>
                  </div>
                </AdminRoute>
              } />
              <Route path="/admin/reports" element={
                <AdminRoute>
                  <div className="min-h-screen bg-gray-50">
                    <AdminSidebar />
                    <main className="lg:pl-72">
                      <div className="p-6">
                        <FinancialReports />
                      </div>
                    </main>
                  </div>
                </AdminRoute>
              } />
              <Route path="/admin/settings" element={
                <AdminRoute>
                  <div className="min-h-screen bg-gray-50">
                    <AdminSidebar />
                    <main className="lg:pl-72">
                      <div className="p-6">
                        <AdminSettings />
                      </div>
                    </main>
                  </div>
                </AdminRoute>
              } />

              {/* 404 Route - deve ser a última */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthRedirect>
        </PlansProvider>
      </AuthProvider>
    </Router>
    </ErrorBoundary>
  );
}

export default App;
