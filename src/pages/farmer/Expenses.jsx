import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt, Plus, PieChart, Trash2, Calendar, FileText } from 'lucide-react';
import { mockApi } from '../../api/mockApi';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmModal } from '../../components/common/ConfirmModal';

export const Expenses = () => {
  const { t } = useLanguage();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const loadExpenses = async () => {
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

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleDelete = async () => {
    if (deletingId) {
      await mockApi.deleteExpense(deletingId);
      showToast('Expense record deleted', 'info');
      setDeletingId(null);
      loadExpenses();
    }
  };

  if (loading) return <LoadingSpinner message="Loading expense records..." />;

  const totalExpenseSum = expenses.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{t('expenses')}</h1>
          <p className="text-sm text-slate-500 font-medium">Track crop input costs, seeds, fertilizers, labour & transport</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" icon={PieChart} onClick={() => navigate('/expense-reports')}>
            {t('expenseReports')}
          </Button>
          <Button variant="primary" icon={Plus} onClick={() => navigate('/add-expense')}>
            {t('addExpense')}
          </Button>
        </div>
      </div>

      {/* Summary Total Card */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-600 rounded-3xl p-6 text-white shadow-lg shadow-purple-600/15 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-200 block">Season Total Spending</span>
          <h2 className="text-3xl font-extrabold mt-1">₹{totalExpenseSum.toLocaleString()}</h2>
          <span className="text-xs text-purple-100 font-medium">{expenses.length} Total recorded receipts</span>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center font-bold">
          <Receipt className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Expense List */}
      {expenses.length === 0 ? (
        <EmptyState title="No expenses recorded yet" actionText={t('addExpense')} onAction={() => navigate('/add-expense')} />
      ) : (
        <div className="space-y-3">
          {expenses.map((exp) => (
            <Card key={exp.id} hoverable>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold flex-shrink-0">
                    <Receipt className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold text-xs">
                        {exp.category}
                      </span>
                      <span className="text-xs font-bold text-khet-700">🌾 {exp.cropName}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{exp.description || `${exp.category} Expense`}</h4>
                    <span className="text-xs text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {exp.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base font-extrabold text-slate-900">₹{parseFloat(exp.amount).toLocaleString()}</span>
                  <button
                    onClick={() => setDeletingId(exp.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this expense record?"
      />
    </div>
  );
};
