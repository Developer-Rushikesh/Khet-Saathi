import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Phone, Lock, ArrowRight, UserCheck, ShieldCheck, Home } from 'lucide-react';
import logo1 from '../../images/logo1.png';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export const Login = () => {
  const [mobileOrEmail, setMobileOrEmail] = useState('ramesh@example.com');
  const [password, setPassword] = useState('password123');
  const { login, loading } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const fromPath = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mobileOrEmail || !password) {
      showToast('Please enter your mobile or email and password', 'error');
      return;
    }

    const res = await login(mobileOrEmail, password);
    if (res.success) {
      showToast(`Welcome back, ${res.user?.name || 'Farmer'}!`, 'success');
      if (fromPath) {
        navigate(fromPath, { replace: true });
      } else if (res.user?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } else {
      showToast(res.message || 'Invalid login credentials', 'error');
    }
  };

  const fillFarmerDemo = () => {
    setMobileOrEmail('ramesh@example.com');
    setPassword('password123');
  };

  const fillAdminDemo = () => {
    setMobileOrEmail('admin@example.com');
    setPassword('adminpassword123');
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

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 p-2 flex items-center justify-center shadow-xs mb-3">
            <img src={logo1} alt="Khet Sathi" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Khet Sathi Log In</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Simple & Secure Digital Farm Record Book</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Mobile Number or Email (मोबाइल / ईमेल)
            </label>
            <Input
              type="text"
              name="mobileOrEmail"
              value={mobileOrEmail}
              onChange={(e) => setMobileOrEmail(e.target.value)}
              placeholder="e.g. ramesh@example.com or 9876543210"
              icon={Phone}
              required
              className="bg-white border-slate-300 text-slate-900 focus:border-emerald-600 focus:ring-emerald-600"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Password (पासवर्ड)
            </label>
            <Input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              icon={Lock}
              required
              className="bg-white border-slate-300 text-slate-900 focus:border-emerald-600 focus:ring-emerald-600"
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500 font-medium">Quick Demo Credentials:</span>
            <Link to="/forgot-password" className="text-emerald-700 font-bold hover:underline">
              Forgot Password?
            </Link>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={fillFarmerDemo}
              className="flex items-center justify-center gap-1.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-bold transition-colors"
            >
              <UserCheck className="w-4 h-4 text-emerald-600" /> Farmer Demo
            </button>
            <button
              type="button"
              onClick={fillAdminDemo}
              className="flex items-center justify-center gap-1.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl font-bold transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-slate-700" /> Admin Demo
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={loading}
            icon={ArrowRight}
            className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-none"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-600">
            Don't have a Khet Sathi account?{' '}
            <Link to="/register" className="font-bold text-emerald-700 hover:underline">
              Register Free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
