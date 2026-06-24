"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Aside from "@/components/ui/components";
import { Header } from "@/components/ui/components";
import { AddTransaction } from "@/components/ui/addTransaction";
interface Saving { name: string; currentAmount: number; targetAmount: number; status: string; }
interface Transaction { type: string; category: string; amount: number; date: string; source: string; }
interface UserInfo { id: string; username: string; balance: number; }

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function StatCard({ label, value, icon, color, loading }: { label: string; value: string; icon: React.ReactNode; color: string; loading: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className={`rounded-2xl border p-5 flex items-center justify-between gap-4 ${color}`}>
      <div>
        <p className="text-white/60 text-sm mb-1">{label}</p>
        {loading
          ? <div className="h-8 w-32 bg-white/10 rounded-lg animate-pulse" />
          : <p className="text-white text-2xl font-bold tracking-tight">{value}</p>
        }
      </div>
      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [lastIncomes, setLastIncomes] = useState(0);
  const [lastExpenses, setLastExpenses] = useState(0);
  const [savingsBalance, setSavingsBalance] = useState<Saving[]>([]);
  const [savingIndex, setSavingIndex] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const now = new Date();
  const month = now.getMonth() + 1;

  const loadAll = useCallback(async () => {
    try {
      const [userRes, incomesRes, expensesRes, savingsRes] = await Promise.all([
        fetch('/api/auth/userInfo'),
        fetch('/api/actions/movements/incomes/getIncomes'),
        fetch('/api/actions/movements/expenses/getExpenses'),
        fetch('/api/actions/saving/getSavings'),
      ]);
      const [userData, incomesData, expensesData, savingsData] = await Promise.all([
        userRes.json(), incomesRes.json(), expensesRes.json(), savingsRes.json(),
      ]);

      if (userRes.ok) setUserInfo(userData);

      if (incomesRes.ok && Array.isArray(incomesData)) {
        const total = incomesData
          .filter((i: any) => new Date(i.date).getMonth() + 1 === month && new Date(i.date).getFullYear() === now.getFullYear())
          .reduce((s: number, i: any) => s + i.amount, 0);
        setLastIncomes(total);
      }

      if (expensesRes.ok && Array.isArray(expensesData)) {
        const total = expensesData
          .filter((e: any) => new Date(e.date).getMonth() + 1 === month && new Date(e.date).getFullYear() === now.getFullYear())
          .reduce((s: number, e: any) => s + e.amount, 0);
        setLastExpenses(total);

        const incomes: Transaction[] = Array.isArray(incomesData)
          ? incomesData.map((i: any) => ({ type: 'income', category: i.category, amount: i.amount, date: i.date, source: i.source || '' }))
          : [];
        const expenses: Transaction[] = expensesData.map((e: any) => ({ type: 'expense', category: e.category, amount: e.amount, date: e.date, source: e.description || '' }));
        setTransactions([...incomes, ...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }

      if (savingsRes.ok && Array.isArray(savingsData)) {
        setSavingsBalance(savingsData.filter((s: any) => s.status === 'active' || s.status === 'completed'));
      }
    } catch {
      setErrorMsg('Error loading data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  useEffect(() => {
    if (savingsBalance.length > 1) {
      const t = setInterval(() => setSavingIndex(p => (p + 1) % savingsBalance.length), 3500);
      return () => clearInterval(t);
    }
  }, [savingsBalance]);

  const balance = userInfo?.balance ?? 0;
  const savingsTotal = savingsBalance.reduce((s, sv) => s + sv.currentAmount, 0);
  const netMonth = lastIncomes - lastExpenses;

  return (
    <section className="md:grid md:grid-cols-[320px_1fr] min-h-screen">
      <aside><Aside /></aside>
      <section className="flex flex-col min-h-screen bg-[#0A0F1E]">
        <Header />
        <main className="flex-1 p-6 space-y-6">

          {/* Header row */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-white text-2xl font-bold">
                {userInfo ? `Good ${now.getHours() < 12 ? 'morning' : now.getHours() < 18 ? 'afternoon' : 'evening'}, ${userInfo.username} 👋` : 'Dashboard'}
              </h1>
              <p className="text-gray-400 text-sm mt-0.5">{MONTHS[now.getMonth()]} {now.getFullYear()} overview</p>
            </div>
            <button onClick={() => setShowAddTransaction(true)}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-green-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              Add Transaction
            </button>
          </div>

          {errorMsg && (
            <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{errorMsg}</div>
          )}

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard label="Total Balance" loading={loading}
              value={`${balance < 0 ? '-' : ''}$${Math.abs(balance).toLocaleString('en', { minimumFractionDigits: 2 })}`}
              color="bg-[#0F1729] border-[#1E2A42]"
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#22d3ee" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18-3a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3m18-3V6m0 3H3" /></svg>}
            />
            <StatCard label={`Income — ${MONTHS[now.getMonth()]}`} loading={loading}
              value={`+$${lastIncomes.toLocaleString('en', { minimumFractionDigits: 2 })}`}
              color="bg-[#0D2218] border-[#1a4a30]"
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#22c55e" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>}
            />
            <StatCard label={`Expenses — ${MONTHS[now.getMonth()]}`} loading={loading}
              value={`-$${lastExpenses.toLocaleString('en', { minimumFractionDigits: 2 })}`}
              color="bg-[#1E0D0D] border-[#4a1a1a]"
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#ef4444" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.306-4.307a11.95 11.95 0 015.814 5.519l2.74 1.22m0 0l-5.94 2.28m5.94-2.28l-2.28-5.941" /></svg>}
            />
            <StatCard label="Total Savings" loading={loading}
              value={`$${savingsTotal.toLocaleString('en', { minimumFractionDigits: 2 })}`}
              color="bg-[#130D2B] border-[#2d1a5a]"
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#a78bfa" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
          </div>

          {/* Net this month banner */}
          {!loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={`rounded-2xl border px-5 py-4 flex items-center justify-between ${netMonth >= 0 ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${netMonth >= 0 ? 'bg-green-400' : 'bg-red-400'}`} />
                <p className="text-gray-300 text-sm">Net this month</p>
              </div>
              <p className={`font-bold text-lg ${netMonth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {netMonth >= 0 ? '+' : '-'}${Math.abs(netMonth).toLocaleString('en', { minimumFractionDigits: 2 })}
              </p>
            </motion.div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <div className="bg-[#0F1729] border border-[#1E2A42] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold text-base">Recent Transactions</h2>
                <a href="/transactions" className="text-green-400 text-sm hover:text-green-300 transition-colors">View all →</a>
              </div>
              {loading ? (
                <div className="space-y-3">
                  {[1,2,3,4].map(i => <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />)}
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500 text-sm">No transactions yet</p>
                  <button onClick={() => setShowAddTransaction(true)} className="mt-3 text-green-400 text-sm hover:text-green-300">Add your first one →</button>
                </div>
              ) : (
                <div className="space-y-2">
                  {transactions.slice(0, 8).map((t, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${t.type === 'income' ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                          {t.type === 'income' ? '↑' : '↓'}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{t.category}</p>
                          <p className="text-gray-500 text-xs">{new Date(t.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</p>
                        </div>
                      </div>
                      <p className={`font-semibold text-sm ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                        {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Savings goals */}
            <div className="bg-[#0F1729] border border-[#1E2A42] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold text-base">Savings Goals</h2>
                <a href="/savings" className="text-green-400 text-sm hover:text-green-300 transition-colors">View all →</a>
              </div>
              {loading ? (
                <div className="space-y-3">
                  {[1,2,3].map(i => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />)}
                </div>
              ) : savingsBalance.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500 text-sm">No savings goals yet</p>
                  <a href="/savings" className="mt-3 text-green-400 text-sm hover:text-green-300 block">Create one →</a>
                </div>
              ) : (
                <div className="space-y-3">
                  {savingsBalance.slice(0, 4).map((s, i) => {
                    const pct = s.targetAmount > 0 ? Math.min((s.currentAmount / s.targetAmount) * 100, 100) : 0;
                    return (
                      <motion.div key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                        className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-white text-sm font-medium">{s.name}</p>
                          <p className="text-gray-400 text-xs">${s.currentAmount.toFixed(0)} / ${s.targetAmount.toFixed(0)}</p>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.1 }}
                            className={`h-full rounded-full ${pct >= 100 ? 'bg-green-400' : 'bg-violet-400'}`} />
                        </div>
                        <p className="text-gray-500 text-xs mt-1">{Math.round(pct)}% complete</p>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </section>

      {/* Modal add transaction */}
      <AnimatePresence>
        {showAddTransaction && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) setShowAddTransaction(false); }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
              <AddTransaction onClose={() => setShowAddTransaction(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}