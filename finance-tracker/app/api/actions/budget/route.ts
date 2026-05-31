import { NextResponse } from 'next/server';
import { addBudget, getBudgets, updateBudget } from '@/services/budget';

export async function POST(Req: Request) {
  try {
    const body = await Req.json();
    const result = await addBudget(body, NextResponse);
    return result;
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function GET(Req: Request) {
  try {
    const { searchParams } = new URL(Req.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ message: 'Missing userId parameter' }, { status: 400 });
    }
    return await getBudgets(userId);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(Req: Request){
  try {
    const body = await Req.json();
    const { budgetId, updateData } = body;
    if (!budgetId || !updateData) {
      return NextResponse.json({ message: 'Missing budgetId or updateData' }, { status: 400 });
    }
    const result = await updateBudget(budgetId, updateData);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}