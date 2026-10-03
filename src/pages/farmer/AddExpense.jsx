import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt, ArrowLeft, Check } from 'lucide-react';
import { mockApi } from '../../api/mockApi';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../../components/common/Button';
import { Input, Select, TextArea } from '../../components/common/Input';
import { ImageUploader } from '../../components/common/ImageUploader';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AddExpense = () => {
  const { t } = useLanguage();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [crops, setCrops] = useState([]);
  const [formData, setFormData] = useState({
    cropId: '',
    category: 'Fertilizer',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    receiptImage: null
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

  const handleOcrExtracted = (ocrData) => {
    setFormData(prev => ({
      ...prev,
      description: ocrData.detectedProduct ? `Receipt: ${ocrData.detectedProduct}` : prev.description,
      amount: ocrData.detectedAmount ? ocrData.detectedAmount.replace(/[^0-9]/g, '') : prev.amount
    }));
    showToast('Auto-filled amount and item from receipt scan!', 'success');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.cropId || !formData.amount) {
      showToast('Please specify crop and amount', 'error');
      return;
    }

    const selectedCrop = crops.find(c => c.id === formData.cropId);
    const payload = {
      ...formData,
      cropName: selectedCrop ? selectedCrop.name : 'Crop'
    };

    await mockApi.createExpense(payload);
    showToast('Expense recorded successfully!', 'success');
    navigate('/expenses');
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
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Receipt className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{t('addExpense')}</h1>
            <p className="text-xs text-slate-500 font-medium">Record seed purchase, fertilizer, spray or labour costs</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Select Crop"
              value={formData.cropId}
              onChange={(e) => setFormData({ ...formData, cropId: e.target.value })}
              options={crops.map(c => ({ value: c.id, label: `${c.name} (${c.farmName})` }))}
              required
            />

            <Select
              label="Expense Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                'Seeds',
                'Fertilizer',
                'Spray',
                'Labour',
                'Irrigation',
                'Equipment',
                'Transport',
                'Other'
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Amount (राशि ₹)"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="e.g. 2500"
              required
            />

            <Input
              label="Date of Expense"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <TextArea
            label="Description / Invoice details"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="e.g. JS 335 seed bag purchase from Krishi Seva Kendra..."
          />

          <ImageUploader
            label="Upload Receipt / Bill Photo"
            value={formData.receiptImage}
            onChange={(img) => setFormData({ ...formData, receiptImage: img })}
            enableMockOcr
            onOcrResult={handleOcrExtracted}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => navigate(-1)}>
              {t('cancel')}
            </Button>
            <Button type="submit" variant="primary" icon={Check}>
              Save Expense
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
