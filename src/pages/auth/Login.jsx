import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Lock, ArrowRight } from 'lucide-react';
import logo1 from '../../images/logo1.png';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';

export const Login = () => {
  const [mobile, setMobile] = useState('9876543210');
  const [password, setPassword] = useState('123456');
  const { login, loading } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mobile || !password) {
      showToast('Please fill all fields', 'error');
      return;
    }
    const res = await login(mobile, password);
    if (res.success) {
      showToast(`Welcome back, Ramesh Patil!`, 'success');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-khet-50 to-white flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-8 animate-fade-in">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 p-2 flex items-center justify-center shadow-lg shadow-khet-600/10 mb-3 overflow-hidden">
            <img src={logo1} alt="AI Khet Saathi" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Khet Saathi</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">{t('subtitle')}</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Mobile Number (मोबाइल नंबर)"
            type="tel"
            name="mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="10 digit mobile number"
            icon={Phone}
            required
          />

          <Input
            label="Password (पासवर्ड)"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            icon={Lock}
            required
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500">Demo Farmer Account</span>
            <Link to="/forgot-password" className="text-khet-700 font-bold hover:underline">
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={loading}
            icon={ArrowRight}
            className="mt-2"
          >
            Login to Farm
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600">
            New to Khet Saathi?{' '}
            <Link to="/register" className="font-extrabold text-khet-700 hover:underline">
              Register New Farmer
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
