import { NextResponse } from 'next/server';
import { addSaving, addAmount } from '@/services/saving';

export async function POST(req: Request){
  try{
    const body = await req.json();
    const result = await addSaving(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request){
  try {
    const body = await req.json();
    const { savingId, amountToAdd } = body;
    const result = await addAmount(savingId, amountToAdd);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}