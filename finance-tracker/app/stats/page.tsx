'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Header, AddTransaction } from "@/components/ui/components";
import Aside from "@/components/ui/components";
import BarChart from "@/components/ui/BarChart";
import PieChartExpenses, { PieChartIncomes } from "@/components/ui/PieChart";

import { AnimatePresence, motion } from "framer-motion";
import SavingPageContent from "@/components/ui/SavingPageContent";
import { SavingProvider } from "@/components/ui/SavingContext";
import { Pie } from "react-chartjs-2";

export default function statsPage(){
  const [userInfo, setUserInfo] = useState<{ id: string }| null>(null);
  const [savings, setSavings] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>();
  const [incomes, setIncomes] = useState<any[]>();
  const [categoriesIncomes, setCategoriesIncomes] = useState<string[]>([]);
  const [categoriesExpenses, setCategoriesExpenses] = useState<string[]>([]);
  const [amountsIncomes, setAmountsIncomes] = useState<number[]>([]);
  const [amountsExpenses, setAmountsExpenses] = useState<number[]>([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number[]>(Array(12).fill(0));
  const [monthlyIncomes, setMonthlyIncomes] = useState<number[]>(Array(12).fill(0));
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

  /*const showSavings = async function(userId: string) {
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
  }*/

  const showExpenses = async function(userId: string) {
    try {
      const response = await fetch(`/api/actions/movements/expenses/getExpenses?userId=${userId}`);
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setExpenses(data);
        const categories = [...new Set(data.map((expense: any) => expense.category))];
        const amounts = categories.map(category => {
          return data.filter((expense: any) => expense.category === category)
                     .reduce((sum: number, expense: any) => sum + expense.amount, 0);
        });
        setCategoriesExpenses(categories);
        setAmountsExpenses(amounts);
        const monthly = Array(12).fill(0);
        data.forEach((expense: any) => {
          const date = new Date(expense.date);
          const month = date.getMonth(); // 0 = enero
          monthly[month] += expense.amount;
        });
        setMonthlyExpenses(monthly);
      } else {
        alert('Error fetching expenses');
      }
    } catch (error) {
      alert('Error fetching expenses');
    }
  }

  const showIncomes = async function(userId: string) {
    try {
      const response = await fetch(`/api/actions/movements/incomes/getIncomes?userId=${userId}`);
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setIncomes(data);
        const categories = [...new Set(data.map((income: any) => income.category))];
        const amounts = categories.map(category => {
          return data.filter((income: any) => income.category === category)
                     .reduce((sum: number, income: any) => sum + income.amount, 0);
        });
        setCategoriesIncomes(categories);
        setAmountsIncomes(amounts);
        const monthly = Array(12).fill(0);
        data.forEach((income: any) => {
          const date = new Date(income.date);
          const month = date.getMonth();
          monthly[month] += income.amount;
        });
        setMonthlyIncomes(monthly);
      } else {
        alert('Error fetching incomes');
      }
    } catch (error) {
      alert('Error fetching incomes');
    }
  }

  useEffect(() => {
    showData();
  }, []);

  useEffect(() => {
    if (userInfo?.id) {
      showExpenses(userInfo.id);
      showIncomes(userInfo.id);
    }
  }, [userInfo]);

  const barLabels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <section className="md:grid md:grid-cols-[320px_1fr] min-h-full">
      <aside>
        <Aside />
      </aside>
      <section>
        <Header />
        <main className="bg-[#0f1729] h-full p-8">
          <h1 className="text-white font-bold text-2xl mb-4">Statistics</h1>
          <div className="bg-[#121B31] rounded-xl p-6 shadow-lg w-full max-w-xl mx-auto">
            <h2 className="text-white text-lg font-semibold mb-2">Movements by month</h2>
            <BarChart labels={barLabels} expenses={monthlyExpenses} incomes={monthlyIncomes} />
          </div>
          <section className="w-full max-w-4xl mx-auto mt-8 flex flex-col gap-6 justify-center">
            <p className="text-white text-center">Expenses by Category</p>
            <PieChartExpenses labels={categoriesExpenses} amounts={amountsExpenses} />
            <p className="text-white text-center">Incomes by Category</p>
            <PieChartIncomes labels={categoriesIncomes} amounts={amountsIncomes} />
          </section>
        </main>
      </section>
    </section>
  );
}