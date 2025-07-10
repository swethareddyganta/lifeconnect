import { NextRequest, NextResponse } from 'next/server';
import { linkedInAPI } from '@/lib/linkedin';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
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

    // Fetch connections from LinkedIn
    const connections = await linkedInAPI.getConnections(user.linkedinToken);

    return NextResponse.json({ connections });
  } catch (error) {
    console.error('LinkedIn connections error:', error);
    return NextResponse.json({ error: 'Failed to fetch LinkedIn connections' }, { status: 500 });
  }
} 