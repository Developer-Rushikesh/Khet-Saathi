import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, AlertTriangle, Info, Check } from 'lucide-react';
import { mockApi } from '../../api/mockApi';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const Notifications = () => {
  const { t } = useLanguage();
  const { notifications, markRead, refreshNotifications } = useNotifications();
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">{t('notifications')}</h1>
        <p className="text-sm text-slate-500 font-medium">Timely reminders, crop log updates, and monthly summaries</p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <Card key={n.id} className={`${!n.read ? 'bg-khet-50/40 border-khet-200' : 'opacity-70'}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-bold ${
                  n.type === 'warning' ? 'bg-amber-100 text-amber-700' : n.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700'
                }`}>
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                    <span className="text-[11px] text-slate-400">{n.date}</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">{n.message}</p>
                </div>
              </div>

              {!n.read && (
                <Button variant="ghost" size="sm" icon={Check} onClick={() => markRead(n.id)}>
                  Mark Read
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
