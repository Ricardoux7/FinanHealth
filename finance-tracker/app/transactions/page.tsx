'use client'
import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/ui/components";
import { AddTransaction } from "@/components/ui/addTransaction";
import Aside from "@/components/ui/components";
import { AnimatePresence, motion } from "framer-motion";

type Transaction = {
  type: string;
  category: string;
  amount: number;
  date: string;
  source: string;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const currentDate = new Date();
  const [minDate, setMinDate] = useState<string>('');
  const [maxDate, setMaxDate] = useState<string>('');
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');

  const showTransactions = async () => {
    try {
      const [incomes, expenses] = await Promise.all([
        fetch('/api/actions/movements/incomes/getIncomes'),
        fetch('/api/actions/movements/expenses/getExpenses'),
      ]);
      const incomesData = await incomes.json();
      const expensesData = await expenses.json();
      if (incomes.ok && expenses.ok) {
        const all: Transaction[] = [
          ...incomesData.map((i: any) => ({ type: 'income', category: i.category, amount: i.amount, date: i.date, source: i.source || '' })),
          ...expensesData.map((e: any) => ({ type: 'expense', category: e.category, amount: e.amount, date: e.date, source: e.description || '' })),
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setTransactions(all);
      } else {
        setErrorMsg('Error fetching transactions');
      }
    } catch {
      setErrorMsg('Error fetching transactions');
    }
  };

  useEffect(() => {
    showTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      const min = minDate ? new Date(minDate) : null;
      const max = maxDate ? new Date(maxDate + 'T23:59:59') : null;

      if (min && d < min) return false;
      if (max && d > max) return false;
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchCategory = t.category.toLowerCase().includes(term);
        const matchSource = t.source?.toLowerCase().includes(term);
        if (!matchCategory && !matchSource) return false;
      }
      return true;
    });
  }, [transactions, minDate, maxDate, typeFilter, searchTerm]);

  const hasActiveFilters = minDate || maxDate || typeFilter !== 'all' || searchTerm;

  const clearFilters = () => {
    setMinDate('');
    setMaxDate('');
    setTypeFilter('all');
    setSearchTerm('');
  };

  const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = filteredTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return (
    <section className="md:grid md:grid-cols-[320px_1fr] min-h-full">
      <aside><Aside /></aside>
      <section className="w-full">
        <Header />
        <main className="bg-[#0F1729] w-full min-h-screen p-6">
          <h1 className="text-white text-2xl font-bold mb-1">Transactions</h1>
          <p className="text-gray-400 mb-6">All your income and expenses</p>

          {errorMsg && (
            <div className="mb-4 px-4 py-2 bg-red-100 text-red-800 border border-red-400 rounded-md text-sm">{errorMsg}</div>
          )}

          {/* Filtros */}
          <div className="bg-[#121B31] border border-[#222f44] rounded-xl p-4 mb-5 flex flex-col gap-4">
            
            {/* Búsqueda */}
            <input
              type="search"
              placeholder="Search by category or source..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a2236] border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 text-white"
            />

            <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
              
              {/* Fechas */}
              <div className="flex flex-wrap gap-3 items-end">
                <div>
                  <p className="text-white text-sm mb-1">From</p>
                  <input type="date" value={minDate} onChange={e => setMinDate(e.target.value)}
                    className="text-white bg-[#1a2236] border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 [&::-webkit-calendar-picker-indicator]:invert-[1]" />
                </div>
                <div>
                  <p className="text-white text-sm mb-1">To</p>
                  <input type="date" value={maxDate} max={currentDate.toISOString().split('T')[0]} onChange={e => setMaxDate(e.target.value)}
                    className="text-white bg-[#1a2236] border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 [&::-webkit-calendar-picker-indicator]:invert-[1]" />
                </div>
              </div>

              {/* Tipo */}
              <div className="flex gap-2">
                {(['all', 'income', 'expense'] as const).map(opt => (
                  <button key={opt} onClick={() => setTypeFilter(opt)}
                    className={`px-4 py-2 rounded-md font-semibold text-sm capitalize transition-colors duration-200 ${
                      typeFilter === opt
                        ? opt === 'income' ? 'bg-green-500 text-white'
                          : opt === 'expense' ? 'bg-red-500 text-white'
                          : 'bg-blue-500 text-white'
                        : 'bg-[#1a2236] text-gray-400 hover:text-white border border-[#222f44]'
                    }`}>
                    {opt === 'all' ? 'All' : opt === 'income' ? '↑ Income' : '↓ Expense'}
                  </button>
                ))}
              </div>
            </div>

            {/* Limpiar filtros + contador */}
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-sm">
                {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
              </p>
              {hasActiveFilters && (
                <button onClick={clearFilters}
                  className="text-sm text-red-400 hover:text-red-300 underline">
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Resumen */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-[#113F33] border border-[#1e3a2f] rounded-xl p-4 text-center">
              <p className="text-white/60 text-sm mb-1">Total Income</p>
              <p className="text-green-400 font-bold text-xl">+${totalIncome.toFixed(2)}</p>
            </div>
            <div className="bg-[#4C232F] border border-[#6b2737] rounded-xl p-4 text-center">
              <p className="text-white/60 text-sm mb-1">Total Expenses</p>
              <p className="text-red-400 font-bold text-xl">-${totalExpense.toFixed(2)}</p>
            </div>
          </div>

          {/* Botón agregar */}
          <div className="flex justify-end mb-4">
            <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 font-semibold"
              onClick={() => setShowAddTransaction(!showAddTransaction)}>
              + Add Transaction
            </button>
          </div>

          <AnimatePresence>
            {showAddTransaction && (
          <AddTransaction
            onClose={() => setShowAddTransaction(false)}
            onSuccess={() => { setShowAddTransaction(false);}}
          />
        )}
          </AnimatePresence>

          {/* Lista */}
          <div className="space-y-3">
            {filteredTransactions.length > 0 ? filteredTransactions.map((t, i) => (
              <div key={i} className="bg-[#121B31] p-4 rounded-xl flex justify-between items-center border border-[#222f44]">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${t.type === 'income' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
                    {t.type === 'income' ? '↑' : '↓'}
                  </div>
                  <div>
                    <p className="text-white font-bold">{t.category}</p>
                    {t.source && <p className="text-gray-400 text-sm">{t.source}</p>}
                    <p className="text-gray-500 text-xs">{new Date(t.date).toLocaleDateString()} {new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <p className={`font-bold text-lg ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                  {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                </p>
              </div>
            )) : (
              <p className="text-gray-400 text-center py-8">No transactions found.</p>
            )}
          </div>

        </main>
      </section>
    </section>
  );
}