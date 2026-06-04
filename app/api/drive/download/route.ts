import { NextRequest, NextResponse } from 'next/server';
import { downloadJsonFile } from '@/lib/server/googleDrive';

export async function GET(request: NextRequest) {
  try {
    const filename = request.nextUrl.searchParams.get('filename');

    if (!filename) {
      return NextResponse.json({ error: 'filename is required' }, { status: 400 });
    }

    const data = await downloadJsonFile(filename);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Download error:', error);
    const status =
      error instanceof Error && error.name === 'UnauthorizedError'
        ? 401
        : error instanceof Error && error.name === 'FileNotFoundError'
          ? 404
          : 500;

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Download failed' },
      { status }
    );
  }
}
