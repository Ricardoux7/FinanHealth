import { NextResponse } from 'next/server';
import { deleteSaving } from '@/services/saving';

export async function PATCH(req: Request){
  try {
    const body = await req.json();
    const { savingId } = body;
    const result = await deleteSaving(savingId);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}