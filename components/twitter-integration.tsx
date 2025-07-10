"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FaTwitter, FaSearch, FaHeart, FaRetweet, FaReply } from 'react-icons/fa'
import { toast } from 'sonner'

interface TwitterProfile {
  id: string
  username: string
  name: string
  profileImageUrl?: string
  description?: string
  followersCount: number
  followingCount: number
  tweetCount: number
}

interface TwitterTweet {
  id: string
  text: string
  created_at: string
  public_metrics?: {
    retweet_count: number
    reply_count: number
    like_count: number
    quote_count: number
  }
}

export function TwitterIntegration() {
  const [searchQuery, setSearchQuery] = useState('')
  const [tweets, setTweets] = useState<TwitterTweet[]>([])
  const [profile, setProfile] = useState<TwitterProfile | null>(null)
  const [tweetText, setTweetText] = useState('')
  const [loading, setLoading] = useState(false)

  const searchTweets = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query')
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/twitter/search?q=${encodeURIComponent(searchQuery)}&max_results=10`)
      const data = await response.json()
      
      if (response.ok) {
        setTweets(data.tweets)
        toast.success(`Found ${data.tweets.length} tweets`)
      } else {
        toast.error(data.error || 'Failed to search tweets')
      }
    } catch (error) {
      toast.error('Failed to search Twitter')
    } finally {
      setLoading(false)
    }
  }

  const getProfile = async (username: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/twitter/profile?username=${encodeURIComponent(username)}`)
      const data = await response.json()
      
      if (response.ok) {
        setProfile(data.profile)
        toast.success('Profile loaded successfully')
      } else {
        toast.error(data.error || 'Failed to fetch profile')
      }
    } catch (error) {
      toast.error('Failed to fetch Twitter profile')
    } finally {
      setLoading(false)
    }
  }

  const createTweet = async () => {
    if (!tweetText.trim()) {
      toast.error('Please enter some text to tweet')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/twitter/tweet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: tweetText }),
      })

      const data = await response.json()
      
      if (response.ok) {
        toast.success('Tweet posted successfully!')
        setTweetText('')
      } else {
        toast.error(data.error || 'Failed to post tweet')
      }
    } catch (error) {
      toast.error('Failed to post tweet')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaTwitter className="text-[#1DA1F2]" />
            Twitter Integration
          </CardTitle>
          <CardDescription>
            Search tweets, view profiles, and share your memories on Twitter.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search tweets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchTweets()}
            />
            <Button onClick={searchTweets} disabled={loading}>
              <FaSearch className="mr-2" />
              Search
            </Button>
          </div>

          {tweets.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Search Results ({tweets.length})</h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {tweets.map((tweet) => (
                  <div key={tweet.id} className="p-3 border rounded-lg">
                    <p className="text-sm mb-2">{tweet.text}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{new Date(tweet.created_at).toLocaleDateString()}</span>
                      {tweet.public_metrics && (
                        <>
                          <span className="flex items-center gap-1">
                            <FaHeart className="text-red-500" />
                            {tweet.public_metrics.like_count}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaRetweet className="text-green-500" />
                            {tweet.public_metrics.retweet_count}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaReply className="text-blue-500" />
                            {tweet.public_metrics.reply_count}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile Lookup</CardTitle>
          <CardDescription>
            Look up Twitter profiles by username.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter username..."
              onKeyPress={(e) => e.key === 'Enter' && e.currentTarget.value && getProfile(e.currentTarget.value)}
            />
            <Button onClick={() => getProfile(searchQuery)} disabled={loading}>
              Lookup
            </Button>
          </div>

          {profile && (
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={profile.profileImageUrl} />
                  <AvatarFallback>{profile.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{profile.name}</h3>
                  <p className="text-sm text-muted-foreground">@{profile.username}</p>
                </div>
              </div>
              {profile.description && (
                <p className="text-sm mb-3">{profile.description}</p>
              )}
              <div className="flex gap-4 text-sm">
                <span><strong>{profile.tweetCount}</strong> Tweets</span>
                <span><strong>{profile.followingCount}</strong> Following</span>
                <span><strong>{profile.followersCount}</strong> Followers</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Share on Twitter</CardTitle>
          <CardDescription>
            Share your memories and experiences on Twitter.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="What's happening?"
            value={tweetText}
            onChange={(e) => setTweetText(e.target.value)}
            rows={3}
            maxLength={280}
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {tweetText.length}/280 characters
            </span>
            <Button 
              onClick={createTweet} 
              disabled={loading || !tweetText.trim() || tweetText.length > 280}
            >
              <FaTwitter className="mr-2" />
              {loading ? 'Posting...' : 'Tweet'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 