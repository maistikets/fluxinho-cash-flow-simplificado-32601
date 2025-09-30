
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap } from 'lucide-react';
import { Plan } from '@/contexts/PlansContext';

interface PlanCardProps {
  plan: Plan;
  isCurrentPlan?: boolean;
  onSelectPlan?: (planId: string) => void;
  showSelectButton?: boolean;
}

const PlanCard = ({ plan, isCurrentPlan = false, onSelectPlan, showSelectButton = true }: PlanCardProps) => {
  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case 'basic': return <Zap className="h-6 w-6" />;
      case 'premium': 
      case 'annual': return <Crown className="h-6 w-6" />;
      default: return <Check className="h-6 w-6" />;
    }
  };

  return (
    <Card 
      className={`relative transition-all duration-200 hover:shadow-lg flex flex-col h-full ${
        plan.highlight 
          ? 'border-blue-500 shadow-lg scale-105' 
          : isCurrentPlan
          ? 'border-green-500 bg-green-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {plan.highlight && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            {plan.badge}
          </span>
        </div>
      )}
      
      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            Plano Atual
          </span>
        </div>
      )}

      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-4">
          <div className={`p-3 rounded-full ${
            plan.highlight ? 'bg-blue-100 text-blue-600' : 
            isCurrentPlan ? 'bg-green-100 text-green-600' :
            'bg-gray-100 text-gray-600'
          }`}>
            {getPlanIcon(plan.id)}
          </div>
        </div>
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <CardDescription className="text-lg">
          {plan.description}
        </CardDescription>
        <div className="mt-4">
          {plan.originalPrice && (
            <span className="text-lg text-gray-400 line-through mr-2">
              {plan.originalPrice}
            </span>
          )}
          <span className="text-4xl font-bold">{plan.price}</span>
          <span className="text-gray-600">/{plan.period}</span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1">
        <ul className="space-y-3 mb-6 flex-1">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        {showSelectButton && (
          <div className="mt-auto">
            <Button
              className={`w-full ${
                plan.highlight 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : isCurrentPlan
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-900 hover:bg-gray-800'
              }`}
              onClick={() => onSelectPlan?.(plan.id)}
              disabled={isCurrentPlan}
            >
              {isCurrentPlan ? 'Plano Atual' : 'Selecionar Plano'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlanCard;
