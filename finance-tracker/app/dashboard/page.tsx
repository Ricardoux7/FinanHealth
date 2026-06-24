"use client";
import { useState, useEffect } from "react";
import Aside from "@/components/ui/components";
import { Header } from "@/components/ui/components";

export default function DashboardPage() {
  const [userInfo, setUserInfo] = useState<{ id: string } | null>(null);
  const [transactions, setTransactions] = useState<{ type: string; category: string; amount: number; date: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const showData = async () => {
    try {
      const response = await fetch('/api/auth/userInfo');
      const data = await response.json();
      if (response.ok) {
        setUserInfo(data);
      } else {
        console.error('Error fetching user info');
      }
    } catch (error) {
      console.error('Error fetching user info', error);
    }
  };

  const showTransactions = async () => {
    try {
      const [incomesRes, expensesRes] = await Promise.all([
        fetch('/api/actions/movements/incomes/getIncomes'),
        fetch('/api/actions/movements/expenses/getExpenses'),
      ]);
      const incomesData = await incomesRes.json();
      const expensesData = await expensesRes.json();
      if (incomesRes.ok && expensesRes.ok) {
        const all = [
          ...incomesData.map((i: any) => ({ type: 'income', category: i.category, amount: i.amount, date: i.date })),
          ...expensesData.map((e: any) => ({ type: 'expense', category: e.category, amount: e.amount, date: e.date })),
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setTransactions(all);
      }
    } catch (error) {
      console.error('Error fetching transactions', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    showData();
  }, []);

  useEffect(() => {
    if (userInfo) {
      showTransactions();
    }
  }, [userInfo]);

  return (
    <section className="md:grid md:grid-cols-[320px_1fr]">
      <aside>
        <Aside />
      </aside>
      <section className="w-full h-full">
        <Header />
        <main className="bg-[#0F1729] w-full h-full p-6">
          <h1 className="text-white text-3xl font-bold mb-1">Transactions</h1>
          <p className="text-gray-400 mb-6">All your income and expenses</p>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : transactions.length === 0 ? (
            <p className="text-gray-500">No transactions found.</p>
          ) : (
            <section className="flex flex-col gap-2">
              {transactions.map((transaction, index) => (
                <div key={index} className="bg-[#1E293B] p-4 rounded-xl flex justify-between items-center border border-[#222F44]">
                  <div>
                    <p className="text-white font-semibold">{transaction.category}</p>
                    <p className="text-gray-400 text-sm">
                      {transaction.type === 'income' ? '↑ Income' : '↓ Expense'} ·{' '}
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p className={`font-bold text-lg ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </section>
          )}
        </main>
      </section>
    </section>
  );
}
