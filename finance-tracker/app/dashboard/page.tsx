"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function DashboardPage() {
  const [userInfo, setUserInfo] = useState<{ id: string }| null>(null);
  const router = useRouter();
  const [transactions, setTransactions] = useState<{ type: string; category: string; amount: number; date: string; }[]>([]);

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
      if (userInfo && userInfo.id && userInfo.id !== '') {
        showTransactions(userInfo.id);
      }
    }, [transactions.length, userInfo]);

    useEffect(() => {
      showData();
    }, []);

  return (
    <body className="bg-[#0F1729]">
      <h1 className="text-white text-3xl font-bold">Transactions</h1>
      <p className="text-gray-400">All your income and expenses</p>
      <section>
        {transactions.map((transaction, index) => (
          <div key={index} className="bg-[#1E293B] p-4 rounded-md mb-2">
            <p className="text-white">{transaction.type === 'income' ? 'Income' : 'Expense'}</p>
            <p className="text-gray-400">{transaction.category}</p>
            <p className="text-white">${transaction.amount.toFixed(2)}</p>
            <p className="text-gray-400">{transaction.date}</p>
          </div>
        ))}
      </section>
    </body>
  )
}