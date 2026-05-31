import { useBudget } from "@/components/ui/BudgetContext";
import { useEffect, useState } from "react";
import { Header, AddTransaction } from "@/components/ui/components";
import Aside from "@/components/ui/components";

type UserInfo = {
  id?: string | null;
} | null;

interface BudgetPageContentProps {
  userInfo: UserInfo;
  setUserInfo?: (user: UserInfo) => void;
  showMakeBudget?: boolean;
  setShowMakeBudget?: (show: boolean) => void;
  makeBudget?: (userId: string) => void;
  showUpdateBudget?: boolean;
  setShowUpdateBudget?: (show: boolean) => void;
  updateBudget?: (budgetId: string) => void;
}

export default function BudgetPageContent({ userInfo, showMakeBudget: showMakeBudgetProp, setShowMakeBudget: setShowMakeBudgetProp, makeBudget, showUpdateBudget: showUpdateBudgetProp, setShowUpdateBudget: setShowUpdateBudgetProp }: BudgetPageContentProps) {
  const { budgets, fetchBudgets } = useBudget();
  const { addBudget } = useBudget();
  const { updateBudget } = useBudget();
  const [showMakeBudget, setShowMakeBudget] = useState(false);
  const [showUpdateBudget, setShowUpdateBudget] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);

  useEffect(() => {
    if (userInfo?.id && userInfo.id !== "") {
      fetchBudgets(userInfo.id);
    } 
  }, [userInfo, fetchBudgets]);

  const showModal = showMakeBudgetProp !== undefined ? showMakeBudgetProp : showMakeBudget;
  const setShowModal = setShowMakeBudgetProp !== undefined ? setShowMakeBudgetProp : setShowMakeBudget;

  const showUpdateModal = showUpdateBudgetProp !== undefined ? showUpdateBudgetProp : showUpdateBudget;
  const setShowUpdateModal = setShowUpdateBudgetProp !== undefined ? setShowUpdateBudgetProp : setShowUpdateBudget;

  return (
    <section className="md:grid md:grid-cols-[320px_1fr] min-h-full">
      <div className="flex flex-1">
        <Aside />
      </div>
      <section>
        <Header />
        <main className="bg-[#0f1729] h-full">
          <h1 className="text-white font-bold text-2xl ml-4">Budgets</h1>
          <p className="text-white ml-4">Track your spending limits</p>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 ml-4" onClick={() => setShowModal(true)}>
            Add Budget
          </button>
          <section className="flex flex-column flex-wrap items-start gap-2 w-[98%] mx-auto mt-5">
            {budgets.map((budget, index) => {
              const percent = budget.limit > 0 ? (budget.currentSpent / budget.limit) * 100 : 0;
              const isNearLimit = percent >= 80;
              return (
                <div key={index} className={`bg-[#121B31] border ${isNearLimit ? 'border-yellow-500' : 'border-green-500'} rounded-xl p-4 w-87.5 mx-auto mb-6 flex flex-col gap-2 relative shadow-lg`}> 
                  <div className="flex items-center gap-3 mb-2">
                    {/* Icono */}
                    <div className="bg-green-900 rounded-lg w-10 h-10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25M6.364 6.364l-1.591 1.591M3 12h2.25M6.364 17.636l-1.591-1.591M12 21v-2.25M17.636 17.636l1.591-1.591M21 12h-2.25M17.636 6.364l1.591 1.591" />
                        <rect x="8" y="10" width="8" height="6" rx="2" fill="currentColor" className="text-green-700" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <span className="text-white font-bold text-lg">{budget.name}</span>
                    </div>
                    {isNearLimit && (
                      <span className="bg-yellow-600 text-yellow-100 text-xs font-bold px-3 py-1 rounded-full ml-2">Near limit</span>
                    )}
                  </div>
                  <div className="text-white text-md font-semibold mb-1">${budget.currentSpent.toFixed(2)} of ${budget.limit.toFixed(2)}</div>
                  {/* Barra de progreso */}
                  <div className="w-full h-2 bg-[#222F44] rounded-full overflow-hidden mb-2">
                    <div className={`h-2 rounded-full transition-all duration-500 ${isNearLimit ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${Math.min(percent, 100)}%` }}></div>
                  </div>
                  <div className="flex flex-row justify-between text-sm mt-1">
                    <span className="text-gray-300 font-semibold">{Math.round(percent)}% used</span>
                    <span className="text-gray-300 font-semibold">${(budget.limit - budget.currentSpent).toFixed(2)} left</span>
                  </div>
                </div>
              );
            })}
          </section>
        </main>
      </section>
      {showModal && (
        <div className="bg-[#0F1729] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  h-auto flex flex-col items-center justify-center z-20 w-[400px] rounded-md border border-[#222F44] p-5">
          <div className="w-full flex justify-end">
            <button
              type="button"
              aria-label="Close"
              className="cursor-pointer text-white bg-transparent hover:text-gray-400 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold transition-colors duration-200"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
          </div>
          <div className="flex flex-col items-center justify-center w-full">
            <span className="mb-4">
              {/* Icono billetera moderno con fondo circular y sombra */}
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #16A249 60%, #43e97b 100%)',
                boxShadow: '0 4px 16px 0 rgba(22,162,73,0.25)',
                marginBottom: '0.5rem',
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="36" height="36" fill="none">
                  <rect x="4" y="9" width="24" height="14" rx="4" fill="#fff"/>
                  <rect x="4" y="9" width="24" height="14" rx="4" stroke="#16A249" strokeWidth="2"/>
                  <rect x="7" y="13" width="10" height="6" rx="2" fill="#16A249"/>
                  <circle cx="23" cy="16" r="2" fill="#16A249"/>
                  <rect x="13" y="7" width="10" height="4" rx="2" fill="#43e97b"/>
                </svg>
              </span>
            </span>
            <p className='text-white font-bold my-2 text-lg'>Create New Budget</p>
          </div>
          <form onSubmit={e => {
            e.preventDefault();
            if (userInfo?.id) {
              addBudget(userInfo.id, {
                name: (document.getElementsByName('name')[0] as HTMLInputElement).value,
                limit: parseFloat((document.getElementsByName('limit')[0] as HTMLInputElement).value),
                currentSpent: parseFloat((document.getElementsByName('starting')[0] as HTMLInputElement).value) || 0,
              });
            }
          }} className="flex flex-col gap-4 w-[90%]">
            <input 
              type="text" 
              name="name" 
              placeholder="Budget Name" 
              required 
              className="rounded-lg border-2 border-green-500 bg-[#181F32] text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-base mb-2" 
            />
            <input 
              type="number" 
              name="limit" 
              placeholder="Budget Limit" 
              required 
              min="0"
              className="rounded-lg border-2 border-green-500 bg-[#181F32] text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-base mb-2" 
            />
            <input 
              type="number" 
              name="starting" 
              placeholder="Starting Amount" 
              min="0"
              className="rounded-lg border-2 border-green-500 bg-[#181F32] text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-base mb-2" 
            />
            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg w-full mt-2 text-lg transition-colors duration-200">Save Budget</button>
          </form>
        </div>
      )}
    </section>
  );
}