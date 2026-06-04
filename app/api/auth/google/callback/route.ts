import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens, fetchGoogleUser, getAppUrl } from '@/lib/server/googleOAuth';
import { consumeOAuthStateCookie, setSessionCookie } from '@/lib/server/session';

export async function GET(request: NextRequest) {
  const appUrl = getAppUrl();
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const savedState = await consumeOAuthStateCookie();

  if (!code || !state || !savedState || state !== savedState) {
    return NextResponse.redirect(`${appUrl}/login?error=oauth_state`);
  }

  try {
    const tokens = await exchangeCodeForTokens(code);

    if (!tokens.refresh_token) {
      return NextResponse.redirect(`${appUrl}/login?error=missing_refresh_token`);
    }

    const user = await fetchGoogleUser(tokens.access_token);
    await setSessionCookie({
      user,
      refreshToken: tokens.refresh_token,
    });

    return NextResponse.redirect(appUrl);
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(`${appUrl}/login?error=oauth_failed`);
  }
}
