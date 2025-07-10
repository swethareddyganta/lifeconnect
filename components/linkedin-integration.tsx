"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FaLinkedin, FaShare, FaUsers } from 'react-icons/fa'
import { toast } from 'sonner'

interface LinkedInConnection {
  id: string
  firstName: string
  lastName: string
  profilePicture?: string
  headline?: string
  company?: string
  position?: string
}

export function LinkedInIntegration() {
  const [connections, setConnections] = useState<LinkedInConnection[]>([])
  const [shareText, setShareText] = useState('')
  const [visibility, setVisibility] = useState<'PUBLIC' | 'CONNECTIONS'>('PUBLIC')
  const [loading, setLoading] = useState(false)

  const connectLinkedIn = async () => {
    try {
      window.location.href = '/api/linkedin/auth'
    } catch (error) {
      toast.error('Failed to connect LinkedIn')
    }
  }

  const fetchConnections = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/linkedin/connections')
      const data = await response.json()
      
      if (response.ok) {
        setConnections(data.connections)
        toast.success(`Found ${data.connections.length} connections`)
      } else {
        toast.error(data.error || 'Failed to fetch connections')
      }
    } catch (error) {
      toast.error('Failed to fetch LinkedIn connections')
    } finally {
      setLoading(false)
    }
  }

  const sharePost = async () => {
    if (!shareText.trim()) {
      toast.error('Please enter some text to share')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/linkedin/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: shareText,
          visibility,
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        toast.success('Post shared successfully!')
        setShareText('')
      } else {
        toast.error(data.error || 'Failed to share post')
      }
    } catch (error) {
      toast.error('Failed to share on LinkedIn')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaLinkedin className="text-[#0A66C2]" />
            LinkedIn Integration
          </CardTitle>
          <CardDescription>
            Connect your LinkedIn account to find professional connections and share memories.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={connectLinkedIn} className="w-full">
            <FaLinkedin className="mr-2" />
            Connect LinkedIn Account
          </Button>
          
          <Button 
            onClick={fetchConnections} 
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            <FaUsers className="mr-2" />
            {loading ? 'Loading...' : 'Fetch Connections'}
          </Button>

          {connections.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Your Connections ({connections.length})</h4>
              <div className="grid gap-2 max-h-60 overflow-y-auto">
                {connections.map((connection) => (
                  <div key={connection.id} className="flex items-center gap-3 p-2 border rounded">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={connection.profilePicture} />
                      <AvatarFallback>
                        {connection.firstName[0]}{connection.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {connection.firstName} {connection.lastName}
                      </p>
                      {connection.headline && (
                        <p className="text-xs text-muted-foreground truncate">
                          {connection.headline}
                        </p>
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
          <CardTitle className="flex items-center gap-2">
            <FaShare />
            Share on LinkedIn
          </CardTitle>
          <CardDescription>
            Share your memories and experiences with your professional network.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Share your memory or experience..."
            value={shareText}
            onChange={(e) => setShareText(e.target.value)}
            rows={4}
          />
          
          <Select value={visibility} onValueChange={(value: 'PUBLIC' | 'CONNECTIONS') => setVisibility(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PUBLIC">Public</SelectItem>
              <SelectItem value="CONNECTIONS">Connections Only</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            onClick={sharePost} 
            disabled={loading || !shareText.trim()}
            className="w-full"
          >
            <FaShare className="mr-2" />
            {loading ? 'Sharing...' : 'Share Post'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 