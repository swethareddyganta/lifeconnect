import { NextRequest, NextResponse } from 'next/server';
import { linkedInAPI } from '@/lib/linkedin';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { text, visibility = 'PUBLIC' } = await request.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Get the current user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user?.linkedinToken) {
      return NextResponse.json({ error: 'LinkedIn not connected' }, { status: 400 });
    }

    // Share post on LinkedIn
    await linkedInAPI.sharePost(user.linkedinToken, text, visibility);

    return NextResponse.json({ success: true, message: 'Post shared successfully' });
  } catch (error) {
    console.error('LinkedIn share error:', error);
    return NextResponse.json({ error: 'Failed to share on LinkedIn' }, { status: 500 });
  }
} 