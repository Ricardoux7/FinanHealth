'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Header, AddTransaction } from "@/components/ui/components";
import Aside from "@/components/ui/components";
import { AnimatePresence, motion } from "framer-motion";
import SavingPageContent from "@/components/ui/SavingPageContent";
import { SavingProvider } from "@/components/ui/SavingContext";

export default function savingsPage(){
  const [userInfo, setUserInfo] = useState<{ id: string }| null>(null);
  const [savings, setSavings] = useState<any[]>([]);
  const router = useRouter();

  const showData = async () => {
    try {
      const response = await fetch('/api/auth/userInfo');
      const data = await response.json();
      if (response.ok) {
        setUserInfo(data);
      } else {
        alert('Error fetching user info');
      }
    } catch (error) {
      alert('Error fetching user info');
    }
  }

  const showSavings = async function(userId: string) {
    try {
      const response = await fetch(`/api/actions/saving/getSavings?userId=${userId}`);
      const data = await response.json();
      if (response.ok) {
        setSavings(data);
      } else {
        alert('Error fetching savings');
      }
    } catch (error) {
      alert('Error fetching savings');
    }
  }

  useEffect(() => {
    showData();
  }, []);

  useEffect(() => {
    if (userInfo?.id) {
      showSavings(userInfo.id);
    }
  }, [userInfo]);

  return (
    <section className="md:grid md:grid-cols-[320px_1fr] min-h-full">
      <aside>
        <Aside />
      </aside>
      <section>
        <Header />
        <SavingProvider>
          <SavingPageContent userInfo={userInfo} showMakeSaving={false} setShowMakeSaving={undefined} makeSaving={undefined} showUpdateSaving={false} setShowUpdateSaving={undefined} updateSaving={undefined} /> 
            <main className="bg-[#0f1729] h-full p-4 flex flex-wrap gap-4 justify-evenly">
              {savings.map((saving, index) => {
                const progress = saving.targetAmount > 0 ? (saving.currentAmount / saving.targetAmount) * 100 : 0;
                const dueDate = saving.targetDate ? new Date(saving.targetDate) : null;
                const dueDateStr = dueDate ? dueDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '';
                return (
                  <div key={index} className="bg-[#121B31] rounded-xl shadow-lg border-2 border-green-700 mx-auto md:mx-0 w-[90%] md:w-[320px] mb-6 p-5 relative  items-center">
                    {/* Icono */}
                    <div className="bg-green-900 rounded-full w-10 h-10 flex items-center justify-center absolute -top-5 left-1/2 -translate-x-1/2 border-4 border-[#0f1729]">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v8.25A2.25 2.25 0 006.75 20.25h10.5a2.25 2.25 0 002.25-2.25V9.75" />
                      </svg>
                    </div>
                    {/* Nombre y fecha */}
                    <div className="mt-6 w-full flex flex-col items-center">
                      <span className="uppercase text-green-300 font-bold text-md tracking-wide">{saving.name}</span>
                      {dueDateStr && (
                        <span className="text-gray-400 text-xs mt-1">Due {dueDateStr}</span>
                      )}
                    </div>
                    {/* Progreso */}
                    <div className="w-full mt-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progress</span>
                        <span className="font-bold text-white">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full h-2 bg-[#222F44] rounded-full overflow-hidden">
                        <div className="h-2 bg-green-400 rounded-full transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                      </div>
                    </div>
                    {/* Montos */}
                    <div className="w-full flex justify-between mt-3 text-sm">
                      <span className="text-white font-bold">${saving.currentAmount?.toFixed(2) ?? '0.00'} <span className="font-normal text-gray-400">saved</span></span>
                      <span className="text-white font-bold">${saving.targetAmount?.toFixed(2) ?? '0.00'} <span className="font-normal text-gray-400">goal</span></span>
                    </div>
                    <div className="w-full text-xs text-gray-400 mt-1 mb-2">${(saving.targetAmount - saving.currentAmount).toFixed(2)} remaining</div>
                    {/* Botón */}
                    <button className="w-full mt-2 py-2 rounded-lg bg-[#0f1729] border border-green-500 text-green-400 font-bold hover:bg-green-500 hover:text-white transition-colors duration-200">+ Add Contribution</button>
                  </div>
                );
              })}
            </main>
        </SavingProvider>
      </section>
    </section>
  )
}