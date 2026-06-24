import dbConnect from '@/lib/mongodb';
import Budget from '@/models/budget';
import { NextResponse } from 'next/server';
import { Types } from 'mongoose';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/session';

async function getVerifiedUserId(): Promise<Types.ObjectId> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token');
  if (!sessionToken) throw new Error('User is not authenticated');
  const userId = await verifySession(sessionToken.value);
  if (!userId) throw new Error('Invalid or expired session');
  try {
    return new Types.ObjectId(userId);
  } catch {
    throw new Error('Invalid userId format');
  }
}

export async function addBudget(budgetData: any, response: any) {
  await dbConnect();
  const objectUserId = await getVerifiedUserId();
  const { name, limit, currentSpent } = budgetData;

  if (!name || limit === undefined) throw new Error('Missing required fields');
  if (limit <= 0) throw new Error('Limit must be positive');

  const existingBudget = await Budget.findOne({ userId: objectUserId, name });
  if (existingBudget) throw new Error('Budget with the same name already exists');

  const newBudget = new Budget({
    name,
    limit,
    currentSpent: currentSpent || 0,
    userId: objectUserId,
    startDate: new Date(),
    endDate: null,
    status: 'active',
  });
  const savedBudget = await newBudget.save();
  return NextResponse.json(savedBudget, { status: 201 });
}

export async function getBudgets(tokenOrId?: string) {
  await dbConnect();
  const objectUserId = await getVerifiedUserId();
  const budgets = await Budget.find({ userId: objectUserId }).lean();
  return NextResponse.json({ data: budgets });
}

export async function updateBudget(budgetId: string, updateData: any) {
  await dbConnect();
  let objectBudgetId;
  try {
    objectBudgetId = new Types.ObjectId(budgetId);
  } catch {
    throw new Error('Invalid budgetId format');
  }
  const updatedBudget = await Budget.findOneAndUpdate(
    { _id: objectBudgetId },
    updateData,
    { new: true }
  );
  if (!updatedBudget) throw new Error('Budget not found');
  return NextResponse.json(updatedBudget);
}
