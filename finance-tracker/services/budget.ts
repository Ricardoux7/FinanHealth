import dbConnect from '@/lib/mongodb';
import Budget  from '@/models/budget';
import { NextResponse } from 'next/server';
import { Types } from 'mongoose';

export async function addBudget(budgetData: any, response: any) {
  await dbConnect();

  const {name, limit, userId, currentSpent, startDate, status, endDate} = budgetData;

  let objectUserId;
  try {
    objectUserId = new Types.ObjectId(userId);
  } catch (e) {
    throw new Error('Invalid userId format');
  }

  if(name === undefined || limit === undefined || userId === undefined  ){
    throw new Error('Missing required fields');
  }
  const existingBudget = await Budget.findOne({ userId: objectUserId, name });
  if (existingBudget) {
    throw new Error('Budget with the same name');
  }
  if(limit === currentSpent){
    throw new Error('Budget limit already reached');
  }
  if (limit <= 0){
    throw new Error('Limit must be positive');
  }

  const newBudget = new Budget({
    name,
    limit,
    currentSpent: currentSpent || 0,
    userId: objectUserId,
    startDate: new Date(),
    endDate: null,
    status: 'active'
  });
  const savedBudget = await newBudget.save();
  return NextResponse.json(savedBudget, { status: 201 });
}

export async function getBudgets(userId: string) {
  await dbConnect();

  let objectUserId;
  try {
    objectUserId = new Types.ObjectId(userId);
  } catch (e) {
    return NextResponse.json({ message: 'Invalid userId format' }, { status: 400 });
  }
  const budgets = await Budget.find({ userId: objectUserId }).lean();
  return NextResponse.json({ data: budgets });
}

export async function updateBudget(budgetId: string, updateData: any){
  await dbConnect();

  let objectBudgetId;
  try {
    objectBudgetId = new Types.ObjectId(budgetId);
  } catch (e) {
    throw new Error('Invalid budgetId format');
  }
  const updatedBudget = await Budget.findOneAndUpdate({ _id: objectBudgetId }, updateData, { new: true });
  if (!updatedBudget) {
    throw new Error('Budget not found');
  }
  return NextResponse.json(updatedBudget);
}