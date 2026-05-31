import { useSaving } from "@/components/ui/SavingContext";
import { useEffect, useState } from "react";
import { Header, AddTransaction } from "@/components/ui/components";
import { motion, AnimatePresence } from "framer-motion";
import Aside from "@/components/ui/components";

// Colores disponibles para el ahorro
const SAVING_COLORS = [
  "#22d3ee",
  "#818cf8",
  "#f472b6",
  "#fbbf24",
  "#34d399",
];

type UserInfo = {
  id?: string | null;
} | null;

interface SavingPageContentProps {
  userInfo: UserInfo;
  setUserInfo?: (user: UserInfo) => void;
  showMakeSaving?: boolean;
  setShowMakeSaving?: (show: boolean) => void;
  makeSaving?: (userId: string) => void;
  showUpdateSaving?: boolean;
  setShowUpdateSaving?: (show: boolean) => void;
  updateSaving?: (savingId: string, userId: string) => void;
}

export default function SavingPageContent({ userInfo, showMakeSaving: showMakeSavingProp, setShowMakeSaving: setShowMakeSavingProp, makeSaving, showUpdateSaving: showUpdateSavingProp, setShowUpdateSaving: setShowUpdateSavingProp, updateSaving,  }: SavingPageContentProps) {
  const { savings, fetchSavings } = useSaving();
  const { addSaving } = useSaving();
  const { updateSaving: updateSavingContext } = useSaving();
  const [showMakeSaving, setShowMakeSaving] = useState(false);
  const [showUpdateSaving, setShowUpdateSaving] = useState(false);
  const [selectedSaving, setSelectedSaving] = useState<string | null>(null);

  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState(0);
  const [color, setColor] = useState(SAVING_COLORS[0]);
  const [deadline, setDeadline] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userInfo?.id && userInfo.id !== "") {
      fetchSavings(userInfo.id);
    } 
  }, [userInfo, fetchSavings]);


  const showModal = showMakeSavingProp !== undefined ? showMakeSavingProp : showMakeSaving;
  const setShowModal = setShowMakeSavingProp !== undefined ? setShowMakeSavingProp : setShowMakeSaving;

  const showUpdateModal = showUpdateSavingProp !== undefined ? showUpdateSavingProp : showUpdateSaving;
  const setShowUpdateModal = setShowUpdateSavingProp !== undefined ? setShowUpdateSavingProp : setShowUpdateSaving;


  return (
        <main className="bg-[#0f1729] p-4 pl-10 gap-4">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 h-10"
            onClick={() => setShowModal(true)}
          >
            Add Saving
          </button>
          <AnimatePresence mode="wait">
            {showMakeSaving && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-[#10182A] rounded-2xl p-8 w-full max-w-sm shadow-2xl relative animate-fadeIn"
                  initial={{ y: -300, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -300, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 80, damping: 18 }}
                >
                  <button
                    className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
                    onClick={() => setShowModal(false)}
                    aria-label="Close"
                  >
                    ×
                  </button>
                  <h2 className="text-white text-xl font-bold mb-4">Create Savings Goal</h2>
                  <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setError("");
                    if (!goalName.trim()) {
                      setError("Goal name is required");
                      return;
                    }
                    if (!targetAmount || targetAmount <= 0) {
                      setError("Target amount must be greater than 0");
                      return;
                    }
                    if (!userInfo?.id) {
                      setError("User not found");
                      return;
                    }
                    setCreating(true);
                    try {
                      await addSaving(userInfo.id, {
                        name: goalName,
                        targetAmount,
                        targetDate: deadline,
                        currentAmount: 0,
                        status: "active",
                      });
                      setShowModal(false);
                      setGoalName("");
                      setTargetAmount(0);
                      setDeadline("");
                      setColor(SAVING_COLORS[0]);
                    } catch (err) {
                      setError("Error creating saving");
                    } finally {
                      setCreating(false);
                    }
                  }}
                >
                  <label className="block text-gray-300 text-sm mb-1">Goal Name</label>
                  <input
                    className="w-full mb-3 px-3 py-2 rounded bg-[#19213A] text-white border border-[#222F44] focus:outline-none focus:ring-2 focus:ring-green-400"
                    type="text"
                    placeholder="e.g., Emergency Fund, Vacation..."
                    value={goalName}
                    onChange={e => setGoalName(e.target.value)}
                  />
                  <label className="block text-gray-300 text-sm mb-1">Target Amount</label>
                  <div className="relative mb-3">
                    <span className="absolute left-3 top-2 text-gray-400">$</span>
                    <input
                      className="w-full pl-7 pr-3 py-2 rounded bg-[#19213A] text-white border border-[#222F44] focus:outline-none focus:ring-2 focus:ring-green-400"
                      type="number"
                      min="0"
                      step="0.01"
                      value={targetAmount}
                      onChange={e => setTargetAmount(Number(e.target.value))}
                    />
                  </div>
                  <label className="block text-gray-300 text-sm mb-1">Color</label>
                  <div className="flex gap-2 mb-3">
                    {SAVING_COLORS.map((c) => (
                      <button
                        type="button"
                        key={c}
                        className={`w-7 h-7 rounded-full border-2 ${color === c ? 'border-white' : 'border-transparent'}`}
                        style={{ background: c }}
                        onClick={() => setColor(c)}
                        aria-label={`Select color ${c}`}
                      />
                    ))}
                  </div>
                  <label className="block text-gray-300 text-sm mb-1">Deadline (optional)</label>
                  <input
                    className="w-full mb-4 px-3 py-2 rounded bg-[#19213A] text-white border border-[#222F44] focus:outline-none focus:ring-2 focus:ring-green-400"
                    type="date"
                    value={deadline}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setDeadline(e.target.value)}
                  />
                  {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
                  <button
                    type="submit"
                    className="w-full py-2 rounded-lg bg-green-500 text-white font-bold hover:bg-green-600 transition-colors duration-200 mt-2"
                    disabled={creating}
                  >
                    {creating ? "Creating..." : "Create Goal"}
                  </button>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
  )
}