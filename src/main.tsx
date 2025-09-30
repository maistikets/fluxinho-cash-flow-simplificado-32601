
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('main.tsx is executing');

// Proteção contra dados corrompidos no localStorage
try {
  const testKeys = ['auth-user', 'admin-users', 'admin-plans'];
  testKeys.forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        JSON.parse(data);
      } catch (e) {
        console.warn(`Removing corrupted data for key: ${key}`);
        localStorage.removeItem(key);
      }
    }
  });
} catch (error) {
  console.error('Error checking localStorage:', error);
}

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  console.log('Creating React root and rendering App');
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('App rendered successfully');
} catch (error) {
  console.error('Failed to initialize app:', error);
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; font-family: system-ui, -apple-system, sans-serif;">
      <div style="max-width: 500px; text-align: center;">
        <h1 style="color: #dc2626; margin-bottom: 16px;">Erro ao Inicializar</h1>
        <p style="color: #6b7280; margin-bottom: 24px;">Ocorreu um erro ao carregar a aplicação.</p>
        <button onclick="localStorage.clear(); window.location.reload();" style="background: #3b82f6; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
          Limpar Dados e Recarregar
        </button>
        <pre style="margin-top: 24px; padding: 16px; background: #f3f4f6; border-radius: 8px; text-align: left; overflow: auto; font-size: 12px;">
          ${error instanceof Error ? error.message : String(error)}
        </pre>
      </div>
    </div>
  `;
}
