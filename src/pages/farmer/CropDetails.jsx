import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sprout, Calendar, Tractor, ArrowLeft, Plus, Clock, Receipt, CalendarCheck, TrendingUp, DollarSign } from 'lucide-react';
import { mockApi } from '../../api/mockApi';
import { useLanguage } from '../../context/LanguageContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { ActivityTimeline } from '../../components/timeline/ActivityTimeline';

export const CropDetails = () => {
  const { cropId } = useParams();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [crop, setCrop] = useState(null);
  const [activities, setActivities] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchCropDetails = async () => {
      setLoading(true);
      try {
        const c = await mockApi.getCropById(cropId);
        const [a, r, e] = await Promise.all([
          mockApi.getActivities(),
          mockApi.getReminders(),
          mockApi.getExpenses()
        ]);
        setCrop(c);
        setActivities(a.filter(item => item.cropId === cropId));
        setReminders(r.filter(item => item.cropId === cropId));
        setExpenses(e.filter(item => item.cropId === cropId));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCropDetails();
  }, [cropId]);

  if (loading) return <LoadingSpinner message="Loading crop record..." />;
  if (!crop) return <div className="p-8 text-center text-slate-500">Crop record not found.</div>;

  const totalCropExpenses = expenses.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const totalHarvestIncome = activities.reduce((sum, item) => sum + (parseFloat(item.income) || 0), 0);
  const cropNetProfit = totalHarvestIncome - totalCropExpenses;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Back Link */}
      <button
        onClick={() => navigate('/crops')}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-khet-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Crops</span>
      </button>

      {/* Hero Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-md bg-khet-100 text-khet-800 font-bold text-xs">
                {crop.season}
              </span>
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Tractor className="w-3.5 h-3.5 text-slate-400" />
                {crop.farmName}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">🌾 {crop.name}</h1>
            <p className="text-xs font-semibold text-slate-500 mt-1">Variety: {crop.variety || 'Standard'}</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="primary"
              icon={Plus}
              fullWidth
              onClick={() => navigate('/add-activity', { state: { cropId: crop.id } })}
            >
              + Add Activity / Cost
            </Button>
          </div>
        </div>

        {/* Profitability Banner */}
        <div className="mt-5 p-4 bg-gradient-to-r from-emerald-700 to-khet-600 rounded-2xl text-white flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-200">Crop Financial Health</span>
            <div className="flex items-center gap-4 mt-1">
              <div>
                <span className="text-xs text-emerald-100 block">Harvest Revenue</span>
                <span className="text-lg font-extrabold">₹{totalHarvestIncome.toLocaleString()}</span>
              </div>
              <span className="text-emerald-300 font-bold text-xl">-</span>
              <div>
                <span className="text-xs text-emerald-100 block">Crop Expenses</span>
                <span className="text-lg font-extrabold text-amber-200">₹{totalCropExpenses.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="text-right border-l border-emerald-500/60 pl-4">
            <span className="text-xs font-extrabold text-emerald-200 uppercase block">Net Crop Profit</span>
            <span className={`text-2xl font-black ${cropNetProfit >= 0 ? 'text-amber-300' : 'text-rose-200'}`}>
              ₹{cropNetProfit.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-4 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">{t('sowingDate')}</span>
            <span className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-4 h-4 text-khet-600" />
              {crop.sowingDate}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">{t('expectedHarvest')}</span>
            <span className="text-sm font-extrabold text-amber-700 mt-0.5 block">
              {crop.expectedHarvestDate || 'N/A'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Recorded Activities</span>
            <span className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5 mt-0.5">
              <Clock className="w-4 h-4 text-sky-600" />
              {activities.length} Events
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Total Expenses</span>
            <span className="text-sm font-extrabold text-purple-700 flex items-center gap-1 mt-0.5">
              <Receipt className="w-4 h-4 text-purple-600" />
              ₹{totalCropExpenses.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Reminders section for this crop */}
      {reminders.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-amber-600" />
            Upcoming Reminders for {crop.name}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {reminders.map(rem => (
              <Card key={rem.id} className="border-l-4 border-l-amber-500">
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-bold text-slate-900">{rem.title}</h4>
                  <span className="text-xs font-bold text-amber-700">{rem.reminderDate}</span>
                </div>
                {rem.notes && <p className="text-xs text-slate-500 mt-1">{rem.notes}</p>}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Activity Timeline */}
      <div>
        <h3 className="text-base font-bold text-slate-800 mb-3">Activity Timeline & Costs</h3>
        <ActivityTimeline activities={activities} crops={[crop]} />
      </div>
    </div>
  );
};
