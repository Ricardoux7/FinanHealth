import { NextResponse } from 'next/server';
import { registerUser } from '@/services/register';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await registerUser(body);
    return NextResponse.json({ message: result.message }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}