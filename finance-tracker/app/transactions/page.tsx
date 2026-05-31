'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Header, AddTransaction } from "@/components/ui/components";
import Aside from "@/components/ui/components";
import { AnimatePresence, motion } from "framer-motion";

export default function TransactionsPage(){
  const [userInfo, setUserInfo] = useState<{ id: string }| null>(null);
  const router = useRouter();
  const [transactions, setTransactions] = useState<{ type: string; category: string; amount: number; date: string; source: string }[]>([]);
  const currentDate = new Date();
  const [minDate, setMinDate] = useState<string>(currentDate.toISOString().split('T')[0]);
  const [maxDate, setMaxDate] = useState<string>(currentDate.toISOString().split('T')[0]);
  const [filteredTransactions, setFilteredTransactions] = useState<{ type: string; category: string; amount: number; date: string; source: string }[]>([]);
  const [sendTransactions, setSendTransactions] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);


  const handleDateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const min = formData.get('minDate') as string;
    const max = formData.get('maxDate') as string;
    if (min) setMinDate(min);
    if (max) setMaxDate(max);
    filterTransactionsByDate();
  };

  const filterTransactionsByDate = () => {
    const min = new Date(minDate);
    const max = new Date(maxDate);
    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= min && transactionDate <= max;
    });
    setFilteredTransactions(filtered);
  }

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
  
  useEffect(() => {
    showData();
  }, []);

  const showTransactions = async function(userId: string) {
    try {
      const incomes = await fetch('/api/actions/movements/incomes/getIncomes?userId=' + userId);
      const expenses = await fetch('/api/actions/movements/expenses/getExpenses?userId=' + userId);
      const incomesData = await incomes.json();
      const expensesData = await expenses.json();
      if(incomes.ok && expenses.ok) {
        const allTransactions = [
          ...incomesData.map((income: { category: string; amount: number; date: string; source: string }) => ({
            type: 'income',
            category: income.category,
            amount: income.amount,
            date: income.date,
            source: income.source
          })),
          ...expensesData.map((expense: { category: string; amount: number; date: string; description: string }) => ({
            type: 'expense',
            category: expense.category,
            amount: expense.amount,
            date: expense.date,
          })),
        ];
        allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setTransactions(allTransactions);
        setFilteredTransactions(allTransactions);
      } else {
        alert('Error fetching transactions');
      }
    } catch (error) {
      alert('Error fetching transactions');
    }
  }

    useEffect(() => {
      if (userInfo && userInfo.id && userInfo.id !== '') {
        showTransactions(userInfo.id);
      }
    }, [userInfo]);

    return (
      <section className="md:grid md:grid-cols-[320px_1fr] min-h-full">
        <aside>
          <Aside />
        </aside>
        <main className="bg-[#0F1729] w-full right-0 min-h-screen h-full ml-auto">
            <form onSubmit={handleDateSubmit} className="flex flex-column  gap-5 items-start w-[95%] mx-auto">
              <div>
                <p className="text-white">Introduce the date you want to start to see your transactions</p>
                <input 
                  type="date" 
                  name="minDate"
                  className="text-white bg-[#1a2236] border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 mt-5 [&::-webkit-calendar-picker-indicator]:invert-[1]" 
                />
              </div>
              <div>
                <p className="text-white">Introduce the date you want to finish to see your transactions</p>
                <input 
                  type="date" 
                  name="maxDate"
                  className="text-white bg-[#1a2236] border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 mt-5 [&::-webkit-calendar-picker-indicator]:invert-[1] "
                  max={currentDate.toISOString().split('T')[0]} 
                  defaultValue={maxDate}
                />
              </div>
              <button type="submit" className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 h-10  mt-15">Submit</button>
            </form>
            <button className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 h-10  mt-15 ml-8" onClick={() => setShowAddTransaction(!showAddTransaction)}>Add Transaction</button>
          <section className="p-5">
            <h2 className="text-white text-xl font-bold mb-4">Your Transactions</h2>
            <form action="submit" className="flex flex-row gap-2">
              <input type="search" placeholder="Search transactions" className="w-[85%] bg-[#1a2236] border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 mb-5 text-white" />
              <button type="submit" className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 h-10 mb-5 w-[15%]">Search</button>
            </form>
            <AnimatePresence>
              {showAddTransaction && (
                <motion.div
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ zIndex: 50, position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh" }}
                >
                  <AddTransaction />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="space-y-4 flex  flex-col">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction, index) => (
                  <div key={index} className="bg-[#121B31] p-4 rounded-md relative flex flex-row justify-between gap-2 items-center border border-[#222f44]">
                    <div>
                      <p className="text-white font-bold">{transaction.category}</p>
                      <p className="text-gray-400">{transaction.source}</p>
                      <p className="text-gray-400 relative right-0 top-0">
                        {(() => {
                          const [datePart, timePart] = transaction.date.split("T");
                          const time = timePart ? timePart.substring(0, 5) : "";
                          return `${datePart} - ${time}`;
                        })()}
                      </p>
                    </div>
                    {transaction.type === 'income' ? (
                      <p className="text-green-500 font-bold">${transaction.amount.toFixed(2)}</p>
                    ) : (
                      <p className="text-red-500 font-bold">${transaction.amount.toFixed(2)}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No transactions found.</p>
              )}
            </div>
          </section>
        </main>
      </section>
    )
}