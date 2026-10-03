import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Receipt, Bell, Bot } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const QuickActions = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const actions = [
    { label: t('addActivity'), path: '/add-activity', icon: PlusCircle, bg: 'bg-khet-600 text-white hover:bg-khet-700' },
    { label: t('addExpense'), path: '/add-expense', icon: Receipt, bg: 'bg-purple-600 text-white hover:bg-purple-700' },
    { label: t('addReminder'), path: '/add-reminder', icon: Bell, bg: 'bg-amber-600 text-white hover:bg-amber-700' },
    { label: t('askKhetSaathi'), path: '/ai-assistant', icon: Bot, bg: 'bg-gradient-to-r from-earth-600 to-earth-500 text-white hover:opacity-95' }
  ];

  return (
    <div className="my-5">
      <h3 className="text-sm font-bold text-slate-700 mb-2.5 uppercase tracking-wider">{t('quickActions')}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <button
              key={idx}
              onClick={() => navigate(action.path)}
              className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl font-bold text-sm shadow-sm transition-all active:scale-95 ${action.bg}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
