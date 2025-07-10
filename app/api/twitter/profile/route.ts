import { NextRequest, NextResponse } from 'next/server';
import { twitterAPI } from '@/lib/twitter';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const profile = await twitterAPI.getProfile(username);

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Twitter profile error:', error);
    return NextResponse.json({ error: 'Failed to fetch Twitter profile' }, { status: 500 });
  }
} 