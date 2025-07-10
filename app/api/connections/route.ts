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

    // Get all connections where user is either requester or recipient
    const connections = await prisma.connection.findMany({
      where: {
        OR: [
          { requesterId: user.id },
          { recipientId: user.id },
        ],
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ connections });
  } catch (error) {
    console.error('Failed to fetch connections:', error);
    return NextResponse.json({ error: 'Failed to fetch connections' }, { status: 500 });
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

    const { recipientEmail, message } = await request.json();

    if (!recipientEmail) {
      return NextResponse.json({ error: 'Recipient email is required' }, { status: 400 });
    }

    // Find the recipient user
    const recipient = await prisma.user.findUnique({
      where: { email: recipientEmail },
    });

    if (!recipient) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (recipient.id === user.id) {
      return NextResponse.json({ error: 'Cannot send connection request to yourself' }, { status: 400 });
    }

    // Check if connection already exists
    const existingConnection = await prisma.connection.findFirst({
      where: {
        OR: [
          {
            requesterId: user.id,
            recipientId: recipient.id,
          },
          {
            requesterId: recipient.id,
            recipientId: user.id,
          },
        ],
      },
    });

    if (existingConnection) {
      return NextResponse.json({ error: 'Connection request already exists' }, { status: 400 });
    }

    // Create the connection request
    const connection = await prisma.connection.create({
      data: {
        requesterId: user.id,
        recipientId: recipient.id,
        message,
        status: 'pending',
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json({ connection });
  } catch (error) {
    console.error('Failed to create connection:', error);
    return NextResponse.json({ error: 'Failed to create connection' }, { status: 500 });
  }
} 