import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo3 from '../../images/logo3.png';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';
import {
  FileSpreadsheet,
  Printer,
  Filter,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Sprout,
  Tractor,
  Calendar,
  Receipt,
  ArrowLeft
} from 'lucide-react';
import { mockApi } from '../../api/mockApi';
import { useLanguage } from '../../context/LanguageContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Select, Input } from '../../components/common/Input';

export const ComprehensiveReports = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [activities, setActivities] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // Filter States
  const [selectedFarm, setSelectedFarm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [fList, cList, aList, eList] = await Promise.all([
          mockApi.getFarms(),
          mockApi.getCrops(),
          mockApi.getActivities(),
          mockApi.getExpenses()
        ]);
        setFarms(fList);
        setCrops(cList);
        setActivities(aList);
        setExpenses(eList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleResetFilters = () => {
    setSelectedFarm('');
    setSelectedCrop('');
    setStartDate('');
    setEndDate('');
    setSelectedType('');
  };

  if (loading) return <LoadingSpinner message="Preparing comprehensive farm analytics report..." />;

  // Apply Filters
  const filteredActivities = activities.filter((act) => {
    if (selectedFarm && act.farmId !== selectedFarm) return false;
    if (selectedCrop && act.cropId !== selectedCrop) return false;
    if (selectedType && act.type !== selectedType) return false;
    if (startDate && act.date < startDate) return false;
    if (endDate && act.date > endDate) return false;
    return true;
  });

  // Calculate Metrics
  let totalLaborWorkers = 0;
  let totalLaborCost = 0;
  let totalMaterialCost = 0;
  let totalExpensesSum = 0;
  let totalRevenueSum = 0;

  filteredActivities.forEach((act) => {
    const pCount = parseFloat(act.personCount) || 0;
    const pCost = parseFloat(act.costPerPerson) || 0;
    const lCost = pCount * pCost;
    const tCost = parseFloat(act.cost) || 0;
    const mCost = parseFloat(act.materialCost) || Math.max(0, tCost - lCost);
    const inc = parseFloat(act.income) || 0;

    totalLaborWorkers += pCount;
    totalLaborCost += lCost;
    totalMaterialCost += mCost;
    totalExpensesSum += tCost;
    totalRevenueSum += inc;
  });

  const netProfit = totalRevenueSum - totalExpensesSum;
  const roiPercentage = totalExpensesSum > 0 ? ((netProfit / totalExpensesSum) * 100).toFixed(1) : 0;

  // Aggregate Data per Crop for Recharts
  const cropFinancialMap = {};
  filteredActivities.forEach((act) => {
    const cName = act.cropName || 'Other Crop';
    if (!cropFinancialMap[cName]) {
      cropFinancialMap[cName] = { name: cName, expense: 0, labor: 0, material: 0, revenue: 0, profit: 0 };
    }
    const pCount = parseFloat(act.personCount) || 0;
    const pCost = parseFloat(act.costPerPerson) || 0;
    const lCost = pCount * pCost;
    const tCost = parseFloat(act.cost) || 0;
    const mCost = parseFloat(act.materialCost) || Math.max(0, tCost - lCost);
    const inc = parseFloat(act.income) || 0;

    cropFinancialMap[cName].expense += tCost;
    cropFinancialMap[cName].labor += lCost;
    cropFinancialMap[cName].material += mCost;
    cropFinancialMap[cName].revenue += inc;
    cropFinancialMap[cName].profit += (inc - tCost);
  });

  const cropChartData = Object.values(cropFinancialMap);

  // Expense Distribution Pie Chart
  const pieData = [
    { name: 'Labor Costs', value: totalLaborCost, color: '#0284c7' }, // Sky 600
    { name: 'Material & Inputs', value: totalMaterialCost, color: '#16a34a' } // Emerald 600
  ].filter(d => d.value > 0);

  // Export to CSV Function
  const handleExportCSV = () => {
    const headers = [
      'Activity Date',
      'Farm Name',
      'Crop Name',
      'Activity Type',
      'Product/Item Used',
      'Persons Used',
      'Cost Per Person (INR)',
      'Total Labor Cost (INR)',
      'Material Cost (INR)',
      'Total Activity Expense (INR)',
      'Harvest Revenue (INR)',
      'Net Impact (INR)',
      'Notes'
    ];

    const rows = filteredActivities.map((act) => {
      const pCount = parseFloat(act.personCount) || 0;
      const pCost = parseFloat(act.costPerPerson) || 0;
      const lCost = pCount * pCost;
      const tCost = parseFloat(act.cost) || 0;
      const mCost = parseFloat(act.materialCost) || Math.max(0, tCost - lCost);
      const inc = parseFloat(act.income) || 0;
      const net = inc - tCost;

      return [
        `"${act.date || ''}"`,
        `"${act.farmName || ''}"`,
        `"${act.cropName || ''}"`,
        `"${act.type || ''}"`,
        `"${act.productName || ''}"`,
        pCount,
        pCost,
        lCost,
        mCost,
        tCost,
        inc,
        net,
        `"${(act.notes || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Khet_Saathi_Farm_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to Print / PDF Function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 print:p-0 print:m-0">
      {/* Top Header & Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-start gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 p-1.5 flex items-center justify-center shadow-md overflow-hidden flex-shrink-0 mt-1">
            <img src={logo3} alt="Report Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-khet-700 mb-1 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Comprehensive Farm & Financial Report
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Detailed breakdown of farm crops, labor costs, input expenses, harvest revenues & net profits
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={FileSpreadsheet}
            onClick={handleExportCSV}
            className="border-emerald-600 text-emerald-700 hover:bg-emerald-50"
          >
            Export CSV
          </Button>

          <Button
            variant="primary"
            icon={Printer}
            onClick={handlePrint}
            className="bg-khet-700 hover:bg-khet-800"
          >
            Print / PDF
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4 print:hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Filter className="w-4 h-4 text-khet-600" />
            <span>Filter Report Data</span>
          </span>
          <button
            onClick={handleResetFilters}
            className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <Select
            label="Farm"
            value={selectedFarm}
            onChange={(e) => setSelectedFarm(e.target.value)}
            placeholder="All Farms"
            options={farms.map(f => ({ value: f.id, label: f.name }))}
          />

          <Select
            label="Crop"
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            placeholder="All Crops"
            options={crops.map(c => ({ value: c.id, label: `${c.name} (${c.farmName})` }))}
          />

          <Select
            label="Activity Type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            placeholder="All Types"
            options={['Sowing', 'Irrigation', 'Spray', 'Fertilizer', 'Pest/Disease', 'Weeding', 'Harvest', 'Other']}
          />

          <Input
            label="From Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <Input
            label="To Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Printable Report Header */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-4">
        <h1 className="text-2xl font-black text-slate-900">KHET SATHI — DIGITAL FARMING REPORT</h1>
        <p className="text-xs font-bold text-slate-600">Generated on {new Date().toLocaleDateString()}</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Expenses */}
        <Card className="bg-gradient-to-br from-rose-50 to-white border-rose-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wide">Total Expenses</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-black text-slate-900">₹{totalExpensesSum.toLocaleString()}</h2>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
              <span>Labor: ₹{totalLaborCost.toLocaleString()}</span>
              <span>•</span>
              <span>Input: ₹{totalMaterialCost.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        {/* Card 2: Labor & Worker Days */}
        <Card className="bg-gradient-to-br from-sky-50 to-white border-sky-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wide">Worker Labor Days</span>
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-black text-slate-900">{totalLaborWorkers} Persons</h2>
            <p className="text-xs text-sky-700 font-bold mt-1">
              ₹{totalLaborCost.toLocaleString()} Total Labor Wages Paid
            </p>
          </div>
        </Card>

        {/* Card 3: Harvest Revenue */}
        <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">Harvest Sales Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-black text-slate-900">₹{totalRevenueSum.toLocaleString()}</h2>
            <p className="text-xs text-amber-800 font-bold mt-1">
              Gross income from crop harvests
            </p>
          </div>
        </Card>

        {/* Card 4: Net Profit / Loss */}
        <Card className={`bg-gradient-to-br ${netProfit >= 0 ? 'from-emerald-50 to-white border-emerald-300' : 'from-rose-50 to-white border-rose-300'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase tracking-wide ${netProfit >= 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
              Net Profit / Loss
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${netProfit >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
              {netProfit >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            </div>
          </div>
          <div className="mt-3">
            <h2 className={`text-2xl font-black ${netProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {netProfit >= 0 ? '+' : ''}₹{netProfit.toLocaleString()}
            </h2>
            <p className={`text-xs font-bold mt-1 ${netProfit >= 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
              {roiPercentage}% ROI on farming expenses
            </p>
          </div>
        </Card>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
        {/* Crop Comparison Bar Chart */}
        <Card className="lg:col-span-2">
          <h3 className="text-base font-bold text-slate-900 mb-4">
            Crop-Wise Financial Profitability (Expenses vs Revenue vs Profit)
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, '']} />
                <Legend />
                <Bar dataKey="expense" name="Total Expense" fill="#ef4444" radius={[6, 6, 0, 0]} />
                <Bar dataKey="revenue" name="Harvest Revenue" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                <Bar dataKey="profit" name="Net Profit" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Expense Structure Breakdown Chart */}
        <Card>
          <h3 className="text-base font-bold text-slate-900 mb-4">Labor vs Material Expenses</h3>
          <div className="h-72 w-full flex flex-col items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => [`₹${Number(val).toLocaleString()}`, 'Amount']} />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400 font-semibold">No cost records to plot</p>
            )}
          </div>
        </Card>
      </div>

      {/* Comprehensive Detailed Data Table */}
      <Card className="overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">Detailed Farm Activity & Financial Ledger</h3>
            <p className="text-xs text-slate-500 font-medium">Showing {filteredActivities.length} activity records</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-600 font-extrabold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Farm & Crop</th>
                <th className="py-3 px-3">Activity</th>
                <th className="py-3 px-3">Item / Details</th>
                <th className="py-3 px-3 text-center">Persons Used</th>
                <th className="py-3 px-3 text-right">Labor Cost</th>
                <th className="py-3 px-3 text-right">Material Cost</th>
                <th className="py-3 px-3 text-right">Total Expense</th>
                <th className="py-3 px-3 text-right">Harvest Revenue</th>
                <th className="py-3 px-3 text-right">Net Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400 font-medium">
                    No matching activity records found for the selected filters.
                  </td>
                </tr>
              ) : (
                filteredActivities.map((act) => {
                  const pCount = parseFloat(act.personCount) || 0;
                  const pCost = parseFloat(act.costPerPerson) || 0;
                  const lCost = pCount * pCost;
                  const tCost = parseFloat(act.cost) || 0;
                  const mCost = parseFloat(act.materialCost) || Math.max(0, tCost - lCost);
                  const inc = parseFloat(act.income) || 0;
                  const net = inc - tCost;

                  return (
                    <tr key={act.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-700 whitespace-nowrap">{act.date}</td>
                      <td className="py-3 px-3">
                        <div className="font-extrabold text-slate-900">🌾 {act.cropName}</div>
                        <div className="text-[11px] text-slate-400 font-medium">{act.farmName}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-khet-100 text-khet-800 font-bold text-[11px]">
                          {act.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                        {act.productName ? `${act.productName} (${act.quantity || ''} ${act.unit || ''})` : '-'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {pCount > 0 ? (
                          <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold text-[11px]">
                            👥 {pCount} (@ ₹{pCost})
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-sky-700">
                        {lCost > 0 ? `₹${lCost.toLocaleString()}` : '-'}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-700">
                        {mCost > 0 ? `₹${mCost.toLocaleString()}` : '-'}
                      </td>
                      <td className="py-3 px-3 text-right font-black text-rose-700">
                        {tCost > 0 ? `₹${tCost.toLocaleString()}` : '-'}
                      </td>
                      <td className="py-3 px-3 text-right font-black text-amber-700">
                        {inc > 0 ? `₹${inc.toLocaleString()}` : '-'}
                      </td>
                      <td className={`py-3 px-3 text-right font-black ${net >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {net !== 0 ? `${net > 0 ? '+' : ''}₹${net.toLocaleString()}` : '₹0'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot>
              <tr className="bg-slate-900 text-white font-black text-xs border-t-2 border-slate-900">
                <td colSpan={4} className="py-3.5 px-3">SUMMARY TOTALS</td>
                <td className="py-3.5 px-3 text-center text-sky-300">👥 {totalLaborWorkers} Workers</td>
                <td className="py-3.5 px-3 text-right text-sky-300">₹{totalLaborCost.toLocaleString()}</td>
                <td className="py-3.5 px-3 text-right text-emerald-300">₹{totalMaterialCost.toLocaleString()}</td>
                <td className="py-3.5 px-3 text-right text-rose-300">₹{totalExpensesSum.toLocaleString()}</td>
                <td className="py-3.5 px-3 text-right text-amber-300">₹{totalRevenueSum.toLocaleString()}</td>
                <td className={`py-3.5 px-3 text-right ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {netProfit >= 0 ? '+' : ''}₹{netProfit.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
};
