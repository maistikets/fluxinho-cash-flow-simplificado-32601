
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Heart, Sparkles } from 'lucide-react';

const TrialExpiredBanner = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 mb-8">
      <CardContent className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Crown className="h-12 w-12 text-purple-600" />
            <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Sua experiência gratuita chegou ao fim! 🎉
        </h2>
        
        <p className="text-lg text-gray-700 mb-4 max-w-2xl mx-auto">
          Esperamos que tenha gostado de organizar suas finanças sem planilhas! 
          Agora é hora de continuar essa jornada com um de nossos planos.
        </p>
        
        <div className="flex items-center justify-center gap-2 text-purple-700 mb-6">
          <Heart className="h-5 w-5 fill-current" />
          <span className="font-medium">Você já experimentou o futuro das finanças!</span>
          <Heart className="h-5 w-5 fill-current" />
        </div>
        
        <Button 
          onClick={() => navigate('/plans')}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3"
        >
          Continue sua jornada ✨
        </Button>
        
        <p className="text-sm text-gray-600 mt-4">
          Escolha o plano ideal e mantenha suas finanças sempre organizadas
        </p>
      </CardContent>
    </Card>
  );
};

export default TrialExpiredBanner;
