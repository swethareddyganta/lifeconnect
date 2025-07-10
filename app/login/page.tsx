import { SocialLoginButtons } from "@/components/social-login-buttons"
import { DemoLogin } from "@/components/demo-login"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="w-full max-w-md relative">
        <div className="absolute top-4 left-4">
          <Link
            href="/"
            className="flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-8 sm:p-12 text-center">
          <div className="mb-8">
            <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-6 h-6 bg-yellow-300 rounded-full" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tighter">
              Welcome to LifeConnect
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Sign in to continue your journey.</p>
          </div>
          
          {/* Demo Login for testing */}
          <div className="mb-6">
            <DemoLogin />
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white/80 dark:bg-slate-900/80 px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="mt-6">
          <SocialLoginButtons />
          </div>
          
          <p className="mt-8 text-xs text-slate-500 dark:text-slate-400">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
