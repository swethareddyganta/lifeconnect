import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const events = await prisma.event.findMany({
      where: { userId: user.id },
      orderBy: { startYear: 'desc' },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { title, location, startYear, endYear, description, type, tags } = await request.json();

    if (!title || !startYear) {
      return NextResponse.json({ error: 'Title and start year are required' }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        title,
        location,
        startYear: parseInt(startYear),
        endYear: endYear ? parseInt(endYear) : null,
        description,
        type,
        tags,
        userId: user.id,
      },
    });

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Failed to create event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
} 