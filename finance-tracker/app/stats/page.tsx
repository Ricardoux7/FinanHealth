'use client'
import { useState, useEffect } from "react";
import { Header } from "@/components/ui/components";
import Aside from "@/components/ui/components";
import BarChart from "@/components/ui/BarChart";
import PieChartExpenses, { PieChartIncomes } from "@/components/ui/PieChart";
import { motion } from "framer-motion";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTHS_FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"];

type YearOption = number;

export default function StatsPage() {
  const [categoriesIncomes, setCategoriesIncomes] = useState<string[]>([]);
  const [categoriesExpenses, setCategoriesExpenses] = useState<string[]>([]);
  const [amountsIncomes, setAmountsIncomes] = useState<number[]>([]);
  const [amountsExpenses, setAmountsExpenses] = useState<number[]>([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number[]>(Array(12).fill(0));
  const [monthlyIncomes, setMonthlyIncomes] = useState<number[]>(Array(12).fill(0));
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedYear, setSelectedYear] = useState<YearOption>(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState<number[]>([new Date().getFullYear()]);
  const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'incomes'>('overview');
  const [allExpenses, setAllExpenses] = useState<any[]>([]);
  const [allIncomes, setAllIncomes] = useState<any[]>([]);

  useEffect(() => {
    async function loadStats() {
      try {
        const [expensesRes, incomesRes] = await Promise.all([
          fetch('/api/actions/movements/expenses/getExpenses'),
          fetch('/api/actions/movements/incomes/getIncomes'),
        ]);
        const expensesData = await expensesRes.json();
        const incomesData = await incomesRes.json();
        if (expensesRes.ok && Array.isArray(expensesData)) setAllExpenses(expensesData);
        if (incomesRes.ok && Array.isArray(incomesData)) setAllIncomes(incomesData);

        const years = new Set<number>();
        if (Array.isArray(expensesData)) expensesData.forEach((e: any) => years.add(new Date(e.date).getFullYear()));
        if (Array.isArray(incomesData)) incomesData.forEach((i: any) => years.add(new Date(i.date).getFullYear()));
        years.add(new Date().getFullYear());
        setAvailableYears([...years].sort((a, b) => b - a));
      } catch {
        setErrorMsg('Error loading statistics');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  useEffect(() => {
    const filteredExp = allExpenses.filter((e: any) => new Date(e.date).getFullYear() === selectedYear);
    const filteredInc = allIncomes.filter((i: any) => new Date(i.date).getFullYear() === selectedYear);

    const expCats = [...new Set(filteredExp.map((e: any) => e.category))] as string[];
    setCategoriesExpenses(expCats);
    setAmountsExpenses(expCats.map(cat => filteredExp.filter((e: any) => e.category === cat).reduce((s: number, e: any) => s + e.amount, 0)));

    const incCats = [...new Set(filteredInc.map((i: any) => i.category))] as string[];
    setCategoriesIncomes(incCats);
    setAmountsIncomes(incCats.map(cat => filteredInc.filter((i: any) => i.category === cat).reduce((s: number, i: any) => s + i.amount, 0)));

    const monthly = Array(12).fill(0);
    filteredExp.forEach((e: any) => { monthly[new Date(e.date).getMonth()] += e.amount; });
    setMonthlyExpenses([...monthly]);

    const monthlyInc = Array(12).fill(0);
    filteredInc.forEach((i: any) => { monthlyInc[new Date(i.date).getMonth()] += i.amount; });
    setMonthlyIncomes([...monthlyInc]);
  }, [selectedYear, allExpenses, allIncomes]);

  const totalIncome = amountsIncomes.reduce((s, a) => s + a, 0);
  const totalExpense = amountsExpenses.reduce((s, a) => s + a, 0);
  const net = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((net / totalIncome) * 100) : 0;
  const peakExpenseMonth = monthlyExpenses.indexOf(Math.max(...monthlyExpenses));
  const peakIncomeMonth = monthlyIncomes.indexOf(Math.max(...monthlyIncomes));

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'expenses', label: 'Expenses' },
    { key: 'incomes', label: 'Income' },
  ] as const;

  return (
    <section className="md:grid md:grid-cols-[320px_1fr] min-h-screen">
      <aside><Aside /></aside>
      <section className="flex flex-col bg-[#0A0F1E] min-h-screen">
        <Header />
        <main className="flex-1 p-6 space-y-6">

          {/* Title + year selector */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-white text-2xl font-bold">Statistics</h1>
              <p className="text-gray-400 text-sm mt-0.5">Your financial performance at a glance</p>
            </div>
            <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}
              className="bg-[#0F1729] border border-[#1E2A42] text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm">
              {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {errorMsg && (
            <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{errorMsg}</div>
          )}

          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Income', value: `$${totalIncome.toLocaleString('en', { minimumFractionDigits: 2 })}`, color: 'text-green-400', bg: 'bg-[#0D2218] border-[#1a4a30]' },
              { label: 'Total Expenses', value: `$${totalExpense.toLocaleString('en', { minimumFractionDigits: 2 })}`, color: 'text-red-400', bg: 'bg-[#1E0D0D] border-[#4a1a1a]' },
              { label: 'Net Balance', value: `${net >= 0 ? '+' : ''}$${net.toLocaleString('en', { minimumFractionDigits: 2 })}`, color: net >= 0 ? 'text-green-400' : 'text-red-400', bg: 'bg-[#0F1729] border-[#1E2A42]' },
              { label: 'Savings Rate', value: `${savingsRate}%`, color: savingsRate >= 20 ? 'text-green-400' : savingsRate >= 10 ? 'text-yellow-400' : 'text-red-400', bg: 'bg-[#130D2B] border-[#2d1a5a]' },
            ].map((card, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className={`rounded-2xl border p-4 ${card.bg}`}>
                <p className="text-gray-400 text-xs mb-1">{card.label}</p>
                {loading
                  ? <div className="h-7 w-24 bg-white/10 rounded animate-pulse" />
                  : <p className={`font-bold text-xl ${card.color}`}>{card.value}</p>
                }
              </motion.div>
            ))}
          </div>

          {/* Insights row */}
          {!loading && (monthlyExpenses.some(v => v > 0) || monthlyIncomes.some(v => v > 0)) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Peak expense month', value: monthlyExpenses[peakExpenseMonth] > 0 ? `${MONTHS_FULL[peakExpenseMonth]} ($${monthlyExpenses[peakExpenseMonth].toFixed(0)})` : '—', icon: '📉' },
                { label: 'Peak income month', value: monthlyIncomes[peakIncomeMonth] > 0 ? `${MONTHS_FULL[peakIncomeMonth]} ($${monthlyIncomes[peakIncomeMonth].toFixed(0)})` : '—', icon: '📈' },
                { label: 'Expense categories', value: `${categoriesExpenses.length} categories tracked`, icon: '🏷️' },
              ].map((insight, i) => (
                <div key={i} className="bg-[#0F1729] border border-[#1E2A42] rounded-2xl px-5 py-4 flex items-center gap-3">
                  <span className="text-2xl">{insight.icon}</span>
                  <div>
                    <p className="text-gray-400 text-xs">{insight.label}</p>
                    <p className="text-white text-sm font-semibold">{insight.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tabs */}
          <div className="bg-[#0F1729] border border-[#1E2A42] rounded-2xl overflow-hidden">
            <div className="flex border-b border-[#1E2A42]">
              {tabs.map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${activeTab === tab.key ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-white'}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-white font-semibold mb-4">Monthly Income vs Expenses — {selectedYear}</h2>
                  {loading
                    ? <div className="h-64 bg-white/5 rounded-xl animate-pulse" />
                    : <BarChart labels={MONTHS} expenses={monthlyExpenses} incomes={monthlyIncomes} />
                  }
                </div>
              )}

              {activeTab === 'expenses' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-white font-semibold">Expenses by Category</h2>
                    <span className="text-gray-400 text-sm">{categoriesExpenses.length} categories</span>
                  </div>
                  {loading ? <div className="h-48 bg-white/5 rounded-xl animate-pulse" />
                    : categoriesExpenses.length === 0
                    ? <p className="text-gray-500 text-sm text-center py-12">No expense data for {selectedYear}</p>
                    : <PieChartExpenses labels={categoriesExpenses} amounts={amountsExpenses} />
                  }
                </div>
              )}

              {activeTab === 'incomes' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-white font-semibold">Income by Category</h2>
                    <span className="text-gray-400 text-sm">{categoriesIncomes.length} categories</span>
                  </div>
                  {loading ? <div className="h-48 bg-white/5 rounded-xl animate-pulse" />
                    : categoriesIncomes.length === 0
                    ? <p className="text-gray-500 text-sm text-center py-12">No income data for {selectedYear}</p>
                    : <PieChartIncomes labels={categoriesIncomes} amounts={amountsIncomes} />
                  }
                </div>
              )}
            </div>
          </div>

        </main>
      </section>
    </section>
  );
}