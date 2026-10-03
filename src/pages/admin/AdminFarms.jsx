import React from 'react';
import { Tractor } from 'lucide-react';
import { Card } from '../../components/common/Card';

export const AdminFarms = () => {
  const farms = [
    { id: 'f-1', name: 'Main Farm', owner: 'Ramesh Patil', location: 'Satara Rural', area: '2.0 Acres', crop: 'Soybean' },
    { id: 'f-2', name: 'Riverbank Land', owner: 'Ramesh Patil', location: 'Koregaon', area: '1.5 Acres', crop: 'Cotton' },
    { id: 'f-3', name: 'Sugarcane Plot 1', owner: 'Suresh More', location: 'Koregaon', area: '3.0 Acres', crop: 'Sugarcane' },
    { id: 'f-4', name: 'Wadi Land', owner: 'Anand Deshmukh', location: 'Walwa', area: '2.5 Acres', crop: 'Wheat' }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Admin Farms Directory</h1>
        <p className="text-sm text-slate-500 font-medium">All registered farm plots and land sizes across system</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase">
                <th className="pb-3">Farm Name</th>
                <th className="pb-3">Farmer / Owner</th>
                <th className="pb-3">Location</th>
                <th className="pb-3">Total Area</th>
                <th className="pb-3 text-right">Primary Crop</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {farms.map((farm) => (
                <tr key={farm.id}>
                  <td className="py-3 font-bold text-slate-900">{farm.name}</td>
                  <td className="py-3 font-semibold text-purple-700">{farm.owner}</td>
                  <td className="py-3">{farm.location}</td>
                  <td className="py-3">{farm.area}</td>
                  <td className="py-3 text-right font-bold text-slate-900">🌾 {farm.crop}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
