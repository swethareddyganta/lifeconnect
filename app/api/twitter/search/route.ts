import { NextRequest, NextResponse } from 'next/server';
import { twitterAPI } from '@/lib/twitter';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const maxResults = parseInt(searchParams.get('max_results') || '10');

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const tweets = await twitterAPI.searchTweets(query, maxResults);

    return NextResponse.json({ tweets });
  } catch (error) {
    console.error('Twitter search error:', error);
    return NextResponse.json({ error: 'Failed to search Twitter' }, { status: 500 });
  }
} 