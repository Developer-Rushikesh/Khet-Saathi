import React from 'react';
import { CalendarCheck, AlertCircle, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';

export const ProminentReminder = ({ reminder, onMarkDone }) => {
  const navigate = useNavigate();

  if (!reminder) return null;

  const isOverdue = reminder.status === 'overdue';

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 border shadow-sm transition-all my-4 ${
        isOverdue
          ? 'bg-amber-50 border-amber-300 text-amber-900'
          : 'bg-emerald-50 border-emerald-300 text-emerald-900'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* Info */}
        <div className="flex items-start gap-3.5">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold flex-shrink-0 ${
              isOverdue ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
            }`}
          >
            {isOverdue ? <AlertCircle className="w-6 h-6" /> : <CalendarCheck className="w-6 h-6" />}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-md bg-white/70">
                {isOverdue ? '⏰ Overdue Task' : '🔔 Today\'s Priority Task'}
              </span>
              <span className="text-xs font-bold opacity-80">
                🌾 {reminder.cropName} — {reminder.farmName}
              </span>
            </div>

            <h3 className="text-base font-extrabold text-slate-900">{reminder.title}</h3>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-700 font-medium">
              <span>Next reminder date: <strong className="font-bold">{reminder.reminderDate}</strong></span>
              {reminder.notes && <span className="opacity-90">• {reminder.notes}</span>}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-black/10">
          <Button
            variant="primary"
            size="sm"
            icon={Check}
            onClick={() => onMarkDone && onMarkDone(reminder.id)}
          >
            Mark Complete
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={ArrowRight}
            onClick={() => navigate('/reminders')}
          >
            View All
          </Button>
        </div>

      </div>
    </div>
  );
};
