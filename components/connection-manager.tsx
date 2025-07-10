"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { FaUsers, FaUserPlus, FaCheck, FaTimes, FaEnvelope } from 'react-icons/fa'
import { toast } from 'sonner'

interface Connection {
  id: string
  status: 'pending' | 'accepted' | 'rejected' | 'blocked'
  message?: string
  requester: {
    id: string
    name: string
    email: string
    avatarUrl?: string
  }
  recipient: {
    id: string
    name: string
    email: string
    avatarUrl?: string
  }
  createdAt: string
}

export function ConnectionManager() {
  const [connections, setConnections] = useState<Connection[]>([])
  const [isSendingRequest, setIsSendingRequest] = useState(false)
  const [newRequest, setNewRequest] = useState({
    recipientEmail: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadConnections()
  }, [])

  const loadConnections = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/connections')
      const data = await response.json()
      
      if (response.ok) {
        setConnections(data.connections)
      } else {
        toast.error(data.error || 'Failed to load connections')
      }
    } catch (error) {
      toast.error('Failed to load connections')
    } finally {
      setLoading(false)
    }
  }

  const sendConnectionRequest = async () => {
    if (!newRequest.recipientEmail.trim()) {
      toast.error('Please enter an email address')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRequest),
      })

      const data = await response.json()
      
      if (response.ok) {
        toast.success('Connection request sent successfully!')
        setNewRequest({ recipientEmail: '', message: '' })
        setIsSendingRequest(false)
        loadConnections()
      } else {
        toast.error(data.error || 'Failed to send connection request')
      }
    } catch (error) {
      toast.error('Failed to send connection request')
    } finally {
      setLoading(false)
    }
  }

  const respondToRequest = async (connectionId: string, status: 'accepted' | 'rejected') => {
    try {
      setLoading(true)
      const response = await fetch(`/api/connections/${connectionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      const data = await response.json()
      
      if (response.ok) {
        toast.success(`Connection ${status} successfully!`)
        loadConnections()
      } else {
        toast.error(data.error || `Failed to ${status} connection`)
      }
    } catch (error) {
      toast.error(`Failed to ${status} connection`)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const pendingRequests = connections.filter(c => c.status === 'pending')
  const acceptedConnections = connections.filter(c => c.status === 'accepted')

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaUsers className="text-blue-500" />
            Connection Manager
          </CardTitle>
          <CardDescription>
            Send connection requests and manage your network.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Dialog open={isSendingRequest} onOpenChange={setIsSendingRequest}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <FaUserPlus className="mr-2" />
                Send Connection Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Connection Request</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email Address</label>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={newRequest.recipientEmail}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, recipientEmail: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Message (Optional)</label>
                  <Textarea
                    placeholder="Add a personal message..."
                    value={newRequest.message}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, message: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsSendingRequest(false)}>
                    Cancel
                  </Button>
                  <Button onClick={sendConnectionRequest} disabled={loading}>
                    {loading ? 'Sending...' : 'Send Request'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaEnvelope className="text-yellow-500" />
              Pending Requests ({pendingRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingRequests.map((connection) => (
                <div key={connection.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={connection.requester.avatarUrl} />
                      <AvatarFallback>
                        {connection.requester.name?.[0] || connection.requester.email[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{connection.requester.name || connection.requester.email}</p>
                      {connection.message && (
                        <p className="text-sm text-muted-foreground">{connection.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => respondToRequest(connection.id, 'accepted')}
                      disabled={loading}
                    >
                      <FaCheck className="mr-1" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => respondToRequest(connection.id, 'rejected')}
                      disabled={loading}
                    >
                      <FaTimes className="mr-1" />
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {acceptedConnections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaUsers className="text-green-500" />
              Your Connections ({acceptedConnections.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {acceptedConnections.map((connection) => (
                <div key={connection.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={connection.requester.avatarUrl} />
                      <AvatarFallback>
                        {connection.requester.name?.[0] || connection.requester.email[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{connection.requester.name || connection.requester.email}</p>
                      <Badge className={getStatusColor(connection.status)}>
                        {connection.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {connections.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <FaUsers className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No connections yet</h3>
            <p className="text-muted-foreground">
              Start building your network by sending connection requests to people you know.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 