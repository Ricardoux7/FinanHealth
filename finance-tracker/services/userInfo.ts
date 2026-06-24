import dbConnect from '@/lib/mongodb';
import User from '@/models/users';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/session';

export async function getUserInfo() {
  await dbConnect();
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token');
  if (!sessionToken) {
    throw new Error('User is not authenticated');
  }
  const userId = await verifySession(sessionToken.value);
  if (!userId) {
    throw new Error('Invalid or expired session');
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    balance: user.balance,
    categories: user.categories,
  };
}
