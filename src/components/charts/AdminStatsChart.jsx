import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export const AdminStatsChart = ({ topCrops = [] }) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
      <h4 className="text-sm font-bold text-slate-800 mb-3">Crop Distribution Across Farmers (%)</h4>
      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topCrops} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(val) => `${val}%`} />
            <Bar dataKey="percentage" fill="#9333ea" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
