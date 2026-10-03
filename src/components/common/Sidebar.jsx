import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Tractor,
  Sprout,
  PlusCircle,
  Clock,
  CalendarCheck,
  Receipt,
  PieChart,
  Bot,
  MessageSquare,
  Bell,
  User,
  Settings,
  Globe,
  HelpCircle,
  LogOut,
  Users,
  BarChart3
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { t } = useLanguage();
  const { role, logout } = useAuth();

  const farmerNavItems = [
    { label: t('dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { label: t('myFarms'), path: '/farms', icon: Tractor },
    { label: t('myCrops'), path: '/crops', icon: Sprout },
    { label: t('addActivity'), path: '/add-activity', icon: PlusCircle },
    { label: t('activities'), path: '/activity-history', icon: Clock },
    { label: t('reminders'), path: '/reminders', icon: CalendarCheck },
    { label: t('expenses'), path: '/expenses', icon: Receipt },
    { label: t('expenseReports'), path: '/expense-reports', icon: PieChart },
    { label: 'AI Khet Saathi', path: '/ai-assistant', icon: Bot, highlight: true },
    { label: t('aiHistory'), path: '/ai-history', icon: MessageSquare },
    { label: t('notifications'), path: '/notifications', icon: Bell },
    { label: t('profile'), path: '/profile', icon: User },
    { label: t('settings'), path: '/settings', icon: Settings },
    { label: t('language'), path: '/language', icon: Globe },
    { label: t('helpFaq'), path: '/help', icon: HelpCircle }
  ];

  const adminNavItems = [
    { label: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Farmers', path: '/admin/farmers', icon: Users },
    { label: 'Farms List', path: '/admin/farms', icon: Tractor },
    { label: 'Crops Overview', path: '/admin/crops', icon: Sprout },
    { label: 'All Activities', path: '/admin/activities', icon: Clock },
    { label: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
    { label: 'Admin Notifications', path: '/admin/notifications', icon: Bell }
  ];

  const items = role === 'admin' ? adminNavItems : farmerNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-30 h-screen w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-khet-600 text-white flex items-center justify-center font-bold">
              <Sprout className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-slate-800 text-base">Navigation</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="md:hidden text-slate-400 hover:text-slate-700 p-1"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                end={item.path === '/dashboard' || item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? item.highlight
                        ? 'bg-earth-500 text-white shadow-sm'
                        : 'bg-khet-600 text-white shadow-sm shadow-khet-600/20'
                      : item.highlight
                      ? 'bg-earth-50 text-earth-700 hover:bg-earth-100'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Logout Footer */}
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={() => {
              logout();
              onCloseMobile?.();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
