import dbConnect from '@/lib/mongodb';
import expenses from '@/models/expenses';
import Expense  from '@/models/expenses';
import User from '@/models/users';
import { cookies } from 'next/headers';

export async function addExpense(expenseData: any) {
  await dbConnect();

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token');
  const { userId, amount, category, source, description, date, type } = expenseData;

  if (!sessionToken) {
    throw new Error('User is not authenticated');
  }

  const newExpense = new Expense({
    userId: sessionToken.value,
    amount,
    category,
    source,
    description,
    date: date ? new Date(date) : new Date(),
    type: type === 'budget' ? 'budget' : 'casual'
  });

  const user = await User.findById(sessionToken.value);
  if (!user) {
    throw new Error('User not found');
  }
  if(user.balance < amount) {
    throw new Error('Insufficient balance');
  }
  user.balance -= amount;
  await user.save();
  const savedExpense = await newExpense.save();
  return savedExpense;
}

export async function getExpensesByUserId(userId: string) {
  await dbConnect();

  const expenses = await Expense.find({ userId }).sort({ date: -1 });
  return expenses;
}