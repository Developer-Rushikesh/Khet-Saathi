import React from 'react';
import { Tractor, Sprout, Clock, CalendarCheck, Receipt } from 'lucide-react';
import { Card } from '../common/Card';
import { useLanguage } from '../../context/LanguageContext';

export const StatsOverview = ({ farmsCount = 0, cropsCount = 0, todaysCount = 0, upcomingRemindersCount = 0, totalExpenses = 0 }) => {
  const { t } = useLanguage();

  const stats = [
    { label: t('totalFarms'), value: farmsCount, icon: Tractor, color: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    { label: t('activeCrops'), value: cropsCount, icon: Sprout, color: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    { label: t('todaysActivities'), value: todaysCount, icon: Clock, color: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    { label: t('upcomingReminders'), value: upcomingRemindersCount, icon: CalendarCheck, color: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    { label: t('currentExpenses'), value: `₹${totalExpenses.toLocaleString()}`, icon: Receipt, color: 'bg-slate-100 text-slate-800 border border-slate-200', fullRow: true }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-4">
      {stats.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Card key={idx} className={`${item.fullRow ? 'col-span-2 sm:col-span-4' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-1">{item.label}</span>
                <span className="text-xl sm:text-2xl font-bold text-slate-900">{item.value}</span>
              </div>
              <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center font-bold`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
