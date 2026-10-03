import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, Plus, Check, Clock, Edit, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { mockApi } from '../../api/mockApi';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmModal } from '../../components/common/ConfirmModal';

export const Reminders = () => {
  const { t } = useLanguage();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [reminders, setReminders] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'today' | 'upcoming' | 'overdue' | 'completed'
  const [deletingId, setDeletingId] = useState(null);

  const loadReminders = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getReminders();
      setReminders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReminders();
  }, []);

  const handleMarkComplete = async (id) => {
    await mockApi.updateReminderStatus(id, 'completed');
    showToast('Reminder marked as completed!', 'success');
    loadReminders();
  };

  const handleSnooze = async (rem) => {
    const currentDate = new Date(rem.reminderDate || Date.now());
    currentDate.setDate(currentDate.getDate() + 2);
    const newDateStr = currentDate.toISOString().split('T')[0];
    await mockApi.createReminder({
      ...rem,
      id: undefined,
      reminderDate: newDateStr,
      status: 'upcoming'
    });
    await mockApi.deleteReminder(rem.id);
    showToast(`Reminder snoozed to ${newDateStr}`, 'info');
    loadReminders();
  };

  const handleDelete = async () => {
    if (deletingId) {
      await mockApi.deleteReminder(deletingId);
      showToast('Reminder deleted', 'info');
      setDeletingId(null);
      loadReminders();
    }
  };

  if (loading) return <LoadingSpinner message="Fetching farming reminders..." />;

  const filteredReminders = reminders.filter(r => {
    if (activeTab === 'today') return r.status === 'today';
    if (activeTab === 'upcoming') return r.status === 'upcoming';
    if (activeTab === 'overdue') return r.status === 'overdue';
    if (activeTab === 'completed') return r.status === 'completed';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'overdue':
        return <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[11px] flex items-center gap-1">⏰ {t('overdue')}</span>;
      case 'today':
        return <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold text-[11px] flex items-center gap-1">🔔 {t('dueToday')}</span>;
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold text-[11px]">✓ {t('completed')}</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-md bg-sky-100 text-sky-800 font-bold text-[11px]">{t('upcoming')}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{t('reminders')}</h1>
          <p className="text-sm text-slate-500 font-medium">Never miss important spray, fertilizer, or irrigation dates</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => navigate('/add-reminder')}>
          {t('addReminder')}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { key: 'all', label: t('all') },
          { key: 'today', label: t('today') },
          { key: 'overdue', label: t('overdue') },
          { key: 'upcoming', label: t('upcoming') },
          { key: 'completed', label: t('completed') }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-khet-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      {filteredReminders.length === 0 ? (
        <EmptyState title="No reminders found" actionText={t('addReminder')} onAction={() => navigate('/add-reminder')} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReminders.map((rem) => (
            <Card key={rem.id} className={`${rem.status === 'completed' ? 'opacity-60 bg-slate-50' : ''}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusBadge(rem.status)}
                    <span className="text-xs font-semibold text-slate-500">
                      🌾 {rem.cropName} — {rem.farmName}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{rem.title}</h3>
                </div>

                <button
                  onClick={() => setDeletingId(rem.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 mt-3">
                <Calendar className="w-4 h-4 text-khet-600" />
                <span>Target Date: <strong>{rem.reminderDate}</strong></span>
              </div>

              {rem.notes && (
                <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {rem.notes}
                </p>
              )}

              {/* Actions */}
              {rem.status !== 'completed' && (
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Check}
                    onClick={() => handleMarkComplete(rem.id)}
                  >
                    {t('markCompleted')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Clock}
                    onClick={() => handleSnooze(rem)}
                  >
                    {t('snooze')}
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this reminder?"
      />
    </div>
  );
};
