import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Bell, Globe, User, Shield, Menu, X, Bot } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from './Button';

export const Navbar = ({ onOpenMobileMenu }) => {
  const { user, role, toggleRole } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [showLangMenu, setShowLangMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link to={role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-khet-600 to-khet-500 text-white flex items-center justify-center shadow-md shadow-khet-500/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-extrabold text-slate-900 leading-tight block tracking-tight">
                AI Khet Saathi
              </span>
              <span className="text-[10px] font-semibold text-khet-600 tracking-wider uppercase block">
                {role === 'admin' ? '• Admin Portal' : '• Farmer Assistant'}
              </span>
            </div>
          </Link>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Role Switcher Badge */}
          <button
            onClick={toggleRole}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
              role === 'admin'
                ? 'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200'
                : 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
            }`}
            title="Toggle between Farmer and Admin interface"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{role === 'admin' ? t('admin') : t('farmer')} Mode</span>
          </button>

          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
            >
              <Globe className="w-4 h-4 text-khet-600" />
              <span className="uppercase">{lang}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 animate-fade-in">
                <button
                  onClick={() => { setLang('en'); setShowLangMenu(false); }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-medium ${lang === 'en' ? 'bg-khet-50 text-khet-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  English
                </button>
                <button
                  onClick={() => { setLang('hi'); setShowLangMenu(false); }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-medium ${lang === 'hi' ? 'bg-khet-50 text-khet-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  हिंदी (Hindi)
                </button>
                <button
                  onClick={() => { setLang('mr'); setShowLangMenu(false); }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-medium ${lang === 'mr' ? 'bg-khet-50 text-khet-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  मराठी (Marathi)
                </button>
              </div>
            )}
          </div>

          {/* Notifications */}
          <Link
            to="/notifications"
            className="relative p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[11px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </Link>

          {/* AI Assistant Quick Nav */}
          <Link
            to="/ai-assistant"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-earth-500 to-earth-600 text-white text-xs font-bold shadow-sm hover:opacity-95 transition-opacity"
          >
            <Bot className="w-4 h-4" />
            <span>AI Saathi</span>
          </Link>

          {/* Profile */}
          <Link to="/profile" className="flex items-center gap-2 pl-1">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80'}
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover border-2 border-khet-500"
            />
          </Link>
        </div>
      </div>
    </header>
  );
};
