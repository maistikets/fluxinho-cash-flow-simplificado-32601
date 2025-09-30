
import React from 'react';
import { Calendar, Bell } from 'lucide-react';

const Header = () => {
  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">Fluxinho</h1>
          <p className="text-sm text-gray-600 capitalize">{today}</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
            <Calendar className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              2
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
