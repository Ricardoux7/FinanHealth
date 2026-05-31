import dbConnect from '@/lib/mongodb';
import Savings  from '@/models/savings';
import { cookies } from 'next/headers';

export async function addSaving(savingData: any){
  await dbConnect();

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token');
  if (!sessionToken) {
    throw new Error('User is not authenticated');
  }
  const { name, targetAmount, currentAmount, targetDate, status } = savingData;

  const newSaving = new Savings({
    userId: sessionToken.value,
    name,
    targetAmount,
    currentAmount: currentAmount ?? 0,
    targetDate,
    status: status || 'active' 
  });

  const savedSaving = await newSaving.save();
  return savedSaving;
}

export async function addAmount(savingId: string, amountToAdd: number){
  await dbConnect();
  
  const saving = await Savings.findById(savingId);
  if(!saving){
    throw new Error('Saving not found');
  }
  if(saving.status === 'abandoned'){
    throw new Error('Cannot add amount to an abandoned saving');
  }

  if(amountToAdd < 0){
    throw new Error('Amount to add must be positive');
  }else if(saving.currentAmount + amountToAdd > saving.targetAmount && saving.status === 'completed'){
    throw new Error('Cannot add amount as it exceeds the target amount for a completed saving');
  }

  saving.currentAmount += amountToAdd;
  if(saving.currentAmount >= saving.targetAmount){
    saving.status = 'completed';
  }
  const updatedSaving = await saving.save();
  return updatedSaving;
}

export async function deleteSaving(savingId: string){
  await dbConnect();
  const deletedSaving = await Savings.findByIdAndUpdate(savingId);
  deletedSaving.status = 'abandoned';
  await deletedSaving.save();
  return deletedSaving;
}

export async function getSavingsByUserId(userId: string){
  await dbConnect();
  const savings = await Savings.find({ userId }).sort({ targetDate: 1 });
  return savings;
}