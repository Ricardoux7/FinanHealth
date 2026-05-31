import { NextResponse } from 'next/server';
import { getUserInfo } from '@/services/userInfo';

export async function GET() {
  try {
    const userInfo = await getUserInfo();
    return NextResponse.json(userInfo, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}