import dbConnect from '@/lib/mongodb';
import Income  from '@/models/incomes';
import User from '@/models/users';
import { cookies } from 'next/headers';

export async function addIncome(incomeData: any) {
  await dbConnect();

  const { userId, amount, category, source, date } = incomeData;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token');

  if (!sessionToken) {
    throw new Error('User is not authenticated');
  }

  const newIncome = new Income({
    userId: sessionToken.value,
    amount,
    category,
    source,
    date
  });

  const user = await User.findById(sessionToken.value);
  if (!user) {
    throw new Error('User not found');
  }
  if(amount > 9999999999){
    throw new Error('Amount exceeds the maximum allowed value (9,999,999,999)');
  }
  if(amount <= 0){
    throw new Error('Amount must be greater than zero');
  }
  if(user.categories.includes(category)){
    throw new Error('Category already exists');
  }
  user.balance += amount;
  user.categories.push(category);

  await user.save();

  const savedIncome = await newIncome.save();
  return savedIncome;
}

export async function getIncomesByUserId(userId: string) {
  await dbConnect();

  const incomes = await Income.find({ userId }).sort({ date: -1 });
  return incomes;
}