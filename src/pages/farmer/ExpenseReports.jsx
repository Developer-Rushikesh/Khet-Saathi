import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, ArrowLeft } from 'lucide-react';
import { mockApi } from '../../api/mockApi';
import { useLanguage } from '../../context/LanguageContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ExpenseCharts } from '../../components/charts/ExpenseCharts';
import { Card } from '../../components/common/Card';

export const ExpenseReports = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await mockApi.getExpenses();
        setExpenses(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <LoadingSpinner message="Generating expense analytics..." />;

  const totalSum = expenses.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <button
        onClick={() => navigate('/expenses')}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-khet-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Expenses</span>
      </button>

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">{t('expenseReports')}</h1>
        <p className="text-sm text-slate-500 font-medium">Visual analytics and breakdown of your farming investment</p>
      </div>

      <ExpenseCharts expenses={expenses} />

      {/* Summary Data Table */}
      <Card>
        <h3 className="text-base font-bold text-slate-900 mb-4">Detailed Expense Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase">
                <th className="pb-3">Date</th>
                <th className="pb-3">Crop</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Description</th>
                <th className="pb-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {expenses.map((exp) => (
                <tr key={exp.id}>
                  <td className="py-3">{exp.date}</td>
                  <td className="py-3 font-bold text-slate-900">🌾 {exp.cropName}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500">{exp.description || '-'}</td>
                  <td className="py-3 text-right font-extrabold text-slate-900">₹{parseFloat(exp.amount).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 font-extrabold text-slate-900 text-sm">
                <td colSpan={4} className="pt-3">Total Investment</td>
                <td className="pt-3 text-right text-purple-700">₹{totalSum.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
};
