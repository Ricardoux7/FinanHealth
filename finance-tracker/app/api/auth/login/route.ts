
import { NextResponse } from 'next/server';
import { loginUser } from '@/services/login';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await loginUser(body);
    const userId = result.user && (result.user.id);
    if (!userId) {
      return NextResponse.json({ message: "User ID not found" }, { status: 500 });
    }
    const cookieStore = await cookies();
    cookieStore.set('session_token', userId.toString(), {
      maxAge: 60 * 60 * 24,
      path: '/',
    });
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}
