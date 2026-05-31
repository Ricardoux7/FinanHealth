"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import  Aside from "@/components/ui/components";
import { Header } from "@/components/ui/components";
import { SkeletonMenu } from "@/components/ui/components";
import { section } from "framer-motion/client";

export default function Home() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<{ id: string; balance?: number } | null>(null);
  const [balance, setBalance] = useState(0);
  const [lastIncomes, setLastIncomes] = useState(0);
  const [lastExpenses, setLastExpenses] = useState(0);
  interface Savings {
    name: string;
    currentAmount: number;
    status: string;
  }
  const [savingsBalance, setSavingsBalance] = useState<Savings[]>([]);
  const [currentSavingsIndex, setCurrentSavingsIndex] = useState(0);
  const [transactions, setTransactions] = useState<{ type: string; category: string; amount: number; date: string; }[]>([]);
  const date = new Date();
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const logOut = async () => {
    try {
      deleteCookie('session_token');
      router.push('/login');
    } catch (error) {
      alert('Error al cerrar sesión');
    }
    finally {      
      alert('Sesión cerrada');
    }
  }
  const showData = async () => {
    try {
      const response = await fetch('/api/auth/userInfo');
      const data = await response.json();
      if (response.ok) {
        setUserInfo(data);
        setBalance(data.balance);
      } else {
        alert('Error fetching user info');
      }
    } catch (error) {
      alert('Error fetching user info');
    }
  }
    
    const month = date.getMonth() + 1;

    const thisMonthIncome = async (userId: string) => {
      try {
        const response = await fetch('/api/actions/movements/incomes/getIncomes?userId=' + userId);
        const data = await response.json();
        if (response.ok) {
          let totalIncomes = 0;
          for (let i = 0; i < data.length; i++) {
            const currentIncomeDate = new Date(data[i].date);
            if (currentIncomeDate.getMonth() + 1 === month && currentIncomeDate.getFullYear() === date.getFullYear()) {
              totalIncomes += data[i].amount;
            }
          }
          setLastIncomes(totalIncomes);
        } else {
          alert('Error fetching incomes');
          setLastIncomes(0);
        }
      } catch (error) {
        alert('Error fetching incomes');
        setLastIncomes(0);
      }
    }

    const thisMonthExpenses = async function(userId: string) {
        try {
          const response = await fetch('/api/actions/movements/expenses/getExpenses?userId=' + userId);
          const data = await response.json();
          if (response.ok) {
            let totalExpenses = 0;
            for (let i = 0; i < data.length; i++) {
              const currentExpenseDate = new Date(data[i].date);
              if (currentExpenseDate.getMonth() + 1 === month && currentExpenseDate.getFullYear() === date.getFullYear()) {
                totalExpenses += data[i].amount;
              }
            }
            setLastExpenses(totalExpenses);
          } else {
            alert('Error fetching expenses');
            setLastExpenses(0);
          }
        } catch (error) {
          alert('Error fetching expenses');
          setLastExpenses(0);
        }
    }

    const MySavings = async function(userId: string) {
      try {
        const response = await fetch('/api/actions/saving/getSavings?userId=' + userId);
        const data = await response.json();
        if (response.ok) {
          let savings: Savings[] = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].status === 'active' || data[i].status === 'completed') {
              savings.push({
                name: data[i].name || '',
                currentAmount: data[i].currentAmount || 0,
                status: data[i].status || '',
              });
            }
          }
          setSavingsBalance(savings);
        } else {
          alert('Error fetching savings');
        }
      } catch (error) {
        alert('Error fetching savings');
      }
    }

    const showTransactions = async function(userId: string) {
      try {
        const incomes = await fetch('/api/actions/movements/incomes/getIncomes?userId=' + userId);
        const expenses = await fetch('/api/actions/movements/expenses/getExpenses?userId=' + userId);
        const incomesData = await incomes.json();
        const expensesData = await expenses.json();
        if(incomes.ok && expenses.ok) {
          setTransactions([
            ...incomesData.map((income: { category: string; amount: number; date: string; description: string }) => ({
              type: 'income',
              category: income.category,
              amount: income.amount,
              date: income.date,
            })),
            ...expensesData.map((expense: { category: string; amount: number; date: string; description: string }) => ({
              type: 'expense',
              category: expense.category,
              amount: expense.amount,
              date: expense.date,
            })),
          ]);
        } else {
          alert('Error fetching transactions');
        }
      } catch (error) {
        alert('Error fetching transactions');
      }
    }

    useEffect(() => {
      showData();
    }, []);

    useEffect(() => {
      if (userInfo && userInfo.id && userInfo.id !== '') {
        thisMonthIncome(userInfo.id);
        thisMonthExpenses(userInfo.id);
        MySavings(userInfo.id);
      }
    }, [userInfo]);

    useEffect(() => {
      if (savingsBalance.length > 0) {
        const interval = setInterval(() => {
          setCurrentSavingsIndex((prev) => (prev + 1) % savingsBalance.length);
        }, 3000);
        return () => clearInterval(interval);
      } else {
        setCurrentSavingsIndex(0);
      }
    }, [savingsBalance]);

    useEffect(() => {
      if (userInfo && userInfo.id && userInfo.id !== '') {
        showTransactions(userInfo.id);
      }
    }, [transactions.length, userInfo]);

  return (
    <section className="md:grid md:grid-cols-[320px_1fr]">
        <aside>
          <Aside />
        </aside>
      {/*<header className="bg-[#0F1729] h-20 top-0 w-full flex items-center border-b border-[#222F44]">
        <button className="hover:bg-purple-600 h-5 transition-colors duration-300 border-none rounded-md px-1 py-5 text-white items-center justify-center flex ml-4" >
          <img src="/menu.svg" alt="" className="w-5"/>
        </button>
      </header>*/}
      <section className="w-full h-full">
        <Header />
      <main className="bg-[#0F1729] w-full h-full ml-auto">
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">Your financial overview</p>
          </div>
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg text-lg flex items-center gap-2 shadow-md">
            <span className="text-2xl leading-none">+</span> Add Transaction
          </button>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 pb-4">
          {/* Balance */}
          <div className="rounded-xl border border-[#232c3b] bg-linear-to-br from-[#181f32] to-[#232c3b] p-6 flex items-center justify-between shadow-md">
            <div>
              <p className="text-white/70 text-base mb-1">Balance</p>
              {userInfo === null ? (
                <SkeletonMenu />
              ) : (
                <p className="text-3xl font-bold text-white">{balance < 0 ? '-' : ''}${Math.abs(balance).toFixed(2)}</p>
              )}
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#232c3b]">
              <img src="./wallet.svg" alt="" className="w-7 h-7" draggable="false" />
            </div>
          </div>
          {/* Income */}
          <div className="rounded-xl border border-[#1e3a2f] bg-linear-to-br from-[#113F33] to-[#1e3a2f] p-6 flex items-center justify-between shadow-md">
            <div>
              <p className="text-white/70 text-base mb-1">Income</p>
              {userInfo === null ? (
                <SkeletonMenu />
              ) : (
                <p className="text-3xl font-bold text-white">${lastIncomes.toFixed(2)}</p>
              )}
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#1e3a2f]">
              <img src="./statistic-grow.svg" alt="" className="w-7 h-7" draggable="false" />
            </div>
          </div>
          {/* Expenses */}
          <div className="rounded-xl border border-[#4C232F] bg-linear-to-br from-[#4C232F] to-[#6b2737] p-6 flex items-center justify-between shadow-md">
            <div>
              <p className="text-white/70 text-base mb-1">Expenses</p>
              {userInfo === null ? (
                <SkeletonMenu />
              ) : (
                <p className="text-3xl font-bold text-white">${lastExpenses.toFixed(2)}</p>
              )}
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#4C232F]">
              <img src="./statistic-low.svg" alt="" className="w-7 h-7" draggable="false" />
            </div>
          </div>
          {/* Savings */}
          <div className="rounded-xl border border-[#281C5B] bg-linear-to-br from-[#281C5B] to-[#6b26d9] p-6 flex items-center justify-between shadow-md">
            <div>
              <p className="text-white/70 text-base mb-1">Savings</p>
              {userInfo === null ? (
                <SkeletonMenu />
              ) : savingsBalance.length === 0 ? (
                <p className="text-3xl font-bold text-white">$0.00</p>
              ) : (
                <p className="text-3xl font-bold text-white">
                  <AnimatePresence mode="wait">
                    {savingsBalance.length > 0 && savingsBalance[currentSavingsIndex] ? (
                      <motion.span
                        key={savingsBalance[currentSavingsIndex].name + currentSavingsIndex}
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 0, opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ display: "inline-block" }}
                      >
                        {`$${savingsBalance[currentSavingsIndex].currentAmount.toFixed(2)}`}
                      </motion.span>
                    ) : (
                      <motion.span
                        key="no-savings"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 0, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ display: "inline-block" }}
                      >
                        $0.00
                      </motion.span>
                    )}
                  </AnimatePresence>
                </p>
              )}
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#281C5B]">
              <img src="./saving.svg" alt="" className="w-7 h-7" draggable="false" />
            </div>
          </div>
        </section>
        <section className="mx-auto w-[90%] md:w-[97%] flex flex-col gap-4">
          <div className="bg-[#121B31] w-full h-50 mx-auto rounded-xl border border-gray-500">
            <p className="text-gray-300 font-bold">Expense Breakdown</p>
          </div>
          <div className="bg-[#121B31] w-full h-auto mx-auto rounded-xl border border-gray-500 py-4 px-6">
            <p className="text-gray-300 font-bold">Recent Transactions</p>
            <div>
              {transactions.length === 0 ? (
                <p className="text-gray-500">No transactions found.</p>
              ) : (
                transactions.slice(-10).reverse().map((transaction, index) => (
                  <div key={index} className="flex flex-row justify-between items-center py-2 border-b border-green-500">
                      <div>
                        <p className="text-white font-semibold">{transaction.category}</p>
                        <p className="text-gray-400">
                          {(() => {
                            const [datePart, timePart] = transaction.date.split("T");
                            const time = timePart ? timePart.substring(0, 5) : "";
                            return `${datePart} ${time}`;
                          })()}
                        </p>
                      </div>
                      <div>
                        {transaction.type === "expense" ? (
                          <p className="text-red-500">- ${transaction.amount.toFixed(2)}</p>
                        ) : (
                          <p className="text-green-500">+ ${transaction.amount.toFixed(2)}</p>
                        )}
                      </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
      </section>
    </section>
  )
}