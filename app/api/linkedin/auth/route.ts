import { NextRequest, NextResponse } from 'next/server';
import { linkedInAPI } from '@/lib/linkedin';

export async function GET(request: NextRequest) {
  try {
    const authUrl = linkedInAPI.getAuthUrl();
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('LinkedIn auth error:', error);
    return NextResponse.json({ error: 'Failed to initiate LinkedIn authentication' }, { status: 500 });
  }
} 