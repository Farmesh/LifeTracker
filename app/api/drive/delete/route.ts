import { NextRequest, NextResponse } from 'next/server';
import { deleteDriveFile } from '@/lib/server/googleDrive';

export async function DELETE(request: NextRequest) {
  try {
    const filename = request.nextUrl.searchParams.get('filename');

    if (!filename) {
      return NextResponse.json({ error: 'filename is required' }, { status: 400 });
    }

    const deleted = await deleteDriveFile(filename);

    if (!deleted) {
      return NextResponse.json({ error: `File not found: ${filename}` }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete file error:', error);
    const status = error instanceof Error && error.name === 'UnauthorizedError' ? 401 : 500;

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete file' },
      { status }
    );
  }
}
