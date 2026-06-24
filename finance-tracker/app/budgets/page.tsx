'use client'
import { useState, useEffect } from "react";
import { BudgetProvider } from "@/components/ui/BudgetContext";
import BudgetPageContent from "@/components/ui/BudgetPageContent";

export default function BudgetPage() {
  const [userInfo, setUserInfo] = useState<{ id: string } | null>(null);

  useEffect(() => {
    async function showData() {
      try {
        const response = await fetch('/api/auth/userInfo');
        const data = await response.json();
        if (response.ok) setUserInfo(data);
      } catch (error) {
        console.error('Error fetching user info', error);
      }
    }
    showData();
  }, []);

  return (
    <BudgetProvider>
      <BudgetPageContent />
    </BudgetProvider>
  );
}
