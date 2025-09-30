
import React from 'react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: number;
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
  color?: 'blue' | 'green' | 'red' | 'yellow';
  formatAsCurrency?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  trend, 
  subtitle, 
  color = 'blue',
  formatAsCurrency = true
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('pt-BR');
  };

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200'
  };

  return (
    <div className={cn(
      "p-3 sm:p-4 lg:p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-md bg-white",
      colorClasses[color]
    )}>
      <h3 className="text-xs sm:text-sm font-medium opacity-80 mb-2 line-clamp-2 leading-tight">{title}</h3>
      <div className="flex items-end justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-lg sm:text-xl lg:text-2xl font-bold line-clamp-1 leading-tight">
            {formatAsCurrency ? formatCurrency(value) : formatNumber(value)}
          </p>
          {subtitle && (
            <p className="text-xs sm:text-sm opacity-70 mt-1 line-clamp-2 leading-tight">{subtitle}</p>
          )}
        </div>
        {trend && (
          <div className={cn(
            "text-xs px-2 py-1 rounded-full flex-shrink-0",
            trend === 'up' && "bg-green-100 text-green-800",
            trend === 'down' && "bg-red-100 text-red-800",
            trend === 'neutral' && "bg-gray-100 text-gray-800"
          )}>
            {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
