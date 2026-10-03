import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, User, Phone, MapPin, Lock, Check } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    village: '',
    district: 'Satara',
    password: '',
    language: 'en'
  });
  const { register, loading } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.password) {
      showToast('Please fill required fields', 'error');
      return;
    }
    await register(formData);
    showToast('Farmer profile created successfully!', 'success');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-khet-50 to-white flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-8 animate-fade-in">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-khet-600 to-khet-500 text-white flex items-center justify-center shadow-lg shadow-khet-600/20 mb-2">
            <Sprout className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">New Farmer Registration</h1>
          <p className="text-xs text-slate-500 font-medium">Join AI Khet Saathi digital farming network</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <Input
            label="Full Name (नाव)"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Ramesh Patil"
            icon={User}
            required
          />

          <Input
            label="Mobile Number (मोबाइल नंबर)"
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="10 digit mobile"
            icon={Phone}
            required
          />

          <Input
            label="Village / Location (गाव)"
            name="village"
            value={formData.village}
            onChange={handleChange}
            placeholder="e.g. Satara Rural"
            icon={MapPin}
          />

          <Select
            label="Preferred Language (भाषा)"
            name="language"
            value={formData.language}
            onChange={handleChange}
            options={[
              { value: 'en', label: 'English' },
              { value: 'hi', label: 'हिंदी (Hindi)' },
              { value: 'mr', label: 'मराठी (Marathi)' }
            ]}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Set 6 digit PIN or password"
            icon={Lock}
            required
          />

          <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading} icon={Check} className="mt-4">
            Create Account & Start
          </Button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center text-sm text-slate-600">
          Already registered?{' '}
          <Link to="/login" className="font-extrabold text-khet-700 hover:underline">
            Login Here
          </Link>
        </div>
      </div>
    </div>
  );
};
