'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Header, AddTransaction } from "@/components/ui/components";
import Aside from "@/components/ui/components";
import { AnimatePresence, motion } from "framer-motion";
import { div } from "framer-motion/client";
import { BudgetProvider } from "@/components/ui/BudgetContext";
import BudgetPageContent from "@/components/ui/BudgetPageContent";



export default function budgetPage(){
  const [userInfo, setUserInfo] = useState<{ id: string }| null>(null);
  const [showMakeBudget, setShowMakeBudget] = useState(false);
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

  useEffect(() => {
    showData();
  }, []);

  return (
    <BudgetProvider>
      <BudgetPageContent
        userInfo={userInfo}
        setUserInfo={setUserInfo as any}
        showMakeBudget={showMakeBudget}
        setShowMakeBudget={setShowMakeBudget}
      />
    </BudgetProvider>
  );
}