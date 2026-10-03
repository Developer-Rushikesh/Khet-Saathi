import React, { useState } from 'react';
import { Sprout, Droplets, TestTube, Wheat, Bug, Scissors, Tractor, FileText, Calendar, Filter } from 'lucide-react';
import { Card } from '../common/Card';
import { Select } from '../common/Input';
import { EmptyState } from '../common/EmptyState';

export const ActivityTimeline = ({ activities = [], crops = [], onSelectActivity }) => {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const typeIcons = {
    Sowing: { icon: Sprout, color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    Irrigation: { icon: Droplets, color: 'bg-sky-100 text-sky-800 border-sky-300' },
    Spray: { icon: TestTube, color: 'bg-purple-100 text-purple-800 border-purple-300' },
    Fertilizer: { icon: Wheat, color: 'bg-amber-100 text-amber-800 border-amber-300' },
    'Pest/Disease': { icon: Bug, color: 'bg-rose-100 text-rose-800 border-rose-300' },
    Weeding: { icon: Scissors, color: 'bg-teal-100 text-teal-800 border-teal-300' },
    Harvest: { icon: Tractor, color: 'bg-orange-100 text-orange-800 border-orange-300' },
    Other: { icon: FileText, color: 'bg-slate-100 text-slate-800 border-slate-300' }
  };

  const filteredActivities = activities.filter(act => {
    if (selectedCrop && act.cropId !== selectedCrop) return false;
    if (selectedType && act.type !== selectedType) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-slate-500 font-semibold text-xs uppercase tracking-wider w-full sm:w-auto">
          <Filter className="w-4 h-4 text-khet-600" />
          <span>Filters:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          <Select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            placeholder="All Crops"
            options={crops.map(c => ({ value: c.id, label: `${c.name} (${c.farmName})` }))}
          />

          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            placeholder="All Activity Types"
            options={[
              'Sowing',
              'Irrigation',
              'Spray',
              'Fertilizer',
              'Pest/Disease',
              'Weeding',
              'Harvest',
              'Other'
            ]}
          />
        </div>
      </div>

      {/* Timeline Stream */}
      {filteredActivities.length === 0 ? (
        <EmptyState title="No activities found" description="Try clearing filters or add a new activity." />
      ) : (
        <div className="relative pl-6 border-l-2 border-khet-200 space-y-6 my-4">
          {filteredActivities.map((act) => {
            const config = typeIcons[act.type] || typeIcons.Other;
            const Icon = config.icon;
            return (
              <div key={act.id} className="relative group">
                {/* Node Bullet Icon */}
                <div className={`absolute -left-[35px] top-1.5 w-9 h-9 rounded-full ${config.color} border flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 z-10`}>
                  <Icon className="w-4 h-4" />
                </div>

                <Card
                  hoverable
                  onClick={() => onSelectActivity && onSelectActivity(act)}
                  className="ml-2 group-hover:border-khet-400 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {act.date}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs font-bold text-khet-700">{act.cropName}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900">{act.type}</h4>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        {act.productName} ({act.quantity} {act.unit})
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${config.color}`}>
                      {act.type}
                    </span>
                  </div>

                  {act.notes && (
                    <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      "{act.notes}"
                    </p>
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
