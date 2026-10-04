import React, { useState, useEffect } from 'react';
import { Shield, Users, Tractor, Sprout, Clock, Bell, ArrowRight } from 'lucide-react';
import { mockApi } from '../../api/mockApi';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Card } from '../../components/common/Card';
import { AdminStatsChart } from '../../components/charts/AdminStatsChart';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await mockApi.getAdminStats();
        setStats(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <LoadingSpinner message="Loading admin oversight data..." />;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Admin Hero Header */}
      <div className="bg-gradient-to-r from-purple-800 to-purple-700 rounded-3xl p-6 text-white shadow-lg shadow-purple-900/15">
        <div className="flex items-center gap-2 text-purple-200 text-xs font-bold uppercase tracking-wider mb-1">
          <Shield className="w-4 h-4" />
          <span>Khet Sathi • Admin Command Center</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold">System Oversight Dashboard</h1>
        <p className="text-xs text-purple-100 mt-1 font-medium">
          Monitoring 1,420 registered farmers across Satara, Sangli, Kolhapur & Pune districts.
        </p>
      </div>

      {/* Metrics overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {[
          { label: 'Total Farmers', value: stats.totalFarmers, icon: Users, color: 'bg-purple-100 text-purple-800' },
          { label: 'Total Farms', value: stats.totalFarms, icon: Tractor, color: 'bg-emerald-100 text-emerald-800' },
          { label: 'Active Crops', value: stats.totalCrops, icon: Sprout, color: 'bg-khet-100 text-khet-800' },
          { label: 'Activities Recorded', value: stats.totalActivities, icon: Clock, color: 'bg-sky-100 text-sky-800' },
          { label: 'Reminders Set', value: stats.totalReminders, icon: Bell, color: 'bg-amber-100 text-amber-800' },
          { label: 'Active Today', value: stats.activeUsersToday, icon: Shield, color: 'bg-rose-100 text-rose-800' }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card key={idx} className="p-3.5">
              <div className="w-8 h-8 rounded-lg ${item.color} flex items-center justify-center font-bold mb-2">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[11px] text-slate-500 font-semibold block">{item.label}</span>
              <span className="text-lg font-extrabold text-slate-900">{item.value.toLocaleString()}</span>
            </Card>
          );
        })}
      </div>

      {/* Chart & Recent Farmers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminStatsChart topCrops={stats.topCrops} />

        {/* Recent Registered Farmers */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-slate-800">Recently Registered Farmers</h4>
            <Link to="/admin/farmers" className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {stats.recentFarmers.map((f) => (
              <div key={f.id} className="py-3 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-slate-900">{f.name}</h5>
                  <p className="text-slate-400 font-medium">{f.district} District • {f.farmsCount} Registered Farms</p>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold">
                  {f.joined}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
