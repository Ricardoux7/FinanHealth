import Savings from '@/models/savings';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/session';
import dbConnect from '@/lib/mongodb';

export async function addSaving(savingData: any) {
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
  const { name, targetAmount, currentAmount, targetDate, status } = savingData;
  const newSaving = new Savings({
    userId,
    name,
    targetAmount,
    currentAmount: currentAmount ?? 0,
    targetDate,
    status: status || 'active',
  });
  return await newSaving.save();
}

export async function addAmount(savingId: string, amountToAdd: number) {
  await dbConnect();
  const saving = await Savings.findById(savingId);
  if (!saving) {
    throw new Error('Saving not found');
  }
  if (saving.status === 'abandoned') {
    throw new Error('Cannot add amount to an abandoned saving');
  }
  if (amountToAdd < 0) {
    throw new Error('Amount to add must be positive');
  }
  if (saving.status === 'completed' && saving.currentAmount + amountToAdd > saving.targetAmount) {
    throw new Error('Cannot add amount as it exceeds the target amount for a completed saving');
  }
  saving.currentAmount += amountToAdd;
  if (saving.currentAmount >= saving.targetAmount) {
    saving.status = 'completed';
  }
  return await saving.save();
}

export async function deleteSaving(savingId: string) {
  await dbConnect();
  // Fix: findById + save en lugar de findByIdAndUpdate sin argumentos
  const saving = await Savings.findById(savingId);
  if (!saving) {
    throw new Error('Saving not found');
  }
  saving.status = 'abandoned';
  return await saving.save();
}

export async function getSavingsByUserId(token: string) {
  await dbConnect();
  const userId = await verifySession(token);
  if (!userId) throw new Error('Invalid or expired session');
  return await Savings.find({ userId }).sort({ targetDate: 1 });
}
