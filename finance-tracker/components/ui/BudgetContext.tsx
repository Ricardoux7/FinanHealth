
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
	fetchBudgets: (userId: string) => Promise<void>;
	addBudget: (userId: string, budgetData: Partial<Budget>) => Promise<void>;
	updateBudget: (budgetId: string, updateData: Partial<Budget>) => Promise<void>;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [budgets, setBudgets] = useState<Budget[]>([]);

	const fetchBudgets = useCallback(async (userId: string) => {
		try {
			const response = await fetch(`/api/actions/budget?userId=${userId}`);
			const data = await response.json();
			if (response.ok) {
				setBudgets(data.data);
			} else {
				alert('Error fetching budgets');
			}
		} catch (error) {
			alert('Error fetching budgets');
		}
	}, []);

	const addBudget = useCallback(async (userId: string, budgetData: Partial<Budget>) => {
		try {
			const response = await fetch('/api/actions/budget', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...budgetData, userId })
			});
			if (response.ok) {
				await fetchBudgets(userId);
			} else {
				const data = await response.json();
				alert(data.message || 'Error adding budget');
			}
		} catch (error) {
			alert('Error adding budget');
		}
	}, [fetchBudgets]);

	const updateBudget = useCallback(async (budgetId: string, updateData: Partial<Budget>) => {
		try {
			const response = await fetch(`/api/actions/budget/${budgetId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updateData)
			});
			if (response.ok) {
			} else {
				const data = await response.json();
				alert(data.message || 'Error updating budget');
			}
		} catch (error) {
			alert('Error updating budget');
		}
	}, []);

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
