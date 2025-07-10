"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Briefcase, GraduationCap, MapPin, ArrowLeft, Plus, Calendar, MapPin as MapPinIcon } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

interface TimelineEvent {
  id: string
  type: "education" | "work" | "location" | "personal"
  title: string
  location?: string
  startYear: number
  endYear?: number
  description?: string
  tags?: string[]
}

const ICONS = {
  education: GraduationCap,
  work: Briefcase,
  location: MapPin,
  personal: Calendar,
}

const TYPE_LABELS = {
  education: "Education",
  work: "Work",
  location: "Location",
  personal: "Personal",
}

export default function TimelinePage() {
  const { data: session } = useSession()
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [isAddingEvent, setIsAddingEvent] = useState(false)
  const [newEvent, setNewEvent] = useState({
    type: "work" as const,
    title: "",
    location: "",
    startYear: new Date().getFullYear(),
    endYear: "",
    description: "",
    tags: "",
  })

  // Load events from database or use sample data
  useEffect(() => {
    if (session?.user) {
      loadUserEvents()
    } else {
      // Use sample data for demo
      setEvents([
  {
          id: "1",
    type: "education",
    title: "Northwood High School",
    location: "Springfield, IL",
          startYear: 2003,
          endYear: 2007,
    description: "Graduated with honors. Active in drama club and student government.",
          tags: ["high school", "drama", "student government"],
  },
  {
          id: "2",
    type: "education",
    title: "State University",
    location: "Metropolis, IL",
          startYear: 2007,
          endYear: 2011,
    description: "B.S. in Computer Science. Dean's List for 3 semesters.",
          tags: ["college", "computer science", "dean's list"],
  },
  {
          id: "3",
    type: "work",
    title: "Tech Solutions Inc.",
    location: "Metropolis, IL",
          startYear: 2011,
          endYear: 2015,
    description: "Software Engineer. Worked on mobile applications and web platforms.",
          tags: ["software engineer", "mobile apps", "web development"],
  },
  {
          id: "4",
    type: "location",
    title: "Lived in Metropolis",
    location: "Metropolis, IL",
          startYear: 2007,
          endYear: 2015,
    description: "Moved for college and stayed for first job. Great memories in downtown area.",
          tags: ["relocation", "college town", "downtown"],
  },
  {
          id: "5",
    type: "work",
    title: "Innovate Corp",
    location: "San Francisco, CA",
          startYear: 2015,
    description: "Senior Software Engineer. Leading AI and machine learning initiatives.",
          tags: ["senior engineer", "AI", "machine learning"],
  },
  {
          id: "6",
    type: "location",
    title: "Lived in San Francisco",
    location: "San Francisco, CA",
          startYear: 2015,
    description: "Relocated for new opportunities. Love the tech scene and culture here.",
          tags: ["relocation", "tech scene", "culture"],
  },
      ])
    }
  }, [session])

  const loadUserEvents = async () => {
    try {
      const response = await fetch('/api/timeline/events')
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events)
      }
    } catch (error) {
      console.error('Failed to load events:', error)
    }
}

  const addEvent = async () => {
    if (!newEvent.title.trim() || !newEvent.startYear) {
      toast.error('Please fill in the required fields')
      return
    }

    try {
      const response = await fetch('/api/timeline/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newEvent,
          endYear: newEvent.endYear ? parseInt(newEvent.endYear) : null,
          tags: newEvent.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setEvents(prev => [data.event, ...prev])
        setNewEvent({
          type: "work",
          title: "",
          location: "",
          startYear: new Date().getFullYear(),
          endYear: "",
          description: "",
          tags: "",
        })
        setIsAddingEvent(false)
        toast.success('Event added successfully!')
      } else {
        toast.error('Failed to add event')
      }
    } catch (error) {
      toast.error('Failed to add event')
    }
  }

  const sortedEvents = [...events].sort((a, b) => (b.startYear || 0) - (a.startYear || 0))

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
          </Link>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Your Timeline</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Build your life story to help others find you through shared experiences.
              </p>
            </div>
          </div>
          
          <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right">Type</label>
                  <Select value={newEvent.type} onValueChange={(value: any) => setNewEvent(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="location">Location</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right">Title *</label>
                  <Input
                    value={newEvent.title}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                    className="col-span-3"
                    placeholder="e.g., Software Engineer at Google"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right">Location</label>
                  <Input
                    value={newEvent.location}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                    className="col-span-3"
                    placeholder="e.g., San Francisco, CA"
                  />
            </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right">Start Year *</label>
                  <Input
                    type="number"
                    value={newEvent.startYear}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, startYear: parseInt(e.target.value) || 0 }))}
                    className="col-span-3"
                  />
            </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right">End Year</label>
                  <Input
                    type="number"
                    value={newEvent.endYear}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, endYear: e.target.value }))}
                    className="col-span-3"
                    placeholder="Leave empty if ongoing"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right">Description</label>
                  <Textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                    className="col-span-3"
                    placeholder="Describe your experience..."
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right">Tags</label>
                  <Input
                    value={newEvent.tags}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, tags: e.target.value }))}
                    className="col-span-3"
                    placeholder="e.g., software, AI, team lead (comma separated)"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddingEvent(false)}>
                  Cancel
                </Button>
                <Button onClick={addEvent}>
                  Add Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          {sortedEvents.map((event) => {
            const Icon = ICONS[event.type]
                  return (
              <Card key={event.id} className="relative">
                <div className="absolute left-8 top-8 w-3 h-3 bg-slate-300 dark:bg-slate-600 rounded-full" />
                <div className="absolute left-7 top-11 w-0.5 h-full bg-slate-200 dark:bg-slate-700" />
                
                <CardHeader className="pl-16">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      </div>
                              <div>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{TYPE_LABELS[event.type]}</Badge>
                          {event.location && (
                            <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                              <MapPinIcon className="w-3 h-3" />
                              {event.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {event.startYear}
                        {event.endYear && event.endYear !== event.startYear && ` - ${event.endYear}`}
                        {!event.endYear && " - Present"}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                {event.description && (
                  <CardContent className="pl-16 pt-0">
                    <p className="text-slate-600 dark:text-slate-400 mb-3">{event.description}</p>
                    {event.tags && event.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {event.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
                  )
                })}
              </div>
      </div>
    </div>
  )
}
