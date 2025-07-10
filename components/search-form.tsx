"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles } from "lucide-react"
import { searchByMemory } from "@/lib/actions"

export function SearchForm() {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const results = await searchByMemory(query)
      const params = new URLSearchParams()
      params.set("results", JSON.stringify(results))
      params.set("query", query)
      router.push(`/matches?${params.toString()}`)
    } catch (err) {
      setError("An error occurred during the search. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const examples = [
    "Worked at Google with Sarah Johnson in 2018",
    "Studied Computer Science at Stanford with Mike Chen",
    "Lived on Oakwood Street in San Francisco",
    "Played soccer at Central Park with David in 2019",
    "Attended Tech Conference in New York with Lisa Wang",
    "Graduated from MIT with John Smith in 2020"
  ]

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Input
            placeholder="Describe a memory, person, place, or time... e.g., 'Worked at Google with Sarah in 2018'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="text-base p-6 h-14 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            disabled={isLoading}
          />
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
            <Sparkles className="h-5 w-5 text-slate-400" />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full text-lg py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg font-semibold transition-all hover:shadow-xl disabled:opacity-50"
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              AI is analyzing your memory...
            </>
          ) : (
            <>
              <Sparkles className="mr-3 h-5 w-5" />
              Find My Connections
            </>
          )}
        </Button>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          Try these examples:
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {examples.map((example) => (
            <button
              key={example}
              onClick={() => setQuery(example)}
              className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              disabled={isLoading}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}


