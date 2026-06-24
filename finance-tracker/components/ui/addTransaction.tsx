'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AddTransactionProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddTransaction({ onClose, onSuccess }: AddTransactionProps) {
  const [userInfo, setUserInfo] = useState<{ id: string; categories: string[] } | null>(null);
  const [tab, setTab] = useState<'income' | 'expense'>('income');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [expenseType, setExpenseType] = useState<'casual' | 'budget'>('casual');
  const [budgets, setBudgets] = useState<{ _id: string; name: string; limit: number; currentSpent: number }[]>([]);

  useEffect(() => {
    fetch('/api/auth/userInfo').then(r => r.json()).then(d => setUserInfo(d)).catch(() => {});
  }, []);

  useEffect(() => {
    if (userInfo) {
      fetch('/api/actions/budget').then(r => r.json()).then(d => setBudgets(d.data || [])).catch(() => {});
    }
  }, [userInfo]);

  const categoryExists = category === '__new__' && userInfo?.categories?.some(
    c => c.toLowerCase() === newCategory.trim().toLowerCase()
  );
  const selectedCategory = category === '__new__' ? newCategory.trim() : category;

  const resetForm = () => {
    setAmount(''); setCategory(''); setNewCategory(''); setSource('');
    setDate(new Date().toISOString().split('T')[0]); setExpenseType('casual');
    setMessage(''); setIsSuccess(false);
  };

  const handleTabChange = (t: 'income' | 'expense') => { setTab(t); resetForm(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (!selectedCategory) { setMessage('Please select or enter a category'); return; }
    if (!amount || parseFloat(amount) <= 0) { setMessage('Enter a valid amount'); return; }
    setLoading(true);
    try {
      if (tab === 'income') {
        const res = await fetch('/api/actions/movements/incomes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: selectedCategory, amount: parseFloat(amount), date, source }),
        });
        if (res.ok) {
          setIsSuccess(true);
          setMessage('Income added successfully!');
          onSuccess?.();
        } else {
          const err = await res.json();
          setMessage(err.message || 'Error adding income');
        }
      } else {
        const res = await fetch('/api/actions/movements/expenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: selectedCategory, amount: parseFloat(amount), date, source, type: expenseType }),
        });
        if (res.ok) {
          if (expenseType === 'budget') {
            const budget = budgets.find(b => b.name === category);
            if (budget) {
              await fetch('/api/actions/budget', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ budgetId: budget._id, updateData: { currentSpent: (budget.currentSpent || 0) + parseFloat(amount) } }),
              });
            }
          }
          setIsSuccess(true);
          setMessage('Expense added successfully!');
          onSuccess?.();
        } else {
          const err = await res.json();
          setMessage(err.message || 'Error adding expense');
        }
      }
    } catch {
      setMessage('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categoryList = tab === 'expense' && expenseType === 'budget'
    ? budgets.map(b => b.name)
    : (userInfo?.categories ?? []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          className="bg-[#0F1729] border border-[#1E2A42] rounded-2xl w-full max-w-md shadow-2xl relative"
          initial={{ scale: 0.95, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 16 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        >
          {/* X cerrar */}
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all z-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tab === 'income' ? 'bg-green-500/15' : 'bg-red-500/15'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={tab === 'income' ? '#22c55e' : '#ef4444'} className="w-5 h-5">
                  {tab === 'income'
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                    : <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.306-4.307a11.95 11.95 0 015.814 5.519l2.74 1.22m0 0l-5.94 2.28m5.94-2.28l-2.28-5.941" />
                  }
                </svg>
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Add Transaction</h2>
                <p className="text-gray-400 text-sm">Record a new movement</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-[#1A2236] rounded-xl p-1 mb-5">
              {(['income', 'expense'] as const).map(t => (
                <button key={t} type="button" onClick={() => handleTabChange(t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${tab === t
                    ? t === 'income' ? 'bg-green-500 text-white shadow-md' : 'bg-red-500 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'}`}>
                  {t === 'income' ? '↑ Income' : '↓ Expense'}
                </button>
              ))}
            </div>

            {/* Message */}
            {message && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                className={`mb-4 px-4 py-3 rounded-xl text-sm flex items-center gap-2 ${isSuccess
                  ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 flex-shrink-0">
                  {isSuccess
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    : <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  }
                </svg>
                {message}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Amount */}
              <div>
                <label className="text-gray-300 text-sm font-medium mb-1.5 block">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                  <input type="number" placeholder="0.00" min="0.01" step="0.01"
                    value={amount} onChange={e => setAmount(e.target.value)}
                    className="w-full bg-[#1A2236] border border-[#2A3A55] rounded-xl pl-8 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                </div>
              </div>

              {/* Expense type */}
              {tab === 'expense' && (
                <div>
                  <label className="text-gray-300 text-sm font-medium mb-2 block">Type</label>
                  <div className="flex gap-3">
                    {(['casual', 'budget'] as const).map(t => (
                      <label key={t} className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all capitalize text-sm font-medium ${expenseType === t ? 'border-red-500/50 bg-red-500/10 text-red-300' : 'border-[#2A3A55] text-gray-400 hover:text-white'}`}>
                        <input type="radio" name="expenseType" value={t} checked={expenseType === t}
                          onChange={() => { setExpenseType(t); setCategory(''); }}
                          className="accent-red-500" />
                        {t}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Category */}
              <div>
                <label className="text-gray-300 text-sm font-medium mb-1.5 block">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full bg-[#1A2236] border border-[#2A3A55] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">
                  <option value="" disabled>Select category</option>
                  {categoryList.length > 0
                    ? categoryList.map((c, i) => <option key={i} value={c} className="bg-[#1A2236]">{c}</option>)
                    : <option value="" disabled>{tab === 'expense' && expenseType === 'budget' ? 'No budgets available' : 'No categories yet'}</option>
                  }
                  {!(tab === 'expense' && expenseType === 'budget') && (
                    <option value="__new__" className="bg-[#1A2236] text-green-400">+ New category</option>
                  )}
                </select>
                {category === '__new__' && (
                  <div className="mt-2">
                    <input type="text" placeholder="Category name" value={newCategory} onChange={e => setNewCategory(e.target.value)}
                      className="w-full bg-[#1A2236] border border-[#2A3A55] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
                    {categoryExists && <p className="text-red-400 text-xs mt-1">This category already exists</p>}
                  </div>
                )}
              </div>

              {/* Source */}
              <div>
                <label className="text-gray-300 text-sm font-medium mb-1.5 block">
                  Source <span className="text-gray-500 font-normal">(optional)</span>
                </label>
                <input type="text" placeholder={tab === 'income' ? 'e.g., Salary, Freelance...' : 'e.g., Supermarket, Online...'}
                  value={source} onChange={e => setSource(e.target.value)}
                  className="w-full bg-[#1A2236] border border-[#2A3A55] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
              </div>

              {/* Date */}
              <div>
                <label className="text-gray-300 text-sm font-medium mb-1.5 block">Date</label>
                <input type="date" value={date} max={new Date().toISOString().split('T')[0]} onChange={e => setDate(e.target.value)}
                  className="w-full bg-[#1A2236] border border-[#2A3A55] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all [&::-webkit-calendar-picker-indicator]:invert-[1]" />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-1">
                <button type="button" onClick={onClose}
                  className="flex-1 py-3 rounded-xl border border-[#2A3A55] text-gray-400 hover:text-white hover:border-white/30 font-semibold transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={loading || !!categoryExists || isSuccess}
                  className={`flex-1 py-3 rounded-xl font-bold text-white transition-colors disabled:opacity-60 flex items-center justify-center gap-2 ${tab === 'income' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}>
                  {loading
                    ? <><svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Adding...</>
                    : isSuccess ? '✓ Added!' : `Add ${tab}`
                  }
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}