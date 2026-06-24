import { NextResponse } from 'next/server';
import { addBudget, getBudgets, updateBudget } from '@/services/budget';
import { cookies } from 'next/headers';

export async function POST(Req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token');
    if (!sessionToken) {
      return NextResponse.json({ message: 'User is not authenticated' }, { status: 401 });
    }
    const body = await Req.json();
    const result = await addBudget({ ...body, userId: sessionToken.value }, NextResponse);
    return result;
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function GET(Req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token');
    if (!sessionToken) {
      return NextResponse.json({ message: 'User is not authenticated' }, { status: 401 });
    }
    return await getBudgets(sessionToken.value);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(Req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token');
    if (!sessionToken) {
      return NextResponse.json({ message: 'User is not authenticated' }, { status: 401 });
    }
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
