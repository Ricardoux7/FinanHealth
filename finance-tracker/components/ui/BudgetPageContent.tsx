'use client'
import { useBudget } from "@/components/ui/BudgetContext";
import { useEffect, useState } from "react";
import { Header } from "@/components/ui/components";
import Aside from "@/components/ui/components";
import { motion, AnimatePresence } from "framer-motion";

function Modal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
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
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all z-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function BudgetPageContent() {
  const { budgets, fetchBudgets, addBudget } = useBudget();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');
  const [startingSpent, setStartingSpent] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchBudgets(); }, [fetchBudgets]);

  const resetForm = () => { setName(''); setLimit(''); setStartingSpent(''); setFormError(''); };

  const handleClose = () => { setShowModal(false); resetForm(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!name.trim()) { setFormError('Budget name is required'); return; }
    const limitNum = parseFloat(limit);
    if (!limitNum || limitNum <= 0) { setFormError('Limit must be a positive number'); return; }
    const spentNum = parseFloat(startingSpent) || 0;
    if (spentNum >= limitNum) { setFormError('Starting spent cannot exceed the limit'); return; }
    setSaving(true);
    try {
      await addBudget({ name: name.trim(), limit: limitNum, currentSpent: spentNum });
      handleClose();
    } catch {
      setFormError('Error creating budget. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.currentSpent, 0);
  const overBudgetCount = budgets.filter(b => b.currentSpent >= b.limit).length;

  return (
    <section className="md:grid md:grid-cols-[320px_1fr] min-h-screen">
      <aside><Aside /></aside>
      <section className="flex flex-col bg-[#0A0F1E] min-h-screen">
        <Header />
        <main className="flex-1 p-6 space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-white text-2xl font-bold">Budgets</h1>
              <p className="text-gray-400 text-sm mt-0.5">Track and control your spending limits</p>
            </div>
            <button onClick={() => setShowModal(true)}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-green-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Budget
            </button>
          </div>

          {/* Summary cards */}
          {budgets.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Total Budget', value: `$${totalLimit.toLocaleString('en', { minimumFractionDigits: 2 })}`, color: 'text-blue-400', bg: 'bg-[#0F1729] border-[#1E2A42]' },
                { label: 'Total Spent', value: `$${totalSpent.toLocaleString('en', { minimumFractionDigits: 2 })}`, color: totalSpent > totalLimit ? 'text-red-400' : 'text-white', bg: 'bg-[#0F1729] border-[#1E2A42]' },
                { label: 'Over Budget', value: `${overBudgetCount} budget${overBudgetCount !== 1 ? 's' : ''}`, color: overBudgetCount > 0 ? 'text-red-400' : 'text-green-400', bg: overBudgetCount > 0 ? 'bg-[#1E0D0D] border-[#4a1a1a]' : 'bg-[#0D2218] border-[#1a4a30]' },
              ].map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className={`rounded-2xl border p-4 ${c.bg}`}>
                  <p className="text-gray-400 text-xs mb-1">{c.label}</p>
                  <p className={`font-bold text-xl ${c.color}`}>{c.value}</p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Budget cards */}
          {budgets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#0F1729] border border-[#1E2A42] flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#4b5563" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
              </div>
              <p className="text-gray-400 font-medium mb-1">No budgets yet</p>
              <p className="text-gray-600 text-sm mb-5">Create your first budget to start tracking spending</p>
              <button onClick={() => setShowModal(true)}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors">
                Create Budget
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {budgets.map((budget, i) => {
                const pct = budget.limit > 0 ? (budget.currentSpent / budget.limit) * 100 : 0;
                const isOver = pct >= 100;
                const isNear = pct >= 80 && !isOver;
                const remaining = budget.limit - budget.currentSpent;
                return (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className={`bg-[#0F1729] rounded-2xl border p-5 flex flex-col gap-3 ${isOver ? 'border-red-500/50' : isNear ? 'border-yellow-500/50' : 'border-[#1E2A42]'}`}>

                    {/* Top row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isOver ? 'bg-red-500/15' : isNear ? 'bg-yellow-500/15' : 'bg-green-500/15'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={isOver ? '#ef4444' : isNear ? '#eab308' : '#22c55e'} className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                          </svg>
                        </div>
                        <p className="text-white font-bold text-base">{budget.name}</p>
                      </div>
                      {isOver && <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-500/15 text-red-400 flex-shrink-0">Over limit</span>}
                      {isNear && <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-yellow-500/15 text-yellow-400 flex-shrink-0">Near limit</span>}
                    </div>

                    {/* Amounts */}
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-gray-400 text-xs mb-0.5">Spent</p>
                        <p className={`text-xl font-bold ${isOver ? 'text-red-400' : 'text-white'}`}>${budget.currentSpent.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-xs mb-0.5">Limit</p>
                        <p className="text-lg font-semibold text-gray-300">${budget.limit.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(pct, 100)}%` }}
                        transition={{ duration: 0.8, delay: i * 0.06 }}
                        className={`h-full rounded-full ${isOver ? 'bg-red-500' : isNear ? 'bg-yellow-500' : 'bg-green-500'}`}
                      />
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between text-xs pt-1">
                      <span className={`font-semibold ${isOver ? 'text-red-400' : isNear ? 'text-yellow-400' : 'text-gray-400'}`}>
                        {Math.round(pct)}% used
                      </span>
                      <span className={`font-semibold ${remaining < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                        {remaining < 0 ? `$${Math.abs(remaining).toFixed(2)} over` : `$${remaining.toFixed(2)} left`}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </main>
      </section>

      {/* Modal */}
      {showModal && (
        <Modal onClose={handleClose}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#22c55e" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">New Budget</h2>
                <p className="text-gray-400 text-sm">Set a spending limit for a category</p>
              </div>
            </div>

            {formError && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {formError}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-gray-300 text-sm font-medium mb-1.5 block">Budget Name</label>
                <input type="text" placeholder="e.g., Groceries, Rent, Entertainment"
                  value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-[#1A2236] border border-[#2A3A55] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
              </div>

              <div>
                <label className="text-gray-300 text-sm font-medium mb-1.5 block">Spending Limit</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                  <input type="number" placeholder="0.00" min="0.01" step="0.01"
                    value={limit} onChange={e => setLimit(e.target.value)}
                    className="w-full bg-[#1A2236] border border-[#2A3A55] rounded-xl pl-8 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
                </div>
              </div>

              <div>
                <label className="text-gray-300 text-sm font-medium mb-1.5 block">
                  Already Spent <span className="text-gray-500 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                  <input type="number" placeholder="0.00" min="0" step="0.01"
                    value={startingSpent} onChange={e => setStartingSpent(e.target.value)}
                    className="w-full bg-[#1A2236] border border-[#2A3A55] rounded-xl pl-8 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
                </div>
                <p className="text-gray-500 text-xs mt-1">If you've already spent part of this budget</p>
              </div>

              {/* Preview */}
              {limit && parseFloat(limit) > 0 && (
                <div className="bg-[#1A2236] rounded-xl p-3 border border-[#2A3A55]">
                  <p className="text-gray-400 text-xs mb-2">Preview</p>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(((parseFloat(startingSpent) || 0) / parseFloat(limit)) * 100, 100)}%` }} />
                  </div>
                  <div className="flex justify-between text-xs mt-1.5">
                    <span className="text-gray-400">${(parseFloat(startingSpent) || 0).toFixed(2)} spent</span>
                    <span className="text-gray-400">${parseFloat(limit).toFixed(2)} limit</span>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-2">
                <button type="button" onClick={handleClose}
                  className="flex-1 py-3 rounded-xl border border-[#2A3A55] text-gray-400 hover:text-white hover:border-white/30 font-semibold transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-bold transition-colors flex items-center justify-center gap-2">
                  {saving
                    ? <><svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Saving...</>
                    : 'Create Budget'
                  }
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </section>
  );
}