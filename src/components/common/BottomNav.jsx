import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Tractor, PlusCircle, Bot, CalendarCheck, MoreHorizontal } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export const BottomNav = () => {
  const { t } = useLanguage();
  const { role } = useAuth();

  if (role === 'admin') {
    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-2 flex items-center justify-around shadow-lg">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
              isActive ? 'text-purple-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-1">Overview</span>
        </NavLink>

        <NavLink
          to="/admin/farmers"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
              isActive ? 'text-purple-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          <Tractor className="w-5 h-5" />
          <span className="text-[10px] mt-1">Farmers</span>
        </NavLink>

        <NavLink
          to="/admin/reports"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
              isActive ? 'text-purple-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          <CalendarCheck className="w-5 h-5" />
          <span className="text-[10px] mt-1">Reports</span>
        </NavLink>
      </nav>
    );
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1 py-1.5 flex items-center justify-around shadow-lg">
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
            isActive ? 'text-khet-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`
        }
      >
        <LayoutDashboard className="w-5 h-5" />
        <span className="text-[11px] mt-0.5">{t('dashboard')}</span>
      </NavLink>

      <NavLink
        to="/farms"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
            isActive ? 'text-khet-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`
        }
      >
        <Tractor className="w-5 h-5" />
        <span className="text-[11px] mt-0.5">{t('myFarms')}</span>
      </NavLink>

      {/* Floating Add Activity Center Button */}
      <NavLink
        to="/add-activity"
        className="flex flex-col items-center -mt-5"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-khet-600 to-khet-500 text-white flex items-center justify-center shadow-lg shadow-khet-500/30 border-2 border-white active:scale-95 transition-transform">
          <PlusCircle className="w-7 h-7" />
        </div>
        <span className="text-[10px] font-bold text-khet-700 mt-0.5">{t('addActivity')}</span>
      </NavLink>

      <NavLink
        to="/ai-assistant"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
            isActive ? 'text-earth-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`
        }
      >
        <Bot className="w-5 h-5 text-earth-600" />
        <span className="text-[11px] mt-0.5 font-medium">AI Saathi</span>
      </NavLink>

      <NavLink
        to="/reminders"
        className={({ isActive }) =>
          `flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
            isActive ? 'text-khet-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`
        }
      >
        <CalendarCheck className="w-5 h-5" />
        <span className="text-[11px] mt-0.5">{t('reminders')}</span>
      </NavLink>
    </nav>
  );
};
