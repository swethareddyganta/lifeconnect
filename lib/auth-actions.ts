"use server"

import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export async function getCurrentUser() {
  const session = await getServerSession()
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }
  return user
}

// Note: OAuth sign-in is now handled by NextAuth.js API routes
// These functions are kept for compatibility but redirect to NextAuth
export async function signInWithGoogle() {
  redirect('/api/auth/signin?provider=google')
}

export async function signInWithGithub() {
  redirect('/api/auth/signin?provider=github')
}

export async function signInWithLinkedIn() {
  redirect('/api/auth/signin?provider=linkedin')
}

export async function signInWithFacebook() {
  redirect('/api/auth/signin?provider=facebook')
}

export async function signInWithInstagram() {
  redirect('/api/auth/signin?provider=instagram')
}
