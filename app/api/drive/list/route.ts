import { NextResponse } from 'next/server';
import { listDriveFiles } from '@/lib/server/googleDrive';

export async function GET() {
  try {
    const files = await listDriveFiles();

    return NextResponse.json({ files });
  } catch (error) {
    console.error('List files error:', error);
    const status = error instanceof Error && error.name === 'UnauthorizedError' ? 401 : 500;

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to list files' },
      { status }
    );
  }
}
