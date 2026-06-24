import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'change-this-secret-in-production-min-32-chars!!'
);

async function isValidSession(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, SECRET_KEY);
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get('session_token');
  const protectedPaths = ['/home', '/dashboard', '/transactions', '/budgets', '/savings', '/stats'];
  const isProtected = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));
  const isAuthPage = ['/login', '/register'].includes(request.nextUrl.pathname);

  const valid = sessionCookie ? await isValidSession(sessionCookie.value) : false;

  if (!valid && isProtected) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    if (sessionCookie) response.cookies.delete('session_token');
    return response;
  }

  if (valid && isAuthPage) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/home/:path*', '/dashboard/:path*', '/transactions/:path*', '/budgets/:path*', '/savings/:path*', '/stats/:path*', '/login', '/register'],
};