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
  fetchSavings: (userId: string) => Promise<void>;
  addSaving: (userId: string, savingData: Partial<Saving>) => Promise<void>;
  updateSaving: (savingId: string, userId: string, updateData: Partial<Saving>) => Promise<void>;
}

const SavingContext = createContext<SavingContextType | undefined>(undefined);

export const SavingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savings, setSavings] = useState<Saving[]>([]);

  const fetchSavings = useCallback(async (userId: string) => {
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
  }, []);

  const addSaving = useCallback(async (userId: string, savingData: Partial<Saving>) => {
    try {
      const response = await fetch('/api/actions/saving', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...savingData, userId }),
      });
      if (response.ok) {
        await fetchSavings(userId);
      } else {
        const data = await response.json();
        alert(data.message || 'Error adding saving');
      }
    } catch (error) {
      alert('Error adding saving');
    } finally {
      setSavings((prevSavings) => {
        if (prevSavings) {
          return [...prevSavings, savingData as Saving];
        } else {
          return [savingData as Saving];
        }
      });
    }
  }, []);

  const updateSaving = useCallback(async (savingId: string, userId: string, updateData: Partial<Saving>) => {
    try {
      const response = await fetch('/api/actions/saving/${savingId}', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      if (response.ok) {
        await fetchSavings(userId);
      } else {
        const data = await response.json();
        alert(data.message || 'Error updating saving');
      }
    } catch (error) {
      alert('Error updating saving');
    } finally {
      setSavings((prevSavings) =>
        prevSavings.map((saving) => {
          if (saving._id === savingId) {
            return { ...saving, ...updateData };
          } else {
            return saving;  
          }
        }
      ));
    }
  }, []);

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