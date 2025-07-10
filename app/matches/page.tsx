"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { MatchResult, GoogleProfileResult, CombinedSearchResults } from "@/lib/actions"
import { User, ArrowLeft, Users, Check, Sparkles } from "lucide-react"
import Link from "next/link"
import { FaLinkedin } from "react-icons/fa"

function MatchesContent() {
  const searchParams = useSearchParams()
  const resultsString = searchParams.get("results")
  const query = searchParams.get("query")

  let local: MatchResult[] = []
  let google: GoogleProfileResult[] = []
  try {
    if (resultsString) {
      const parsed: CombinedSearchResults = JSON.parse(resultsString)
      local = parsed.local || []
      google = parsed.google || []
    }
  } catch (error) {
    console.error("Failed to parse search results:", error)
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
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
          <Link
            href="/"
            className="flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Link>
        </header>

        <main className="relative z-10 mt-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI-Powered Search
                </Badge>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tighter">
                Your potential matches
              </h1>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Based on your memory:{" "}
                <span className="font-semibold italic text-indigo-600 dark:text-indigo-400">"{query}"</span>
              </p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                AI automatically generated an optimized search query to find your connections
              </p>
            </div>

            {/* Local Results */}
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Your Connections</h2>
            {local.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
                {local.map((match, index) => (
                  <Card
                    key={match.id}
                    className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-lg border transition-all hover:shadow-xl ${
                      index === 1
                        ? "border-lime-400 ring-2 ring-lime-400/20"
                        : "border-slate-200/50 dark:border-slate-700/50"
                    }`}
                  >
                    <CardHeader className="text-center p-6">
                      {index === 1 && (
                        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-lime-100 text-lime-800 border-lime-300 dark:bg-lime-900/50 dark:text-lime-300 dark:border-lime-700">
                          Strong Match
                        </Badge>
                      )}
                      <Avatar className="h-20 w-20 mx-auto border-4 border-white dark:border-slate-800 shadow-lg">
                        <AvatarImage src={match.avatar_url || undefined} alt={match.full_name} />
                        <AvatarFallback className="text-2xl">
                          <User className="h-10 w-10 text-slate-500" />
                        </AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-xl font-bold text-slate-900 dark:text-white mt-4">
                        {match.full_name}
                      </CardTitle>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {index === 0 ? "Close Match" : index === 1 ? "Strong Match" : "Possible Match"}
                      </p>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <div className="space-y-4">
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Shared Connection:
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-start">
                              <Check className="h-4 w-4 mr-2 mt-0.5 text-lime-500 flex-shrink-0" />
                              <div>
                                <p className="font-medium text-slate-800 dark:text-slate-200">
                                  {match.matching_event.title}
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {match.matching_event.location}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-500">
                                  {match.matching_event.start_year} - {match.matching_event.end_year || "Present"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button
                          className={`w-full ${
                            index === 1
                              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                              : "bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200"
                          }`}
                        >
                          Send Connection Request
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                  <Users className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">No matches found in your connections</h3>
              </div>
            )}

            {/* Google/LinkedIn Results */}
            <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4 mt-8">LinkedIn Profiles from Google</h2>
            {google.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {google.map((profile, index) => (
                  <Card key={profile.profileUrl} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-200 dark:border-blue-700 transition-all hover:shadow-xl">
                    <CardHeader className="text-center p-6">
                      <Avatar className="h-20 w-20 mx-auto border-4 border-white dark:border-slate-800 shadow-lg">
                        {profile.profileImageUrl ? (
                          <AvatarImage src={profile.profileImageUrl} alt={profile.name} />
                        ) : (
                          <AvatarFallback>{profile.name[0]}</AvatarFallback>
                        )}
                      </Avatar>
                      <CardTitle className="text-xl font-bold text-blue-900 dark:text-blue-200 mt-4">
                        {profile.name}
                      </CardTitle>
                      <p className="text-sm text-blue-700 dark:text-blue-300 font-semibold">
                        {profile.company ? (
                          <span>at <span className="font-bold text-blue-800 dark:text-blue-200">{profile.company}</span></span>
                        ) : null}
                      </p>
                      {profile.title && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{profile.title}</p>
                      )}
                      {profile.location && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{profile.location}</p>
                      )}
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <div className="space-y-2">
                        {profile.bio && (
                          <div className="text-xs text-slate-700 dark:text-slate-200 bg-blue-50 dark:bg-blue-900/30 rounded-md p-3 mb-2 font-medium whitespace-pre-line">
                            {profile.bio}
                          </div>
                        )}
                        {!profile.bio && profile.context && (
                          <p className="text-xs text-muted-foreground mb-2 whitespace-pre-line">{profile.context}</p>
                        )}
                        <Button size="sm" variant="outline" onClick={() => window.open(profile.profileUrl, '_blank')}>
                          <FaLinkedin className="mr-1" />
                          View LinkedIn
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                  <FaLinkedin className="h-10 w-10 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">No LinkedIn profiles found from Google</h3>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function MatchesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MatchesContent />
    </Suspense>
  )
}
