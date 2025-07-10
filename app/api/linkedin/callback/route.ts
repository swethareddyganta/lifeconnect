import { NextRequest, NextResponse } from 'next/server';
import { linkedInAPI } from '@/lib/linkedin';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect('/dashboard?error=linkedin_auth_failed');
    }

    if (!code) {
      return NextResponse.redirect('/dashboard?error=no_auth_code');
    }

    // Get the current user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.redirect('/login?error=not_authenticated');
    }

    // Exchange code for access token
    const accessToken = await linkedInAPI.getAccessToken(code);
    
    // Get LinkedIn profile
    const profile = await linkedInAPI.getProfile(accessToken);

    // Update user with LinkedIn information
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        linkedinId: profile.id,
        linkedinToken: accessToken,
        linkedinProfile: profile,
      },
    });

    return NextResponse.redirect('/dashboard?success=linkedin_connected');
  } catch (error) {
    console.error('LinkedIn callback error:', error);
    return NextResponse.redirect('/dashboard?error=linkedin_callback_failed');
  }
} 