import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, ArrowLeft, Check } from 'lucide-react';
import { mockApi } from '../../api/mockApi';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../../components/common/Button';
import { Input, Select, TextArea } from '../../components/common/Input';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AddReminder = () => {
  const { t } = useLanguage();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [crops, setCrops] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    cropId: '',
    activityType: 'Spray',
    reminderDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const cList = await mockApi.getCrops();
        setCrops(cList);
        if (cList.length > 0) {
          setFormData(prev => ({ ...prev, cropId: cList[0].id }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.cropId || !formData.reminderDate) {
      showToast('Please fill required reminder fields', 'error');
      return;
    }

    const selectedCrop = crops.find(c => c.id === formData.cropId);
    const payload = {
      ...formData,
      cropName: selectedCrop ? selectedCrop.name : 'Crop',
      farmName: selectedCrop ? selectedCrop.farmName : 'Farm'
    };

    await mockApi.createReminder(payload);
    showToast('Reminder created successfully!', 'success');
    navigate('/reminders');
  };

  if (loading) return <LoadingSpinner message="Loading..." />;

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
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <CalendarCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{t('addReminder')}</h1>
            <p className="text-xs text-slate-500 font-medium">Set reminder for upcoming irrigation, spray, or harvest</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Reminder Title (शीर्षक)"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. 2nd Pesticide Spray / Top Dressing Fertilizer"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Select Crop"
              value={formData.cropId}
              onChange={(e) => setFormData({ ...formData, cropId: e.target.value })}
              options={crops.map(c => ({ value: c.id, label: `${c.name} (${c.farmName})` }))}
              required
            />

            <Select
              label="Activity Category"
              value={formData.activityType}
              onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
              options={['Sowing', 'Irrigation', 'Spray', 'Fertilizer', 'Pest/Disease', 'Weeding', 'Harvest', 'Other']}
            />
          </div>

          <Input
            label="Reminder Date (तारीख)"
            type="date"
            value={formData.reminderDate}
            onChange={(e) => setFormData({ ...formData, reminderDate: e.target.value })}
            required
          />

          <TextArea
            label="Notes / Preparation Instructions"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="e.g. Check leaf symptoms before spray, verify water pump..."
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => navigate(-1)}>
              {t('cancel')}
            </Button>
            <Button type="submit" variant="primary" icon={Check}>
              Save Reminder
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
