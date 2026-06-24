import { NextResponse } from 'next/server';
import { getSavingsByUserId } from '@/services/saving';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token');
    if (!sessionToken) {
      return NextResponse.json({ message: 'User is not authenticated' }, { status: 401 });
    }
    const result = await getSavingsByUserId(sessionToken.value);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}
