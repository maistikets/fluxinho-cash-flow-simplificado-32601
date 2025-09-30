
import { useEffect } from 'react';

export const usePerformance = (componentName: string) => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 100) {
        console.warn(`Componente ${componentName} levou ${renderTime.toFixed(2)}ms para renderizar`);
      }
    };
  }, [componentName]);
};

export const logPageLoad = (pageName: string) => {
  if (typeof window !== 'undefined' && window.performance) {
    const loadTime = performance.now();
    console.log(`Página ${pageName} carregada em ${loadTime.toFixed(2)}ms`);
  }
};
