import { NextResponse } from 'next/server';
import { createGoogleAuthUrl, createOAuthState } from '@/lib/server/googleOAuth';
import { setOAuthStateCookie } from '@/lib/server/session';

export async function GET() {
  const state = createOAuthState();
  await setOAuthStateCookie(state);

  return NextResponse.redirect(createGoogleAuthUrl(state));
}
