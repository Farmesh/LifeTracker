import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL('/api/auth/google/login', request.url));
}

export async function POST() {
  return NextResponse.json(
    { error: 'Use /api/auth/google/login to start Google sign-in.' },
    { status: 405 }
  );
}
