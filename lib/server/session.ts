import { cookies } from 'next/headers';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  picture?: string;
};

export type AppSession = {
  user: SessionUser;
  refreshToken: string;
};

const SESSION_COOKIE = 'tracker_session';
const STATE_COOKIE = 'tracker_oauth_state';
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
const STATE_MAX_AGE = 60 * 10;

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

function getSessionSecret(): Buffer {
  const secret = process.env.NEXTAUTH_SECRET;

  if (!secret) {
    throw new Error('Missing required environment variable: NEXTAUTH_SECRET');
  }

  return createHash('sha256').update(secret).digest();
}

function encryptSession(session: AppSession): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', getSessionSecret(), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(session), 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([iv, tag, encrypted]).toString('base64url');
}

function decryptSession(value: string): AppSession {
  const payload = Buffer.from(value, 'base64url');
  const iv = payload.subarray(0, 12);
  const tag = payload.subarray(12, 28);
  const encrypted = payload.subarray(28);
  const decipher = createDecipheriv('aes-256-gcm', getSessionSecret(), iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return JSON.parse(decrypted.toString('utf8')) as AppSession;
}

export async function setSessionCookie(session: AppSession): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, encryptSession(session), {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction(),
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export async function getSession(): Promise<AppSession | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_COOKIE)?.value;

  if (!value) {
    return null;
  }

  try {
    return decryptSession(value);
  } catch {
    cookieStore.delete(SESSION_COOKIE);
    return null;
  }
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function setOAuthStateCookie(state: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction(),
    path: '/',
    maxAge: STATE_MAX_AGE,
  });
}

export async function consumeOAuthStateCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(STATE_COOKIE)?.value || null;
  cookieStore.delete(STATE_COOKIE);
  return value;
}
