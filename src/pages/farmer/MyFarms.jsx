import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tractor, Plus, MapPin, Edit, Trash2, Sprout } from 'lucide-react';
import { mockApi } from '../../api/mockApi';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Modal } from '../../components/common/Modal';
import { Input, Select, TextArea } from '../../components/common/Input';
import { ImageUploader } from '../../components/common/ImageUploader';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';

export const MyFarms = () => {
  const { t } = useLanguage();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [deletingFarmId, setDeletingFarmId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    village: '',
    area: '',
    unit: 'acre',
    notes: '',
    image: null
  });

  const loadFarms = async () => {
    setLoading(true);
    try {
      const [fData, cData] = await Promise.all([mockApi.getFarms(), mockApi.getCrops()]);
      setFarms(fData);
      setCrops(cData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarms();
  }, []);

  const handleOpenAdd = () => {
    setEditingFarm(null);
    setFormData({ name: '', village: '', area: '', unit: 'acre', notes: '', image: null });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (e, farm) => {
    e.stopPropagation();
    setEditingFarm(farm);
    setFormData({
      name: farm.name,
      village: farm.village,
      area: farm.area,
      unit: farm.unit,
      notes: farm.notes || '',
      image: farm.image || null
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.area) {
      showToast('Please provide farm name and area', 'error');
      return;
    }

    if (editingFarm) {
      await mockApi.updateFarm(editingFarm.id, formData);
      showToast('Farm updated successfully!', 'success');
    } else {
      await mockApi.createFarm(formData);
      showToast('New farm registered successfully!', 'success');
    }

    setIsModalOpen(false);
    loadFarms();
  };

  const handleDeleteConfirm = async () => {
    if (deletingFarmId) {
      await mockApi.deleteFarm(deletingFarmId);
      showToast('Farm deleted', 'info');
      setDeletingFarmId(null);
      loadFarms();
    }
  };

  if (loading) return <LoadingSpinner message="Fetching your farms..." />;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{t('myFarms')}</h1>
          <p className="text-sm text-slate-500 font-medium">Manage multiple farms, field locations, and land area</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
          {t('addFarm')}
        </Button>
      </div>

      {/* Farms List */}
      {farms.length === 0 ? (
        <EmptyState title="No farms registered yet" actionText={t('addFarm')} onAction={handleOpenAdd} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {farms.map((farm) => {
            const activeCropsOnFarm = crops.filter(c => c.farmId === farm.id);
            return (
              <Card key={farm.id} hoverable onClick={() => navigate(`/farms/${farm.id}`)}>
                {farm.image && (
                  <img src={farm.image} alt={farm.name} className="w-full h-44 object-cover rounded-xl mb-4" />
                )}

                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{farm.name}</h3>
                    <p className="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-khet-600" />
                      {farm.village}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleOpenEdit(e, farm)}
                      className="p-2 text-slate-400 hover:text-khet-700 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingFarmId(farm.id);
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block">{t('area')}</span>
                    <span className="font-extrabold text-slate-800 text-sm">{farm.area} {farm.unit}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{t('activeCrops')}</span>
                    <span className="font-extrabold text-khet-700 text-sm flex items-center gap-1">
                      <Sprout className="w-4 h-4" />
                      {activeCropsOnFarm.length} Crops
                    </span>
                  </div>
                </div>

                {farm.notes && (
                  <p className="text-xs text-slate-500 mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 line-clamp-2">
                    {farm.notes}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Add / Edit Farm Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFarm ? t('editFarm') : t('addFarm')}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Farm Name (शेताचे नाव)"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Main Farm / Wadi Land"
            required
          />

          <Input
            label="Village / Location (गाव/ठिकाण)"
            value={formData.village}
            onChange={(e) => setFormData({ ...formData, village: e.target.value })}
            placeholder="e.g. Satara Rural"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Area (क्षेत्रफळ)"
              type="number"
              step="0.1"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              placeholder="e.g. 2.0"
              required
            />

            <Select
              label="Unit (इकाई)"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              options={[
                { value: 'acre', label: 'Acres (एकरा)' },
                { value: 'hectare', label: 'Hectares (हेक्टर)' }
              ]}
            />
          </div>

          <TextArea
            label="Optional Notes / Water source"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="e.g. Drip irrigation, well access, soil condition..."
          />

          <ImageUploader
            label="Optional Farm Photo"
            value={formData.image}
            onChange={(img) => setFormData({ ...formData, image: img })}
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingFarmId}
        onClose={() => setDeletingFarmId(null)}
        onConfirm={handleDeleteConfirm}
        message="Are you sure you want to delete this farm? All associated crop links will be updated."
      />
    </div>
  );
};
