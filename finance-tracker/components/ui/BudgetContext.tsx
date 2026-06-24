import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Budget {
  _id?: string;
  name: string;
  limit: number;
  currentSpent: number;
  startDate: string;
  endDate: string | null;
  status: string;
}

interface BudgetContextType {
  budgets: Budget[];
  fetchBudgets: () => Promise<void>;
  addBudget: (budgetData: Partial<Budget>) => Promise<void>;
  updateBudget: (budgetId: string, updateData: Partial<Budget>) => Promise<void>;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);

  // Sin userId — lo lee el servidor desde la sesión
  const fetchBudgets = useCallback(async () => {
    try {
      const response = await fetch('/api/actions/budget');
      const data = await response.json();
      if (response.ok) {
        setBudgets(data.data);
      } else {
        console.error('Error fetching budgets:', data.message);
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  }, []);

  const addBudget = useCallback(async (budgetData: Partial<Budget>) => {
    try {
      const response = await fetch('/api/actions/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budgetData),
      });
      if (response.ok) {
        await fetchBudgets();
      } else {
        const data = await response.json();
        console.error('Error adding budget:', data.message);
      }
    } catch (error) {
      console.error('Error adding budget:', error);
    }
  }, [fetchBudgets]);

  const updateBudget = useCallback(async (budgetId: string, updateData: Partial<Budget>) => {
    try {
      const response = await fetch('/api/actions/budget', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budgetId, updateData }),
      });
      if (!response.ok) {
        const data = await response.json();
        console.error('Error updating budget:', data.message);
      } else {
        await fetchBudgets();
      }
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  }, [fetchBudgets]);

  return (
    <BudgetContext.Provider value={{ budgets, fetchBudgets, addBudget, updateBudget }}>
      {children}
    </BudgetContext.Provider>
  );
};

export function useBudget() {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
}
