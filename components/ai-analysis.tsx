"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { FaBrain, FaLightbulb, FaComments, FaShare } from 'react-icons/fa'
import { toast } from 'sonner'

interface AIAnalysisResult {
  sentiment: 'positive' | 'negative' | 'neutral'
  topics: string[]
  summary: string
  suggestions: string[]
}

export function AIAnalysis() {
  const [memory, setMemory] = useState('')
  const [personName, setPersonName] = useState('')
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null)
  const [conversationStarter, setConversationStarter] = useState('')
  const [loading, setLoading] = useState(false)

  const analyzeMemory = async () => {
    if (!memory.trim()) {
      toast.error('Please enter a memory to analyze')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memory,
          personName: personName || undefined,
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setAnalysis(data.analysis)
        setConversationStarter(data.conversationStarter || '')
        toast.success('Memory analyzed successfully!')
      } else {
        toast.error(data.error || 'Failed to analyze memory')
      }
    } catch (error) {
      toast.error('Failed to analyze memory')
    } finally {
      setLoading(false)
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'negative':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const shareToSocial = (text: string, platform: 'twitter' | 'linkedin') => {
    if (platform === 'twitter') {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
      window.open(twitterUrl, '_blank')
    } else if (platform === 'linkedin') {
      const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent('Memory Analysis')}&summary=${encodeURIComponent(text)}`
      window.open(linkedinUrl, '_blank')
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaBrain className="text-purple-500" />
            AI Memory Analysis
          </CardTitle>
          <CardDescription>
            Use AI to analyze your memories and get insights, conversation starters, and suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Memory to Analyze</label>
            <Textarea
              placeholder="Describe your memory or experience..."
              value={memory}
              onChange={(e) => setMemory(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Person's Name (Optional)</label>
            <Input
              placeholder="Enter the person's name for conversation starters..."
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
            />
          </div>

          <Button 
            onClick={analyzeMemory} 
            disabled={loading || !memory.trim()}
            className="w-full"
          >
            <FaBrain className="mr-2" />
            {loading ? 'Analyzing...' : 'Analyze Memory'}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaLightbulb className="text-yellow-500" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sentiment:</span>
              <Badge className={getSentimentColor(analysis.sentiment)}>
                {analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1)}
              </Badge>
            </div>

            <div>
              <h4 className="font-medium mb-2">Summary</h4>
              <p className="text-sm text-muted-foreground">{analysis.summary}</p>
            </div>

            {analysis.topics.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.topics.map((topic, index) => (
                    <Badge key={index} variant="secondary">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {analysis.suggestions.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Suggestions</h4>
                <ul className="space-y-1">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      • {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {conversationStarter && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <FaComments className="text-blue-500" />
                    Conversation Starter
                  </h4>
                  <p className="text-sm bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                    "{conversationStarter}"
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => shareToSocial(conversationStarter, 'twitter')}
                    >
                      <FaShare className="mr-1" />
                      Share on Twitter
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => shareToSocial(conversationStarter, 'linkedin')}
                    >
                      <FaShare className="mr-1" />
                      Share on LinkedIn
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
} 