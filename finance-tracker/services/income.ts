import Income from '@/models/incomes';
import User from '@/models/users';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/session';
import dbConnect from '@/lib/mongodb';

export async function addIncome(incomeData: any) {
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
  const { amount, category, source, date } = incomeData;
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  if (amount > 9999999999) {
    throw new Error('Amount exceeds the maximum allowed value (9,999,999,999)');
  }
  if (amount <= 0) {
    throw new Error('Amount must be greater than zero');
  }
  const newIncome = new Income({
    userId,
    amount,
    category,
    source,
    date,
  });
  user.balance += amount;
  // Solo agregar la categoría si no existe aún
  if (!user.categories.includes(category)) {
    user.categories.push(category);
  }
  await user.save();
  return await newIncome.save();
}

export async function getIncomesByUserId(token: string) {
  await dbConnect();
  const userId = await verifySession(token);
  if (!userId) throw new Error('Invalid or expired session');
  return await Income.find({ userId }).sort({ date: -1 });
}
