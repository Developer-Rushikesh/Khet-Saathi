import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Receipt, Bot, BarChart3 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const QuickActions = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const actions = [
    { label: t('addActivity'), path: '/add-activity', icon: PlusCircle, bg: 'bg-emerald-600 text-white hover:bg-emerald-700' },
    { label: t('addExpense'), path: '/add-expense', icon: Receipt, bg: 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100' },
    { label: 'Farm Reports', path: '/reports', icon: BarChart3, bg: 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-50' },
    { label: t('askKhetSaathi'), path: '/ai-assistant', icon: Bot, bg: 'bg-emerald-700 text-white hover:bg-emerald-800' }
  ];

  return (
    <div className="my-5">
      <h3 className="text-xs font-bold text-slate-700 mb-2.5 uppercase tracking-wider">{t('quickActions')}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <button
              key={idx}
              onClick={() => navigate(action.path)}
              className={`flex items-center justify-center gap-2 p-3.5 rounded-xl font-bold text-xs transition-colors ${action.bg}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
