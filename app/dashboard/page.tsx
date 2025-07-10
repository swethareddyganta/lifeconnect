import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LinkedInIntegration } from "@/components/linkedin-integration"
import { TwitterIntegration } from "@/components/twitter-integration"
import { AIAnalysis } from "@/components/ai-analysis"
import { ConnectionManager } from "@/components/connection-manager"
import { SearchForm } from "@/components/search-form"
import { MatchPreviewCard } from "@/components/match-preview-card"
import { searchByMemory } from "@/lib/actions"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            LifeConnect Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Connect with people from your past using AI-powered memory search and social integrations.
          </p>
        </div>

        <Tabs defaultValue="search" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="search">Memory Search</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
            <TabsTrigger value="ai">AI Analysis</TabsTrigger>
            <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
            <TabsTrigger value="twitter">Twitter</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
                Search by Memory
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Describe a memory or experience, and we'll help you find people who might have been there.
              </p>
              <SearchForm />
            </div>
          </TabsContent>

          <TabsContent value="connections" className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <ConnectionManager />
            </div>
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <AIAnalysis />
            </div>
          </TabsContent>

          <TabsContent value="linkedin" className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <LinkedInIntegration />
            </div>
          </TabsContent>

          <TabsContent value="twitter" className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <TwitterIntegration />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 