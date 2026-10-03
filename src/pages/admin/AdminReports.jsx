import React from 'react';
import { BarChart3, Download } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const AdminReports = () => {
  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Admin Reports & System Analytics</h1>
          <p className="text-sm text-slate-500 font-medium">Export seasonal agricultural usage and engagement reports</p>
        </div>
        <Button variant="primary" icon={Download}>
          Export Full System CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="text-center p-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase">Total System Investment</h4>
          <p className="text-2xl font-extrabold text-purple-700 mt-2">₹1.42 Cr</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Across 1,420 Active Farmers</span>
        </Card>
        <Card className="text-center p-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase">AI Queries Processed</h4>
          <p className="text-2xl font-extrabold text-earth-700 mt-2">48,900</p>
          <span className="text-[11px] text-slate-500 mt-1 block">94.2% AI Parsing Accuracy</span>
        </Card>
        <Card className="text-center p-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase">Reminders Delivered</h4>
          <p className="text-2xl font-extrabold text-khet-700 mt-2">24,150</p>
          <span className="text-[11px] text-slate-500 mt-1 block">89% On-time Completion Rate</span>
        </Card>
      </div>
    </div>
  );
};
