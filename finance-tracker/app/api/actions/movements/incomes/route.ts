import { NextResponse } from 'next/server';
import { addIncome } from '@/services/income';

export async function POST(req: Request){
  try {
    const body = await req.json();
    const result = await addIncome(body);
    
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}