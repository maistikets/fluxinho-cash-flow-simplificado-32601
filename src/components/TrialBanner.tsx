import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Crown, Heart } from 'lucide-react';

const TrialBanner = () => {
  const { user, subscription, isTrialExpired, getTrialDaysLeft } = useAuth();
  const navigate = useNavigate();

  if (!user || !subscription || subscription.plan_type !== 'trial') {
    return null;
  }

  const daysLeft = getTrialDaysLeft();
  const expired = isTrialExpired();
  const expiring = daysLeft <= 2 && !expired;

  if (expired) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-red-50 border-l-4 border-purple-400 p-6 mb-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-purple-600" />
              <Heart className="h-5 w-5 text-red-500 fill-current" />
            </div>
            <div className="ml-4">
              <p className="text-lg font-semibold text-gray-900 mb-1">
                Sua experiência gratuita chegou ao fim! 🎉
              </p>
              <p className="text-sm text-gray-700">
                Esperamos que tenha gostado de organizar suas finanças sem planilhas. Continue essa jornada escolhendo um plano!
              </p>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/plans')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
          >
            Continue sua Jornada ✨
          </Button>
        </div>
      </div>
    );
  }

  if (expiring) {
    return (
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-6 mb-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Crown className="h-6 w-6 text-yellow-500" />
            <div className="ml-4">
              <p className="text-lg font-semibold text-gray-900 mb-1">
                Últimos dias do seu teste gratuito! ⏰
              </p>
              <p className="text-sm text-gray-700">
                Restam apenas <strong>{daysLeft} dias</strong> para aproveitar. Que tal garantir seu acesso escolhendo um plano?
              </p>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/plans')}
            variant="outline"
            className="border-yellow-400 text-yellow-700 hover:bg-yellow-50 font-medium"
          >
            Ver Planos 💎
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-blue-400 p-6 mb-6 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Crown className="h-6 w-6 text-blue-500" />
          <div className="ml-4">
            <p className="text-lg font-semibold text-gray-900 mb-1">
              Teste gratuito ativo! 🚀
            </p>
            <p className="text-sm text-gray-700">
              Você ainda tem <strong>{daysLeft} dias</strong> para explorar todas as funcionalidades. Está gostando da experiência?
            </p>
          </div>
        </div>
        <Button 
          onClick={() => navigate('/plans')}
          variant="outline"
          className="border-blue-400 text-blue-700 hover:bg-blue-50 font-medium"
        >
          Fazer Upgrade 🎯
        </Button>
      </div>
    </div>
  );
};

export default TrialBanner;
