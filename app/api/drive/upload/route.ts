import { NextRequest, NextResponse } from 'next/server';
import { uploadJsonFile } from '@/lib/server/googleDrive';

export async function POST(request: NextRequest) {
  try {
    const { filename, content } = await request.json();

    if (!filename || typeof filename !== 'string') {
      return NextResponse.json({ error: 'filename is required' }, { status: 400 });
    }

    const file = await uploadJsonFile(filename, content);

    return NextResponse.json({
      success: true,
      file,
    });
  } catch (error) {
    console.error('Upload error:', error);
    const status = error instanceof Error && error.name === 'UnauthorizedError' ? 401 : 500;

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status }
    );
  }
}
