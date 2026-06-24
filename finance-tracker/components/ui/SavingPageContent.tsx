'use client'
import { useSaving } from "@/components/ui/SavingContext";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/ui/components";
import Aside from "@/components/ui/components";

const SAVING_COLORS = [
  { hex: "#22d3ee", label: "Cyan" },
  { hex: "#818cf8", label: "Indigo" },
  { hex: "#f472b6", label: "Pink" },
  { hex: "#fbbf24", label: "Amber" },
  { hex: "#34d399", label: "Emerald" },
  { hex: "#f87171", label: "Red" },
];

type UserInfo = { id?: string | null } | null;

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

export default function SavingPageContent({ userInfo }: { userInfo: UserInfo }) {
  const { savings, fetchSavings, addSaving } = useSaving();
  const [showModal, setShowModal] = useState(false);
  const [showContribModal, setShowContribModal] = useState<string | null>(null);
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [color, setColor] = useState(SAVING_COLORS[0].hex);
  const [deadline, setDeadline] = useState("");
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");
  const [contribAmount, setContribAmount] = useState("");
  const [contribError, setContribError] = useState("");
  const [contribLoading, setContribLoading] = useState(false);

  useEffect(() => { fetchSavings(); }, [fetchSavings]);

  const resetForm = () => { setGoalName(""); setTargetAmount(""); setDeadline(""); setColor(SAVING_COLORS[0].hex); setFormError(""); };
  const handleClose = () => { setShowModal(false); resetForm(); };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!goalName.trim()) { setFormError("Goal name is required"); return; }
    const amount = parseFloat(targetAmount);
    if (!amount || amount <= 0) { setFormError("Target amount must be greater than 0"); return; }
    setCreating(true);
    try {
      await addSaving({ name: goalName.trim(), targetAmount: amount, targetDate: deadline, currentAmount: 0, status: "active" });
      handleClose();
    } catch {
      setFormError("Error creating goal. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleContribution = async (savingId: string) => {
    setContribError("");
    const amount = parseFloat(contribAmount);
    if (!amount || amount <= 0) { setContribError("Amount must be greater than 0"); return; }
    setContribLoading(true);
    try {
      await fetch(`/api/actions/saving`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ savingId, amountToAdd: amount }),
      });
      await fetchSavings();
      setShowContribModal(null);
      setContribAmount("");
    } catch {
      setContribError("Error adding contribution.");
    } finally {
      setContribLoading(false);
    }
  };

  const totalSaved = savings.reduce((s, sv) => s + sv.currentAmount, 0);
  const totalTarget = savings.reduce((s, sv) => s + sv.targetAmount, 0);
  const completedCount = savings.filter(s => s.status === 'completed').length;

  return (
    <section className="min-h-screen">
      <section className="flex flex-col bg-[#0A0F1E] min-h-screen ">
        <main className="flex-1 p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-white text-2xl font-bold">Savings</h1>
              <p className="text-gray-400 text-sm mt-0.5">Work towards your financial goals</p>
            </div>
            <button onClick={() => setShowModal(true)}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-green-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Goal
            </button>
          </div>

          {/* Summary */}
          {savings.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Total Saved', value: `$${totalSaved.toLocaleString('en', { minimumFractionDigits: 2 })}`, color: 'text-green-400', bg: 'bg-[#0D2218] border-[#1a4a30]' },
                { label: 'Total Target', value: `$${totalTarget.toLocaleString('en', { minimumFractionDigits: 2 })}`, color: 'text-white', bg: 'bg-[#0F1729] border-[#1E2A42]' },
                { label: 'Completed Goals', value: `${completedCount} of ${savings.length}`, color: completedCount > 0 ? 'text-violet-400' : 'text-gray-400', bg: 'bg-[#130D2B] border-[#2d1a5a]' },
              ].map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className={`rounded-2xl border p-4 ${c.bg}`}>
                  <p className="text-gray-400 text-xs mb-1">{c.label}</p>
                  <p className={`font-bold text-xl ${c.color}`}>{c.value}</p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Savings list */}
          {savings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#0F1729] border border-[#1E2A42] flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#4b5563" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-400 font-medium mb-1">No savings goals yet</p>
              <p className="text-gray-600 text-sm mb-5">Set a goal and start saving towards it</p>
              <button onClick={() => setShowModal(true)}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors">
                Create Goal
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {savings.map((saving, i) => {
                const pct = saving.targetAmount > 0 ? Math.min((saving.currentAmount / saving.targetAmount) * 100, 100) : 0;
                const isCompleted = saving.status === 'completed' || pct >= 100;
                const isAbandoned = saving.status === 'abandoned';
                const dueDate = saving.targetDate ? new Date(saving.targetDate) : null;
                const isOverdue = dueDate && dueDate < new Date() && !isCompleted;
                const accentColor = SAVING_COLORS[i % SAVING_COLORS.length].hex;
                return (
                  <motion.div key={saving._id || i}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className={`bg-[#0F1729] rounded-2xl border p-5 flex flex-col gap-3 relative overflow-hidden ${isCompleted ? 'border-green-500/40' : isAbandoned ? 'border-gray-700 opacity-60' : isOverdue ? 'border-orange-500/40' : 'border-[#1E2A42]'}`}>

                    {/* Accent stripe */}
                    <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ backgroundColor: accentColor }} />

                    {/* Top */}
                    <div className="flex items-start justify-between gap-2 pl-3">
                      <div>
                        <p className="text-white font-bold text-base">{saving.name}</p>
                        {dueDate && (
                          <p className={`text-xs mt-0.5 ${isOverdue ? 'text-orange-400' : 'text-gray-500'}`}>
                            {isOverdue ? '⚠ Overdue · ' : 'Due '}
                            {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        )}
                      </div>
                      {isCompleted && (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-500/15 text-green-400 flex-shrink-0">✓ Done</span>
                      )}
                      {isAbandoned && (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-500/15 text-gray-400 flex-shrink-0">Abandoned</span>
                      )}
                    </div>

                    {/* Amounts */}
                    <div className="flex justify-between items-end pl-3">
                      <div>
                        <p className="text-gray-400 text-xs mb-0.5">Saved</p>
                        <p className="text-2xl font-bold text-white">${saving.currentAmount.toLocaleString('en', { minimumFractionDigits: 2 })}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-xs mb-0.5">Goal</p>
                        <p className="text-lg font-semibold text-gray-300">${saving.targetAmount.toLocaleString('en', { minimumFractionDigits: 2 })}</p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="pl-3">
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.9, delay: i * 0.06 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: isCompleted ? '#22c55e' : accentColor }}
                        />
                      </div>
                      <div className="flex justify-between text-xs mt-1.5">
                        <span className="text-gray-500">{Math.round(pct)}% complete</span>
                        {!isCompleted && (
                          <span className="text-gray-500">${(saving.targetAmount - saving.currentAmount).toFixed(2)} to go</span>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    {!isAbandoned && !isCompleted && (
                      <button
                        onClick={() => { setShowContribModal(saving._id || null); setContribAmount(""); setContribError(""); }}
                        className="mt-1 w-full py-2.5 rounded-xl border text-sm font-semibold transition-all hover:text-white"
                        style={{ borderColor: accentColor + '60', color: accentColor }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = accentColor + '20')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        + Add Contribution
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </main>
      </section>

      {/* Create Goal Modal */}
      {showModal && (
        <Modal onClose={handleClose}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#a78bfa" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">New Savings Goal</h2>
                <p className="text-gray-400 text-sm">Define your goal and track progress</p>
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

            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div>
                <label className="text-gray-300 text-sm font-medium mb-1.5 block">Goal Name</label>
                <input type="text" placeholder="e.g., Emergency Fund, New Car, Vacation"
                  value={goalName} onChange={e => setGoalName(e.target.value)}
                  className="w-full bg-[#1A2236] border border-[#2A3A55] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
              </div>

              <div>
                <label className="text-gray-300 text-sm font-medium mb-1.5 block">Target Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                  <input type="number" placeholder="0.00" min="0.01" step="0.01"
                    value={targetAmount} onChange={e => setTargetAmount(e.target.value)}
                    className="w-full bg-[#1A2236] border border-[#2A3A55] rounded-xl pl-8 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
                </div>
              </div>

              <div>
                <label className="text-gray-300 text-sm font-medium mb-1.5 block">
                  Target Date <span className="text-gray-500 font-normal">(optional)</span>
                </label>
                <input type="date" value={deadline} min={new Date().toISOString().split('T')[0]}
                  onChange={e => setDeadline(e.target.value)}
                  className="w-full bg-[#1A2236] border border-[#2A3A55] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all [&::-webkit-calendar-picker-indicator]:invert-[1]" />
              </div>

              <div>
                <label className="text-gray-300 text-sm font-medium mb-2 block">Color</label>
                <div className="flex gap-3">
                  {SAVING_COLORS.map(c => (
                    <button type="button" key={c.hex} onClick={() => setColor(c.hex)}
                      className={`w-8 h-8 rounded-full transition-all ${color === c.hex ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0F1729] scale-110' : 'opacity-70 hover:opacity-100'}`}
                      style={{ backgroundColor: c.hex }} title={c.label} />
                  ))}
                </div>
              </div>

              {/* Preview */}
              {targetAmount && parseFloat(targetAmount) > 0 && (
                <div className="bg-[#1A2236] rounded-xl p-3 border border-[#2A3A55]">
                  <p className="text-gray-400 text-xs mb-2">Preview</p>
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium mb-1">{goalName || 'Your goal'}</p>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-0 rounded-full" style={{ backgroundColor: color }} />
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs flex-shrink-0">${parseFloat(targetAmount).toFixed(2)}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-2">
                <button type="button" onClick={handleClose}
                  className="flex-1 py-3 rounded-xl border border-[#2A3A55] text-gray-400 hover:text-white hover:border-white/30 font-semibold transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={creating}
                  className="flex-1 py-3 rounded-xl bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-bold transition-colors flex items-center justify-center gap-2">
                  {creating
                    ? <><svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Creating...</>
                    : 'Create Goal'
                  }
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* Contribution Modal */}
      {showContribModal && (
        <Modal onClose={() => { setShowContribModal(null); setContribAmount(""); setContribError(""); }}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#22c55e" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Add Contribution</h2>
                <p className="text-gray-400 text-sm">{savings.find(s => s._id === showContribModal)?.name}</p>
              </div>
            </div>

            {contribError && (
              <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{contribError}</div>
            )}

            <div className="mb-4">
              <label className="text-gray-300 text-sm font-medium mb-1.5 block">Amount to Add</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                <input type="number" placeholder="0.00" min="0.01" step="0.01"
                  value={contribAmount} onChange={e => setContribAmount(e.target.value)} autoFocus
                  className="w-full bg-[#1A2236] border border-[#2A3A55] rounded-xl pl-8 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setShowContribModal(null); setContribAmount(""); }}
                className="flex-1 py-3 rounded-xl border border-[#2A3A55] text-gray-400 hover:text-white hover:border-white/30 font-semibold transition-all">
                Cancel
              </button>
              <button onClick={() => handleContribution(showContribModal)} disabled={contribLoading}
                className="flex-1 py-3 rounded-xl bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-bold transition-colors flex items-center justify-center gap-2">
                {contribLoading
                  ? <><svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Adding...</>
                  : 'Add'
                }
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}