import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, Tractor, Clock, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import { mockApi } from '../../api/mockApi';
import { StatsOverview } from '../../components/dashboard/StatsOverview';
import { QuickActions } from '../../components/dashboard/QuickActions';
import { ProminentReminder } from '../../components/dashboard/ProminentReminder';
import { VoiceTextLogger } from '../../components/ai/VoiceTextLogger';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Card } from '../../components/common/Card';

export const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [activities, setActivities] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [f, c, a, r, e] = await Promise.all([
        mockApi.getFarms(),
        mockApi.getCrops(),
        mockApi.getActivities(),
        mockApi.getReminders(),
        mockApi.getExpenses()
      ]);
      setFarms(f);
      setCrops(c);
      setActivities(a);
      setReminders(r);
      setExpenses(e);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleMarkReminderDone = async (id) => {
    await mockApi.updateReminderStatus(id, 'completed');
    showToast('Reminder marked as complete!', 'success');
    loadDashboardData();
  };

  if (loading) return <LoadingSpinner message="Loading your farm dashboard..." />;

  const prominentReminder = reminders.find(r => r.status === 'overdue' || r.status === 'today') || reminders[0];
  const totalExpensesSum = expenses.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-khet-700 via-khet-600 to-khet-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-khet-600/15 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-khet-200 text-xs font-bold uppercase tracking-wider mb-2">
            <Sprout className="w-4 h-4" />
            <span>Digital Farming Record Book</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('welcomeBack')}, {user?.name || 'Ramesh Patil'}! 👋
          </h1>
          <p className="text-sm text-khet-100 mt-1 max-w-xl font-medium">
            {farms.length} Farms registered • {crops.length} Active Crops in season
          </p>
        </div>
        <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none">
          <Tractor className="w-48 h-48 text-white" />
        </div>
      </div>

      {/* Prominent Reminder */}
      <ProminentReminder reminder={prominentReminder} onMarkDone={handleMarkReminderDone} />

      {/* Tell Khet Saathi Natural Voice/Text AI logger */}
      <VoiceTextLogger />

      {/* Quick Action Buttons */}
      <QuickActions />

      {/* Stats Overview Grid */}
      <StatsOverview
        farmsCount={farms.length}
        cropsCount={crops.length}
        todaysCount={activities.filter(a => a.date === new Date().toISOString().split('T')[0]).length}
        upcomingRemindersCount={reminders.filter(r => r.status === 'today' || r.status === 'upcoming' || r.status === 'overdue').length}
        totalExpenses={totalExpensesSum}
      />

      {/* Crop Last Activity Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-slate-800">Crop Summaries & Recent Activity</h3>
          <Link to="/crops" className="text-xs font-extrabold text-khet-700 hover:underline flex items-center gap-1">
            View All Crops <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {crops.map((crop) => {
            const cropActs = activities.filter(a => a.cropId === crop.id);
            const latestAct = cropActs[0];
            const cropRems = reminders.filter(r => r.cropId === crop.id && r.status !== 'completed');
            const nextRem = cropRems[0];

            return (
              <Card key={crop.id} hoverable onClick={() => navigate(`/crops/${crop.id}`)}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-khet-100 text-khet-800">
                    🌾 {crop.name}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">{crop.farmName}</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 mt-3">
                  <p className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-khet-600" />
                    Last activity:{' '}
                    <strong className="text-slate-800 font-bold">
                      {latestAct ? `${latestAct.type} (${latestAct.date})` : 'No records yet'}
                    </strong>
                  </p>
                  <p className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    Next reminder:{' '}
                    <strong className="text-slate-800 font-bold">
                      {nextRem ? `${nextRem.reminderDate}` : 'None scheduled'}
                    </strong>
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
