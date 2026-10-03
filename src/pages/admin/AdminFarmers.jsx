import React from 'react';
import { Users, Search, Shield } from 'lucide-react';
import { Card } from '../../components/common/Card';

export const AdminFarmers = () => {
  const farmersList = [
    { id: 'usr-1', name: 'Ramesh Patil', mobile: '+91 98765 43210', district: 'Satara', village: 'Satara Rural', farms: 2, crops: 3, status: 'Active' },
    { id: 'usr-2', name: 'Suresh More', mobile: '+91 98123 45678', district: 'Satara', village: 'Koregaon', farms: 2, crops: 2, status: 'Active' },
    { id: 'usr-3', name: 'Anand Deshmukh', mobile: '+91 97654 32109', district: 'Sangli', village: 'Walwa', farms: 3, crops: 4, status: 'Active' },
    { id: 'usr-4', name: 'Balasaheb Kadam', mobile: '+91 99887 76655', district: 'Kolhapur', village: 'Kagal', farms: 1, crops: 2, status: 'Active' },
    { id: 'usr-5', name: 'Vikas Jadhav', mobile: '+91 95432 10987', district: 'Pune', village: 'Baramati', farms: 2, crops: 3, status: 'Active' }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Admin Farmers Directory</h1>
        <p className="text-sm text-slate-500 font-medium">Registered farmer accounts and activity status</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase">
                <th className="pb-3">Farmer Name</th>
                <th className="pb-3">Mobile</th>
                <th className="pb-3">Village / District</th>
                <th className="pb-3">Farms</th>
                <th className="pb-3">Crops</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {farmersList.map((f) => (
                <tr key={f.id}>
                  <td className="py-3 font-bold text-slate-900">{f.name}</td>
                  <td className="py-3 font-semibold text-slate-600">{f.mobile}</td>
                  <td className="py-3">{f.village}, {f.district}</td>
                  <td className="py-3">{f.farms} Farms</td>
                  <td className="py-3">{f.crops} Crops</td>
                  <td className="py-3 text-right">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                      {f.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
