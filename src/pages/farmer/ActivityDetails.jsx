import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Calendar, Sprout, Tractor, Tag } from 'lucide-react';
import { mockApi } from '../../api/mockApi';
import { useNotifications } from '../../context/NotificationContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Button } from '../../components/common/Button';
import { ConfirmModal } from '../../components/common/ConfirmModal';

export const ActivityDetails = () => {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useNotifications();

  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const item = await mockApi.getActivityById(activityId);
        setActivity(item);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [activityId]);

  const handleDelete = async () => {
    await mockApi.deleteActivity(activityId);
    showToast('Activity record deleted', 'info');
    navigate('/activity-history');
  };

  if (loading) return <LoadingSpinner message="Loading activity record..." />;
  if (!activity) return <div className="p-8 text-center text-slate-500">Activity record not found.</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-12">
      <button
        onClick={() => navigate('/activity-history')}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-khet-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Activity Timeline</span>
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-khet-100 text-khet-800 inline-block mb-2">
              {activity.type}
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900">{activity.type} Details</h1>
            <p className="text-xs text-slate-500 font-semibold mt-1">Recorded on {activity.date}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Edit}
              onClick={() => navigate(`/activities/${activity.id}/edit`)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={() => setShowConfirm(true)}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block font-medium">Crop</span>
            <span className="text-sm font-bold text-slate-800 flex items-center gap-1 mt-0.5">
              <Sprout className="w-4 h-4 text-khet-600" />
              {activity.cropName}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block font-medium">Farm</span>
            <span className="text-sm font-bold text-slate-800 flex items-center gap-1 mt-0.5">
              <Tractor className="w-4 h-4 text-slate-400" />
              {activity.farmName}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block font-medium">Item / Product</span>
            <span className="text-sm font-bold text-slate-800 mt-0.5 block">{activity.productName || 'N/A'}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block font-medium">Quantity / Dose</span>
            <span className="text-sm font-bold text-slate-800 mt-0.5 block">{activity.quantity ? `${activity.quantity} ${activity.unit}` : 'N/A'}</span>
          </div>
        </div>

        {/* Labor / Worker & Financial Breakdown Card */}
        <div className="p-4 bg-sky-50/60 border border-sky-200 rounded-2xl space-y-3 text-xs">
          <h4 className="font-extrabold text-sky-900 uppercase tracking-wider flex items-center justify-between">
            <span>👥 Labor & Expense Breakdown</span>
            <span className="text-sm font-black text-sky-950">Total: ₹{parseFloat(activity.cost || 0).toLocaleString()}</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="bg-white p-2.5 rounded-xl border border-sky-100">
              <span className="text-slate-400 font-semibold block">Workers Used</span>
              <span className="text-sm font-bold text-slate-900">{activity.personCount || 0} Persons</span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-sky-100">
              <span className="text-slate-400 font-semibold block">Cost per Person</span>
              <span className="text-sm font-bold text-slate-900">₹{activity.costPerPerson || 0} / day</span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-sky-100">
              <span className="text-slate-400 font-semibold block">Total Labor Cost</span>
              <span className="text-sm font-bold text-sky-700">
                ₹{((parseFloat(activity.personCount) || 0) * (parseFloat(activity.costPerPerson) || 0)).toLocaleString()}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-sky-100">
              <span className="text-slate-400 font-semibold block">Material / Product Cost</span>
              <span className="text-sm font-bold text-emerald-700">
                ₹{(parseFloat(activity.materialCost) || (parseFloat(activity.cost || 0) - ((parseFloat(activity.personCount) || 0) * (parseFloat(activity.costPerPerson) || 0))) || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {activity.income > 0 && (
            <div className="bg-emerald-100/80 p-3 rounded-xl border border-emerald-300 flex items-center justify-between font-bold text-emerald-900">
              <span>🌾 Harvest Sale Revenue Gained:</span>
              <span className="text-base font-black text-emerald-950">₹{parseFloat(activity.income).toLocaleString()}</span>
            </div>
          )}
        </div>

        {activity.notes && (
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Notes & Observations</h4>
            <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {activity.notes}
            </p>
          </div>
        )}

        {activity.image && (
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Activity Photo</h4>
            <img src={activity.image} alt="Activity" className="w-full h-64 object-cover rounded-2xl border border-slate-200" />
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this activity record?"
      />
    </div>
  );
};
