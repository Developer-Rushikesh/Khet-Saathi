import React from 'react';
import { Clock } from 'lucide-react';
import { Card } from '../../components/common/Card';

export const AdminActivities = () => {
  const activityLogs = [
    { id: 'a-1', farmer: 'Ramesh Patil', crop: 'Soybean', type: 'Spray', product: 'Emamectin Benzoate', date: '2026-06-25' },
    { id: 'a-2', farmer: 'Suresh More', crop: 'Sugarcane', type: 'Irrigation', product: 'Drip Pump', date: '2026-06-24' },
    { id: 'a-3', farmer: 'Anand Deshmukh', crop: 'Cotton', type: 'Fertilizer', product: 'Urea 50kg', date: '2026-06-23' },
    { id: 'a-4', farmer: 'Balasaheb Kadam', crop: 'Soybean', type: 'Sowing', product: 'JS 335 Seed', date: '2026-06-15' }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Admin Farm Activity Monitor</h1>
        <p className="text-sm text-slate-500 font-medium">Real-time log of farming activities submitted by farmers</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase">
                <th className="pb-3">Date</th>
                <th className="pb-3">Farmer</th>
                <th className="pb-3">Crop</th>
                <th className="pb-3">Activity Type</th>
                <th className="pb-3 text-right">Product / Item</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {activityLogs.map((log) => (
                <tr key={log.id}>
                  <td className="py-3 font-semibold text-slate-500">{log.date}</td>
                  <td className="py-3 font-bold text-slate-900">{log.farmer}</td>
                  <td className="py-3">🌾 {log.crop}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-md bg-khet-100 text-khet-800 font-bold">
                      {log.type}
                    </span>
                  </td>
                  <td className="py-3 text-right text-slate-800 font-semibold">{log.product}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
