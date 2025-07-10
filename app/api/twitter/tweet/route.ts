import { NextRequest, NextResponse } from 'next/server';
import { twitterAPI } from '@/lib/twitter';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: 'Tweet text is required' }, { status: 400 });
    }

    // Get the current user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const tweet = await twitterAPI.createTweet(text);

    return NextResponse.json({ 
      success: true, 
      tweet,
      message: 'Tweet posted successfully' 
    });
  } catch (error) {
    console.error('Twitter tweet error:', error);
    return NextResponse.json({ error: 'Failed to post tweet' }, { status: 500 });
  }
} 