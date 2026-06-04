import { getSession } from '@/lib/server/session';

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_DRIVE_FILES_URL = 'https://www.googleapis.com/drive/v3/files';
const GOOGLE_DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files';

type DriveFile = {
  id: string;
  name: string;
  modifiedTime?: string;
  size?: string;
};

type DriveListResponse = {
  files?: DriveFile[];
};

type GoogleErrorResponse = {
  error?: {
    message?: string;
  };
};

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

async function parseGoogleError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as GoogleErrorResponse;
    return data.error?.message || response.statusText;
  } catch {
    return response.statusText;
  }
}

async function requestGoogle<T>(url: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(url, init);

  if (!response.ok) {
    throw new Error(await parseGoogleError(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function getGoogleAccessToken(refreshToken: string): Promise<string> {
  const params = new URLSearchParams({
    client_id: requireEnv('NEXT_PUBLIC_GOOGLE_CLIENT_ID'),
    client_secret: requireEnv('GOOGLE_CLIENT_SECRET'),
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });

  const data = await requestGoogle<{ access_token: string }>(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  return data.access_token;
}

async function getSessionAccessToken(): Promise<string> {
  const session = await getSession();

  if (!session) {
    const error = new Error('You must be signed in to use Google Drive sync.');
    error.name = 'UnauthorizedError';
    throw error;
  }

  return getGoogleAccessToken(session.refreshToken);
}

function escapeDriveQueryValue(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

export async function findDriveFile(filename: string, accessToken: string): Promise<DriveFile | null> {
  const params = new URLSearchParams({
    q: `name='${escapeDriveQueryValue(filename)}' and 'appDataFolder' in parents and trashed=false`,
    spaces: 'appDataFolder',
    fields: 'files(id,name,modifiedTime,size)',
    pageSize: '1',
  });

  const data = await requestGoogle<DriveListResponse>(`${GOOGLE_DRIVE_FILES_URL}?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data.files?.[0] || null;
}

export async function listDriveFiles(): Promise<DriveFile[]> {
  const accessToken = await getSessionAccessToken();
  const params = new URLSearchParams({
    spaces: 'appDataFolder',
    fields: 'files(id,name,modifiedTime,size)',
    pageSize: '100',
  });

  const data = await requestGoogle<DriveListResponse>(`${GOOGLE_DRIVE_FILES_URL}?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data.files || [];
}

export async function uploadJsonFile(filename: string, content: unknown): Promise<DriveFile> {
  const accessToken = await getSessionAccessToken();
  const existingFile = await findDriveFile(filename, accessToken);
  const metadata = existingFile
    ? { name: filename, mimeType: 'application/json' }
    : { name: filename, mimeType: 'application/json', parents: ['appDataFolder'] };

  const formData = new FormData();
  formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  formData.append('file', new Blob([JSON.stringify(content)], { type: 'application/json' }));

  const url = existingFile
    ? `${GOOGLE_DRIVE_UPLOAD_URL}/${existingFile.id}?uploadType=multipart&fields=id,name,modifiedTime,size`
    : `${GOOGLE_DRIVE_UPLOAD_URL}?uploadType=multipart&fields=id,name,modifiedTime,size`;

  return requestGoogle<DriveFile>(url, {
    method: existingFile ? 'PATCH' : 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });
}

export async function downloadJsonFile(filename: string): Promise<unknown> {
  const accessToken = await getSessionAccessToken();
  const file = await findDriveFile(filename, accessToken);

  if (!file) {
    const error = new Error(`File not found: ${filename}`);
    error.name = 'FileNotFoundError';
    throw error;
  }

  return requestGoogle<unknown>(`${GOOGLE_DRIVE_FILES_URL}/${file.id}?alt=media`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function deleteDriveFile(filename: string): Promise<boolean> {
  const accessToken = await getSessionAccessToken();
  const file = await findDriveFile(filename, accessToken);

  if (!file) {
    return false;
  }

  await requestGoogle<void>(`${GOOGLE_DRIVE_FILES_URL}/${file.id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return true;
}
