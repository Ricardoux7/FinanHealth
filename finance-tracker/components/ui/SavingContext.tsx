import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Saving {
  _id?: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
  targetDate: string;
  status: string;
}

interface SavingContextType {
  savings: Saving[];
  fetchSavings: () => Promise<void>;
  addSaving: (savingData: Partial<Saving>) => Promise<void>;
  updateSaving: (savingId: string, updateData: Partial<Saving>) => Promise<void>;
}

const SavingContext = createContext<SavingContextType | undefined>(undefined);

export const SavingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savings, setSavings] = useState<Saving[]>([]);

  // Sin userId — lo lee el servidor desde la sesión
  const fetchSavings = useCallback(async () => {
    try {
      const response = await fetch('/api/actions/saving/getSavings');
      const data = await response.json();
      if (response.ok) {
        setSavings(data);
      } else {
        console.error('Error fetching savings:', data.message);
      }
    } catch (error) {
      console.error('Error fetching savings:', error);
    }
  }, []);

  const addSaving = useCallback(async (savingData: Partial<Saving>) => {
    try {
      const response = await fetch('/api/actions/saving', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(savingData),
      });
      if (response.ok) {
        await fetchSavings();
      } else {
        const data = await response.json();
        console.error('Error adding saving:', data.message);
      }
    } catch (error) {
      console.error('Error adding saving:', error);
    }
  }, [fetchSavings]);

  const updateSaving = useCallback(async (savingId: string, updateData: Partial<Saving>) => {
    try {
      // Fix: template string con backticks correctos
      const response = await fetch(`/api/actions/saving/${savingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (response.ok) {
        await fetchSavings();
      } else {
        const data = await response.json();
        console.error('Error updating saving:', data.message);
      }
    } catch (error) {
      console.error('Error updating saving:', error);
    }
  }, [fetchSavings]);

  return (
    <SavingContext.Provider value={{ savings, fetchSavings, addSaving, updateSaving }}>
      {children}
    </SavingContext.Provider>
  );
};

export function useSaving() {
  const context = useContext(SavingContext);
  if (!context) {
    throw new Error('useSaving must be used within a SavingProvider');
  }
  return context;
}
