import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { status } = await request.json();

    if (!['accepted', 'rejected', 'blocked'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Find the connection and verify the user is the recipient
    const connection = await prisma.connection.findUnique({
      where: { id: params.id },
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

    if (!connection) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }

    // Verify the user is the recipient of the connection request
    if (connection.recipientId !== user.id) {
      return NextResponse.json({ error: 'Not authorized to update this connection' }, { status: 403 });
    }

    // Update the connection status
    const updatedConnection = await prisma.connection.update({
      where: { id: params.id },
      data: { status },
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

    return NextResponse.json({ connection: updatedConnection });
  } catch (error) {
    console.error('Failed to update connection:', error);
    return NextResponse.json({ error: 'Failed to update connection' }, { status: 500 });
  }
} 