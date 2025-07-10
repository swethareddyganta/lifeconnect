import { SearchForm } from "@/components/search-form"
import { MatchPreviewCard } from "@/components/match-preview-card"
import { Users, Milestone, Bot, Search, Heart } from "lucide-react"
import Link from "next/link"
import { SocialLoginButtons } from "@/components/social-login-buttons"

const features = [
  {
    icon: Bot,
    title: "Agentic AI Search",
    description:
      "Our AI understands natural language. Just type a memory, and it extracts the key details to find matches.",
  },
  {
    icon: Users,
    title: "Privacy-First Connections",
    description: "Send connection requests without revealing your full profile. You control who sees your information.",
  },
  {
    icon: Milestone,
    title: "Interactive Timeline",
    description:
      "Visualize your life's key moments—schools, jobs, and places lived—to create a rich profile for others to find.",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 overflow-x-hidden">
      <div className="relative container mx-auto p-4 sm:p-8">
        {/* Background decorative grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

        <header className="relative z-10 flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-yellow-300 rounded-full" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">LifeConnect</span>
          </Link>
          <div className="flex gap-2">
            <Link
              href="/dashboard"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              Dashboard
            </Link>
            <Link
              href="/login"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              Sign In
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <main className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center mt-12 sm:mt-20">
          <div className="flex flex-col">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tighter">
              Find your past connections
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-lg">
              Use our AI-powered search to rediscover old friends, colleagues, and classmates based on shared memories,
              places, and times.
            </p>
            <div className="mt-8">
              <SearchForm />
            </div>
          </div>
          <div className="flex items-center justify-center lg:justify-end">
            <MatchPreviewCard />
          </div>
        </main>

        {/* How It Works Section */}
        <section className="relative z-10 mt-32 text-center">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tighter">How It Works</h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Rediscover connections in three simple steps.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
            <div className="bg-white/50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="mt-6 text-xl font-bold">1. Share a Memory</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Enter any detail you remember—a name, a place, a school, a workplace.
              </p>
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
              <div className="w-16 h-16 bg-lime-100 dark:bg-lime-900/50 rounded-full flex items-center justify-center mx-auto">
                <Bot className="w-8 h-8 text-lime-600 dark:text-lime-400" />
              </div>
              <h3 className="mt-6 text-xl font-bold">2. AI Finds Matches</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Our agentic AI analyzes your memory and searches our network for potential matches.
              </p>
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
              <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/50 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="mt-6 text-xl font-bold">3. Reconnect</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Send a private connection request and rediscover people from your past.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative z-10 mt-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tighter">
                Powerful, privacy-focused features.
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                We provide the tools you need to find and reconnect with people, while always keeping you in control of
                your data.
              </p>
              <div className="mt-8 space-y-6">
                {features.map((feature) => (
                  <div key={feature.title} className="flex items-start">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{feature.title}</h4>
                      <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
              <h3 className="font-bold text-lg">A Success Story</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                "I found my best friend from high school after 15 years!"
              </p>
              <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg">
                <p className="italic text-slate-700 dark:text-slate-300">
                  "I vaguely remembered working with someone named 'David' at a tech company in Springfield around 2010.
                  I typed that in, and LifeConnect found him instantly. It was incredible."
                </p>
              </div>
              <div className="flex items-center mt-4">
                <img src="/professional-woman-diverse.png" alt="Jane Doe" className="w-10 h-10 rounded-full" />
                <div className="ml-3">
                  <p className="font-semibold">Jane D.</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Reconnected in 2024</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="relative z-10 mt-32 text-center bg-white/50 dark:bg-slate-800/50 p-12 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tighter">
            Start your search today
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Create an account to build your timeline and begin reconnecting with people from your past. It's free to get
            started.
          </p>
          <div className="mt-8 max-w-sm mx-auto">
            <SocialLoginButtons />
          </div>
        </section>
      </div>
    </div>
  )
}
