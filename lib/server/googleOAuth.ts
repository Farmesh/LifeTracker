import { randomBytes } from 'crypto';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

type GoogleTokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
};

type GoogleUserInfo = {
  id: string;
  email: string;
  name: string;
  picture?: string;
};

type GoogleErrorResponse = {
  error?: string;
  error_description?: string;
};

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getAppUrl(): string {
  return requireEnv('NEXT_PUBLIC_APP_URL').replace(/\/$/, '');
}

export function getGoogleRedirectUri(): string {
  return `${getAppUrl()}/api/auth/google/callback`;
}

export function createOAuthState(): string {
  return randomBytes(32).toString('base64url');
}

export function createGoogleAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: requireEnv('NEXT_PUBLIC_GOOGLE_CLIENT_ID'),
    redirect_uri: getGoogleRedirectUri(),
    response_type: 'code',
    scope: [
      'openid',
      'email',
      'profile',
      'https://www.googleapis.com/auth/drive.appdata',
    ].join(' '),
    access_type: 'offline',
    prompt: 'consent',
    state,
  });

  return `${GOOGLE_AUTH_URL}?${params}`;
}

async function parseGoogleAuthError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as GoogleErrorResponse;
    return data.error_description || data.error || response.statusText;
  } catch {
    return response.statusText;
  }
}

export async function exchangeCodeForTokens(code: string): Promise<GoogleTokenResponse> {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: requireEnv('NEXT_PUBLIC_GOOGLE_CLIENT_ID'),
      client_secret: requireEnv('GOOGLE_CLIENT_SECRET'),
      redirect_uri: getGoogleRedirectUri(),
      grant_type: 'authorization_code',
      code,
    }),
  });

  if (!response.ok) {
    throw new Error(await parseGoogleAuthError(response));
  }

  return (await response.json()) as GoogleTokenResponse;
}

export async function fetchGoogleUser(accessToken: string): Promise<GoogleUserInfo> {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(await parseGoogleAuthError(response));
  }

  return (await response.json()) as GoogleUserInfo;
}
