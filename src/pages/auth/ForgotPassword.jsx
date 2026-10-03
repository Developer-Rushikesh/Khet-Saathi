import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Phone, KeyRound, ArrowRight } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useNotifications } from '../../context/NotificationContext';

export const ForgotPassword = () => {
  const [mobile, setMobile] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mobile) {
      showToast('Please enter registered mobile number', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Reset OTP sent to your registered mobile!', 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-khet-50 to-white flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-8 animate-fade-in">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">Reset Password</h1>
          <p className="text-xs text-slate-500 font-medium">Get OTP to reset your farming account PIN</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Registered Mobile Number"
              type="tel"
              name="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="10 digit mobile"
              icon={Phone}
              required
            />
            <Button type="submit" variant="primary" size="lg" fullWidth icon={ArrowRight}>
              Send Verification Code
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-sm border border-emerald-200">
              OTP sent to <strong>+91 {mobile}</strong>. Enter code <strong>1234</strong> to reset password.
            </div>
            <Button variant="primary" fullWidth onClick={() => navigate('/login')}>
              Back to Login
            </Button>
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
          Remember password?{' '}
          <Link to="/login" className="font-bold text-khet-700 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};
