import React from 'react';
import { Sprout } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const LoadingSpinner = ({ message }) => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-500 min-h-[200px]">
      <div className="relative flex items-center justify-center mb-3">
        <div className="w-12 h-12 rounded-full border-4 border-khet-200 border-t-khet-600 animate-spin" />
        <Sprout className="w-6 h-6 text-khet-600 absolute" />
      </div>
      <p className="text-sm font-medium text-slate-600 animate-pulse">
        {message || t('loading')}
      </p>
    </div>
  );
};
