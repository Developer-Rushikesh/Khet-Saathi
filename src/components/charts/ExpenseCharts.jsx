import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const COLORS = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444', '#14b8a6', '#6366f1', '#ec4899'];

export const ExpenseCharts = ({ expenses = [] }) => {
  // Aggregate Category breakdown
  const categoryMap = {};
  const cropMap = {};

  expenses.forEach(exp => {
    const amt = parseFloat(exp.amount) || 0;
    categoryMap[exp.category] = (categoryMap[exp.category] || 0) + amt;
    cropMap[exp.cropName] = (cropMap[exp.cropName] || 0) + amt;
  });

  const categoryData = Object.keys(categoryMap).map(cat => ({
    name: cat,
    value: categoryMap[cat]
  }));

  const cropData = Object.keys(cropMap).map(crop => ({
    name: crop,
    amount: cropMap[crop]
  }));

  if (expenses.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
      {/* Category Breakdown Pie Chart */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center">
        <h4 className="text-sm font-bold text-slate-800 mb-2 text-center">Category Breakdown</h4>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Crop-wise Expenses Bar Chart */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center">
        <h4 className="text-sm font-bold text-slate-800 mb-2 text-center">Crop-Wise Expenses</h4>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cropData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} formatter={(val) => `₹${val}`} />
              <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} />
              <Bar dataKey="amount" fill="#3e9753" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
