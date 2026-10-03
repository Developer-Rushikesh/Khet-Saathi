import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PlusCircle, Calendar, Camera, Bell, Check, ArrowLeft, DollarSign, TrendingUp } from 'lucide-react';
import { mockApi } from '../../api/mockApi';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../../components/common/Button';
import { Input, Select, TextArea, Toggle } from '../../components/common/Input';
import { ImageUploader } from '../../components/common/ImageUploader';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AddActivity = () => {
  const { t } = useLanguage();
  const { showToast } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const prefilled = location.state || {};

  const [loading, setLoading] = useState(true);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    farmId: prefilled.farmId || '',
    cropId: prefilled.cropId || '',
    type: prefilled.type || 'Spray',
    date: prefilled.date || new Date().toISOString().split('T')[0],
    productName: prefilled.productName || '',
    quantity: prefilled.quantity || '',
    unit: prefilled.unit || 'liter',
    personCount: prefilled.personCount || '',
    costPerPerson: prefilled.costPerPerson || '',
    materialCost: prefilled.materialCost || '',
    cost: prefilled.cost || '',
    income: prefilled.income || '',
    sprayReason: prefilled.sprayReason || '',
    notes: prefilled.notes || '',
    image: prefilled.image || null,
    createReminder: false,
    reminderDate: ''
  });

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        const [fList, cList] = await Promise.all([mockApi.getFarms(), mockApi.getCrops()]);
        setFarms(fList);
        setCrops(cList);

        if (fList.length > 0 && !formData.farmId) {
          const defaultFarmId = fList[0].id;
          setFormData(prev => ({
            ...prev,
            farmId: defaultFarmId,
            cropId: cList.find(c => c.farmId === defaultFarmId)?.id || cList[0]?.id || ''
          }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  const handleFarmChange = (e) => {
    const selectedFarmId = e.target.value;
    const availableCrops = crops.filter(c => c.farmId === selectedFarmId);
    setFormData({
      ...formData,
      farmId: selectedFarmId,
      cropId: availableCrops[0]?.id || ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.farmId || !formData.cropId || !formData.type || !formData.date) {
      showToast('Please fill all required activity fields', 'error');
      return;
    }

    setSaving(true);
    try {
      const selectedFarm = farms.find(f => f.id === formData.farmId);
      const selectedCrop = crops.find(c => c.id === formData.cropId);

      const payload = {
        ...formData,
        farmName: selectedFarm ? selectedFarm.name : 'Farm',
        cropName: selectedCrop ? selectedCrop.name : 'Crop'
      };

      await mockApi.createActivity(payload);
      showToast(
        payload.cost > 0
          ? `Activity & ₹${payload.cost} crop expense saved successfully!`
          : 'Farming activity recorded successfully!',
        'success'
      );
      navigate('/activity-history');
    } catch (e) {
      showToast('Failed to save activity', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Preparing activity form..." />;

  const availableCropsForFarm = crops.filter(c => c.farmId === formData.farmId);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Top Bar */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-khet-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-khet-100 text-khet-700 flex items-center justify-center font-bold">
            <PlusCircle className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{t('addActivity')}</h1>
            <p className="text-xs text-slate-500 font-medium">Record spray, irrigation, fertilizer, harvest & expense costs</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Farm & Crop Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Select Farm (शेत)"
              value={formData.farmId}
              onChange={handleFarmChange}
              options={farms.map(f => ({ value: f.id, label: `${f.name} (${f.village})` }))}
              required
            />

            <Select
              label="Select Crop (पीक)"
              value={formData.cropId}
              onChange={(e) => setFormData({ ...formData, cropId: e.target.value })}
              options={availableCropsForFarm.map(c => ({ value: c.id, label: `${c.name} (${c.season})` }))}
              required
            />
          </div>

          {/* Activity Type & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Activity Type (कामाचा प्रकार)"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={[
                'Sowing',
                'Irrigation',
                'Spray',
                'Fertilizer',
                'Pest/Disease',
                'Weeding',
                'Harvest',
                'Other'
              ]}
              required
            />

            <Input
              label="Date of Activity (तारीख)"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          {/* Spray Specific Fields */}
          {formData.type === 'Spray' && (
            <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-2xl space-y-3">
              <span className="text-xs font-extrabold text-purple-800 uppercase tracking-wide block">
                🧪 Spray Details
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Product Name (दवा/औषध)"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  placeholder="e.g. Emamectin Benzoate"
                />
                <Input
                  label="Quantity (मात्रा)"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="e.g. 100"
                />
                <Select
                  label="Unit (इकाई)"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  options={['gm', 'ml', 'liter', 'kg', 'doses']}
                />
              </div>
              <Input
                label="Reason / Target Pest"
                value={formData.sprayReason}
                onChange={(e) => setFormData({ ...formData, sprayReason: e.target.value })}
                placeholder="e.g. Preventive for caterpillar / pod borer"
              />
            </div>
          )}

          {/* Other Activity Fields */}
          {formData.type !== 'Spray' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Item / Product Used"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                placeholder="e.g. NPK 10:26:26 / Drip Pump"
              />
              <Input
                label="Quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="e.g. 50"
              />
              <Select
                label="Unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                options={['kg', 'liter', 'hours', 'bags', 'workers', 'units', 'quintal']}
              />
            </div>
          )}

          {/* Worker / Person Cost Tracking Section */}
          <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-2xl space-y-3">
            <span className="text-xs font-extrabold text-sky-900 uppercase tracking-wide flex items-center justify-between">
              <span>👥 Workers / Laborers (व्यक्ती संख्या व दर)</span>
              {(parseFloat(formData.personCount) > 0 && parseFloat(formData.costPerPerson) > 0) && (
                <span className="px-2.5 py-0.5 rounded-full bg-sky-600 text-white font-bold text-xs">
                  Labor Total: ₹{(parseFloat(formData.personCount) * parseFloat(formData.costPerPerson)).toLocaleString()}
                </span>
              )}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Number of Persons / Laborers (व्यक्ती संख्या)"
                type="number"
                min="0"
                value={formData.personCount}
                onChange={(e) => setFormData({ ...formData, personCount: e.target.value })}
                placeholder="e.g. 5 workers"
                helperText="How many persons worked on this activity?"
              />

              <Input
                label="Cost per Person (₹) (दर व्यक्ती मजुरी/खर्च)"
                type="number"
                min="0"
                value={formData.costPerPerson}
                onChange={(e) => setFormData({ ...formData, costPerPerson: e.target.value })}
                placeholder="e.g. 350 per day"
                helperText="Daily wage or cost per person"
              />
            </div>
          </div>

          {/* Activity Cost & Harvest Gain Section */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-3">
            <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wide flex items-center justify-between">
              <span>💰 Product & Total Financials</span>
              {((parseFloat(formData.materialCost) || 0) + (parseFloat(formData.personCount || 0) * parseFloat(formData.costPerPerson || 0)) > 0) && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-700 text-white font-bold text-xs">
                  Total Expense: ₹{((parseFloat(formData.materialCost) || 0) + (parseFloat(formData.personCount || 0) * parseFloat(formData.costPerPerson || 0))).toLocaleString()}
                </span>
              )}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Product / Material Cost (₹) (सामग्री खर्च)"
                type="number"
                min="0"
                value={formData.materialCost}
                onChange={(e) => setFormData({ ...formData, materialCost: e.target.value })}
                placeholder="e.g. 1800 (Seeds, pesticides, diesel)"
                helperText="Direct material or machinery cost (excluding labor)"
              />

              {formData.type === 'Harvest' ? (
                <Input
                  label="Harvest Sale / Revenue Gained (₹) (उत्पन्न)"
                  type="number"
                  min="0"
                  value={formData.income}
                  onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                  placeholder="e.g. 48000"
                  helperText="Amount gained from crop harvest sale"
                />
              ) : (
                <Input
                  label="Direct Total Cost (₹) (or Auto Calculated)"
                  type="number"
                  min="0"
                  value={formData.cost || ((parseFloat(formData.materialCost) || 0) + (parseFloat(formData.personCount || 0) * parseFloat(formData.costPerPerson || 0)) || '')}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  placeholder="Auto calculated from Labor + Material"
                  helperText="Total activity expense auto-added to Crop Expenses"
                />
              )}
            </div>
          </div>

          <TextArea
            label="Notes / Field Observations"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="e.g. Applied post weeding, light soil dampness observed..."
          />

          <ImageUploader
            label="Optional Activity Photo / Field Photo"
            value={formData.image}
            onChange={(img) => setFormData({ ...formData, image: img })}
            enableMockOcr
          />

          {/* Create Follow Up Reminder */}
          <div className="pt-2">
            <Toggle
              label="Set Follow-up Reminder"
              description="Automatically create a reminder notification for this crop"
              checked={formData.createReminder}
              onChange={(val) => setFormData({ ...formData, createReminder: val })}
            />

            {formData.createReminder && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl animate-fade-in">
                <Input
                  label="Reminder Target Date"
                  type="date"
                  value={formData.reminderDate}
                  onChange={(e) => setFormData({ ...formData, reminderDate: e.target.value })}
                  required={formData.createReminder}
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => navigate(-1)}>
              {t('cancel')}
            </Button>
            <Button type="submit" variant="primary" size="lg" disabled={saving} icon={Check}>
              Save Activity
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
