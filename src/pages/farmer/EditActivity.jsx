import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { mockApi } from '../../api/mockApi';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../../components/common/Button';
import { Input, Select, TextArea } from '../../components/common/Input';
import { ImageUploader } from '../../components/common/ImageUploader';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const EditActivity = () => {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useNotifications();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Spray',
    date: '',
    productName: '',
    quantity: '',
    unit: '',
    cost: '',
    income: '',
    notes: '',
    image: null
  });

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const item = await mockApi.getActivityById(activityId);
        if (item) {
          setFormData({
            type: item.type,
            date: item.date,
            productName: item.productName || '',
            quantity: item.quantity || '',
            unit: item.unit || '',
            cost: item.cost || '',
            income: item.income || '',
            notes: item.notes || '',
            image: item.image || null
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [activityId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await mockApi.updateActivity(activityId, formData);
      showToast('Activity record & linked expenses updated!', 'success');
      navigate(`/activities/${activityId}`);
    } catch (e) {
      showToast('Failed to update activity', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading record..." />;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-12">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-khet-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-6">Edit Activity</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Activity Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={['Sowing', 'Irrigation', 'Spray', 'Fertilizer', 'Pest/Disease', 'Weeding', 'Harvest', 'Other']}
              required
            />
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Product / Item"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            />
            <Input
              label="Quantity"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            />
            <Input
              label="Unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            />
          </div>

          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Activity Cost / Expense (₹)"
              type="number"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              placeholder="e.g. 1800"
            />
            {formData.type === 'Harvest' && (
              <Input
                label="Harvest Sale / Income Gained (₹)"
                type="number"
                value={formData.income}
                onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                placeholder="e.g. 48000"
              />
            )}
          </div>

          <TextArea
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />

          <ImageUploader
            label="Photo"
            value={formData.image}
            onChange={(img) => setFormData({ ...formData, image: img })}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving} icon={Check}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
