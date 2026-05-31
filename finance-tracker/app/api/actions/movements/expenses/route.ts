import { NextResponse } from 'next/server';
import { addExpense } from '@/services/expense';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await addExpense(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}