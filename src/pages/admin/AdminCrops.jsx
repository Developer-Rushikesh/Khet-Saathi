import React from 'react';
import { Sprout } from 'lucide-react';
import { Card } from '../../components/common/Card';

export const AdminCrops = () => {
  const crops = [
    { id: 'c-1', name: 'Soybean', variety: 'JS 335', season: 'Kharif 2026', totalFarmers: 580, avgArea: '2.2 Acres' },
    { id: 'c-2', name: 'Cotton', variety: 'Bt Cotton Bollgard II', season: 'Kharif 2026', totalFarmers: 390, avgArea: '1.8 Acres' },
    { id: 'c-3', name: 'Sugarcane', variety: 'Co 86032', season: 'Annual 2026', totalFarmers: 250, avgArea: '2.5 Acres' },
    { id: 'c-4', name: 'Wheat', variety: 'HD 2189', season: 'Rabi 2026', totalFarmers: 200, avgArea: '1.5 Acres' }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Admin Crops Overview</h1>
        <p className="text-sm text-slate-500 font-medium">Crop distributions, variety stats and active seasonal acreage</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {crops.map((c) => (
          <Card key={c.id}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">🌾 {c.name}</h3>
              <span className="px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-800 text-xs font-bold">
                {c.season}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <div>
                <span className="text-slate-400 block">Variety</span>
                <span className="font-bold text-slate-800">{c.variety}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Total Farmers</span>
                <span className="font-bold text-purple-700">{c.totalFarmers}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Avg Land</span>
                <span className="font-bold text-slate-800">{c.avgArea}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
