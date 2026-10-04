import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Lock, Check, Home } from 'lucide-react';
import logo1 from '../../images/logo1.png';
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
      showToast('Please fill all required fields', 'error');
      return;
    }
    const res = await register(formData);
    if (res.success) {
      showToast('Account created successfully! Welcome to Khet Sathi.', 'success');
      navigate('/dashboard', { replace: true });
    } else {
      showToast(res.message || 'Registration failed', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-emerald-700 font-semibold transition-colors">
            <Home className="w-4 h-4 text-emerald-600" /> Back to Landing Page
          </Link>
        </div>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 p-2 flex items-center justify-center shadow-xs mb-3">
            <img src={logo1} alt="Khet Sathi" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Register for Khet Sathi</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Join farmers managing crops with digital ease</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Full Name (नाव)</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Ramesh Patil"
              icon={User}
              required
              className="bg-white border-slate-300 text-slate-900 focus:border-emerald-600 focus:ring-emerald-600"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Mobile Number (मोबाइल)</label>
            <Input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="10 digit mobile number"
              icon={Phone}
              required
              className="bg-white border-slate-300 text-slate-900 focus:border-emerald-600 focus:ring-emerald-600"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Village / District (गाव / जिल्हा)</label>
            <Input
              name="village"
              value={formData.village}
              onChange={handleChange}
              placeholder="e.g. Satara Rural"
              icon={MapPin}
              className="bg-white border-slate-300 text-slate-900 focus:border-emerald-600 focus:ring-emerald-600"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Preferred Language (भाषा)</label>
            <Select
              name="language"
              value={formData.language}
              onChange={handleChange}
              options={[
                { value: 'en', label: 'English' },
                { value: 'hi', label: 'हिंदी (Hindi)' },
                { value: 'mr', label: 'मराठी (Marathi)' }
              ]}
              className="bg-white border-slate-300 text-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Create Password (पासवर्ड)</label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Set a password or 6 digit PIN"
              icon={Lock}
              required
              className="bg-white border-slate-300 text-slate-900 focus:border-emerald-600 focus:ring-emerald-600"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={loading}
            icon={Check}
            className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-none"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-600">
            Already have a Khet Sathi account?{' '}
            <Link to="/login" className="font-bold text-emerald-700 hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
