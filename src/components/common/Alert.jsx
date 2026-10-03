import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

export const Alert = () => {
  const { toast } = useNotifications();

  if (!toast) return null;

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info
  };

  const Icon = icons[toast.type] || Info;

  const bgStyles = {
    success: 'bg-emerald-800 text-white shadow-emerald-900/20',
    error: 'bg-rose-800 text-white shadow-rose-900/20',
    info: 'bg-slate-800 text-white shadow-slate-900/20'
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto z-50 max-w-sm ml-auto animate-fade-in">
      <div className={`flex items-center gap-3 p-4 rounded-xl shadow-lg border border-white/10 ${bgStyles[toast.type]}`}>
        <Icon className="w-5 h-5 flex-shrink-0 text-white" />
        <p className="text-sm font-medium flex-1">{toast.message}</p>
      </div>
    </div>
  );
};
