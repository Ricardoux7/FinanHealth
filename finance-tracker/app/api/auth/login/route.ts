import { NextResponse } from 'next/server';
import { loginUser } from '@/services/login';
import { signSession } from '@/lib/session';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await loginUser(body);
    const userId = result.user?.id;
    if (!userId) {
      return NextResponse.json({ message: 'User ID not found' }, { status: 500 });
    }
    const token = await signSession(userId.toString());
    const cookieStore = await cookies();
    cookieStore.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });
    return NextResponse.json({ message: result.message, user: result.user }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}
