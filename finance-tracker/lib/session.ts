import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'change-this-secret-in-production-min-32-chars!!'
);

const ALGORITHM = 'HS256';
const EXPIRATION = '24h';

export async function signSession(userId: string): Promise<string> {
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(EXPIRATION)
    .sign(SECRET_KEY);
}

export async function verifySession(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload.userId as string;
  } catch {
    return null;
  }
}
