import React, { useState } from 'react';
import { User, Phone, MapPin, Calendar, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';

export const Profile = () => {
  const { user, register } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useNotifications();

  const [formData, setFormData] = useState({
    name: user?.name || 'Ramesh Patil',
    mobile: user?.mobile || '+91 98765 43210',
    village: user?.village || 'Satara Rural',
    district: user?.district || 'Satara',
    state: user?.state || 'Maharashtra'
  });

  const handleSave = async (e) => {
    e.preventDefault();
    await register(formData);
    showToast('Profile details updated!', 'success');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">{t('profile')}</h1>
        <p className="text-sm text-slate-500 font-medium">Farmer digital identity and location details</p>
      </div>

      <Card className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-5 mb-6 pb-6 border-b border-slate-100">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80'}
            alt="Farmer Avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-khet-500 shadow-md"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-extrabold text-slate-900">{user?.name || 'Ramesh Patil'}</h2>
            <p className="text-xs font-bold text-khet-700 mt-0.5">Verified Digital Farmer • Satara</p>
            <span className="text-xs text-slate-400 mt-1 block">Member since April 2025</span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            icon={User}
            required
          />

          <Input
            label="Mobile Number"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            icon={Phone}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Village"
              value={formData.village}
              onChange={(e) => setFormData({ ...formData, village: e.target.value })}
              icon={MapPin}
            />
            <Input
              label="District"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" variant="primary" icon={Check}>
              Save Profile
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
