import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import logo1 from '../../images/logo1.png';
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
    <div className="space-y-6 pb-8">
      {/* Clean White & Emerald Welcome Banner */}
      <div className="bg-emerald-700 rounded-2xl p-6 sm:p-8 text-white border border-emerald-800 flex items-center justify-between shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-100 text-xs font-semibold uppercase tracking-wider mb-1.5">
            <div className="w-5 h-5 rounded bg-white p-0.5 inline-flex items-center justify-center">
              <img src={logo1} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span>Digital Farming Record Book</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t('welcomeBack')}, {user?.name || 'Ramesh Patil'}!
          </h1>
          <p className="text-xs text-emerald-100 mt-1 font-medium">
            {farms.length} Farms registered • {crops.length} Active Crops in season
          </p>
        </div>
        <div className="hidden sm:block w-20 h-20 rounded-xl bg-white/10 p-2.5 border border-white/20">
          <img src={logo1} alt="Khet Sathi" className="w-full h-full object-contain" />
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
          <h3 className="text-sm font-bold text-slate-800">Crop Summaries & Recent Activity</h3>
          <Link to="/crops" className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1">
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
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                    🌾 {crop.name}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">{crop.farmName}</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 mt-3">
                  <p className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    Last activity:{' '}
                    <strong className="text-slate-800 font-bold">
                      {latestAct ? `${latestAct.type} (${latestAct.date})` : 'No records yet'}
                    </strong>
                  </p>
                  <p className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
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
