import Expense from '@/models/expenses';
import User from '@/models/users';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/session';
import dbConnect from '@/lib/mongodb';

export async function addExpense(expenseData: any) {
  await dbConnect();
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token');
  if (!sessionToken) {
    throw new Error('User is not authenticated');
  }
  const userId = await verifySession(sessionToken.value);
  if (!userId) {
    throw new Error('Invalid or expired session');
  }
  const { amount, category, source, description, date, type } = expenseData;
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  if (user.balance < amount) {
    throw new Error('Insufficient balance');
  }
  const newExpense = new Expense({
    userId,
    amount,
    category,
    source,
    description,
    date: date ? new Date(date) : new Date(),
    type: type === 'budget' ? 'budget' : 'casual',
  });
  user.balance -= amount;
  await user.save();
  return await newExpense.save();
}

export async function getExpensesByUserId(token: string) {
  await dbConnect();
  const userId = await verifySession(token);
  if (!userId) throw new Error('Invalid or expired session');
  return await Expense.find({ userId }).sort({ date: -1 });
}
