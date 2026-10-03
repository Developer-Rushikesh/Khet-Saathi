import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, Plus, Calendar, Edit, Trash2, Tractor } from 'lucide-react';
import { mockApi } from '../../api/mockApi';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Modal } from '../../components/common/Modal';
import { Input, Select, TextArea } from '../../components/common/Input';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';

export const MyCrops = () => {
  const { t } = useLanguage();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [deletingCropId, setDeletingCropId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    farmId: '',
    variety: '',
    season: 'Kharif 2026',
    area: '',
    sowingDate: new Date().toISOString().split('T')[0],
    expectedHarvestDate: '',
    notes: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [cData, fData] = await Promise.all([mockApi.getCrops(), mockApi.getFarms()]);
      setCrops(cData);
      setFarms(fData);
      if (fData.length > 0 && !formData.farmId) {
        setFormData(prev => ({ ...prev, farmId: fData[0].id }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingCrop(null);
    setFormData({
      name: '',
      farmId: farms[0]?.id || '',
      variety: '',
      season: 'Kharif 2026',
      area: '',
      sowingDate: new Date().toISOString().split('T')[0],
      expectedHarvestDate: '',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.farmId) {
      showToast('Please specify crop name and farm', 'error');
      return;
    }

    const selectedFarm = farms.find(f => f.id === formData.farmId);
    const payload = {
      ...formData,
      farmName: selectedFarm ? selectedFarm.name : 'Main Farm'
    };

    if (editingCrop) {
      await mockApi.updateCrop(editingCrop.id, payload);
      showToast('Crop record updated!', 'success');
    } else {
      await mockApi.createCrop(payload);
      showToast('New crop added to your farm!', 'success');
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = async () => {
    if (deletingCropId) {
      await mockApi.deleteCrop(deletingCropId);
      showToast('Crop record deleted', 'info');
      setDeletingCropId(null);
      loadData();
    }
  };

  if (loading) return <LoadingSpinner message="Fetching crop records..." />;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{t('myCrops')}</h1>
          <p className="text-sm text-slate-500 font-medium">Manage active crop varieties, seasons, and harvest dates</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
          {t('addCrop')}
        </Button>
      </div>

      {/* Crops List Grid */}
      {crops.length === 0 ? (
        <EmptyState title="No crops registered" actionText={t('addCrop')} onAction={handleOpenAdd} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {crops.map((crop) => (
            <Card key={crop.id} hoverable onClick={() => navigate(`/crops/${crop.id}`)}>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-khet-100 text-khet-800">
                    {crop.season}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">🌾 {crop.name}</h3>
                  <p className="text-xs text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                    <Tractor className="w-3.5 h-3.5 text-slate-400" />
                    {crop.farmName}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletingCropId(crop.id);
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('variety')}:</span>
                  <span className="font-bold text-slate-800">{crop.variety || 'Standard'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('sowingDate')}:</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-khet-600" />
                    {crop.sowingDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('expectedHarvest')}:</span>
                  <span className="font-bold text-amber-700">{crop.expectedHarvestDate || 'TBD'}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Crop Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCrop ? 'Edit Crop' : t('addCrop')}>
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Crop Name (पीकाचे नाव)"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Soybean / Cotton / Sugarcane"
            required
          />

          <Select
            label="Select Farm (शेत निवडा)"
            value={formData.farmId}
            onChange={(e) => setFormData({ ...formData, farmId: e.target.value })}
            options={farms.map(f => ({ value: f.id, label: `${f.name} (${f.village})` }))}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Variety (वाण)"
              value={formData.variety}
              onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
              placeholder="e.g. JS 335 / Co 86032"
            />
            <Select
              label="Season (हंगाम)"
              value={formData.season}
              onChange={(e) => setFormData({ ...formData, season: e.target.value })}
              options={['Kharif 2026', 'Rabi 2026-27', 'Zaid/Summer 2026', 'Annual 2026']}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label={t('sowingDate')}
              type="date"
              value={formData.sowingDate}
              onChange={(e) => setFormData({ ...formData, sowingDate: e.target.value })}
              required
            />
            <Input
              label={t('expectedHarvest')}
              type="date"
              value={formData.expectedHarvestDate}
              onChange={(e) => setFormData({ ...formData, expectedHarvestDate: e.target.value })}
            />
          </div>

          <TextArea
            label="Notes / Seed treatment details"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="e.g. Rhizobium treated, spacing 4ft..."
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              {t('cancel')}
            </Button>
            <Button type="submit" variant="primary">
              {t('save')}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deletingCropId}
        onClose={() => setDeletingCropId(null)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this crop record?"
      />
    </div>
  );
};
