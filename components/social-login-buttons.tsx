"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { FaGithub, FaGoogle, FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa"
import { toast } from "sonner"

export function SocialLoginButtons() {
  const handleSignIn = (provider: string) => {
    // Check if the provider is configured
    const isConfigured = provider === "google" 
      ? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID 
      : process.env.NEXT_PUBLIC_GITHUB_ID

    if (!isConfigured) {
      toast.info(`OAuth not configured. This is a demo. In production, you would sign in with ${provider}.`)
      return
    }

    signIn(provider, { callbackUrl: "/dashboard" })
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <Button
        onClick={() => handleSignIn("google")}
        className="w-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700"
        variant="outline"
        size="lg"
      >
        <FaGoogle className="mr-3 h-5 w-5" />
        Continue with Google
      </Button>
      <Button
        onClick={() => handleSignIn("github")}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-200 dark:hover:bg-slate-300 dark:text-slate-800"
        size="lg"
      >
        <FaGithub className="mr-3 h-5 w-5" />
        Continue with GitHub
      </Button>
      <Button
        onClick={() => toast.info("LinkedIn OAuth not configured. This is a demo.")}
        className="w-full bg-[#0A66C2] hover:bg-[#095ab0] text-white"
        size="lg"
      >
        <FaLinkedin className="mr-3 h-5 w-5" />
        Continue with LinkedIn
      </Button>
      <Button
        onClick={() => toast.info("Facebook OAuth not configured. This is a demo.")}
        className="w-full bg-[#1877F2] hover:bg-[#166eeb] text-white"
        size="lg"
      >
        <FaFacebook className="mr-3 h-5 w-5" />
        Continue with Facebook
      </Button>
      <Button
        onClick={() => toast.info("Instagram OAuth not configured. This is a demo.")}
        className="w-full bg-[radial-gradient(circle_at_30%_107%,#fdf497_0%,#fdf497_5%,#fd5949_45%,#d6249f_60%,#285AEB_90%)] hover:opacity-90 text-white"
        size="lg"
      >
        <FaInstagram className="mr-3 h-5 w-5" />
        Continue with Instagram
      </Button>
    </div>
  )
}
