'use client'
import { useState, useEffect } from "react";
import Aside from "@/components/ui/components";
import { Header } from "@/components/ui/components";
import { SavingProvider } from "@/components/ui/SavingContext";
import SavingPageContent from "@/components/ui/SavingPageContent";

export default function SavingsPage() {
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
    <section className="md:grid md:grid-cols-[320px_1fr] min-h-full">
      <aside><Aside /></aside>
      <section>
        <Header />
        <SavingProvider>
          <SavingPageContent userInfo={userInfo} />
        </SavingProvider>
      </section>
    </section>
  );
}
