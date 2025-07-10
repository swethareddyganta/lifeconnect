"use server"

import { prisma } from "@/lib/db"
import { createGroq } from "@ai-sdk/groq"
import { generateObject } from "ai"
import { z } from "zod"

// Check if Groq API key is available
const hasGroqApiKey = process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here'

// 1. Swapped OpenAI for Groq
// The AI SDK will automatically use the GROQ_API_KEY environment variable.
const groq = hasGroqApiKey ? createGroq({
  apiKey: process.env.GROQ_API_KEY,
}) : null

export interface MatchResult {
  id: string
  fullName: string
  avatarUrl: string | null
  matchingEvent: {
    title: string
    location: string
    startYear: number
    endYear: number | null
  }
}

export interface GoogleProfileResult {
  name: string
  title: string
  company: string
  location?: string
  profileUrl: string
  context?: string
  profileImageUrl?: string // New: profile image if available
  bio?: string // New: AI-generated bio
  email?: string // New: found email address
}

export interface CombinedSearchResults {
  local: MatchResult[]
  google: GoogleProfileResult[]
}

export async function searchByMemory(query: string): Promise<CombinedSearchResults> {
  if (!query) {
    throw new Error("Search query cannot be empty.")
  }

  // If no Groq API key is available, fall back to simple text search for local, and skip Google
  if (!hasGroqApiKey || !groq) {
    console.warn("GROQ_API_KEY not configured. Falling back to simple text search.")
    const local = await simpleTextSearch(query)
    return { local, google: [] }
  }

  try {
    // Generate Boolean query from natural language using Groq
    const { object: booleanQuery } = await generateObject({
      model: groq("llama3-70b-8192"),
      system: `You are an expert search query generator. Convert natural language descriptions into optimized Boolean search queries for finding people and connections. Use AND, OR, quotes for exact phrases, and parentheses for grouping. Focus on names, companies, locations, job titles, and time periods.`,
      prompt: `Convert this natural language description into a Boolean search query: "${query}"

Rules:
- Use quotes for exact phrases and names
- Use AND to require multiple terms
- Use OR for alternatives
- Use parentheses to group related terms
- Focus on: names, companies, locations, job titles, years
- Make it specific but not too restrictive
- Return only the Boolean query, no explanation`,
      schema: z.object({
        booleanQuery: z.string().describe("The generated Boolean search query"),
        searchType: z.enum(["exact", "broad", "time_based", "location_based", "company_based"]).describe("Type of search being performed")
      }),
    })

    // Local DB search
    const local = await booleanSearch(booleanQuery.booleanQuery)
    // Google/LinkedIn search
    const google = await googleLinkedInSearch(booleanQuery.booleanQuery)
    return { local, google }
  } catch (error) {
    console.error("AI-powered Boolean generation failed, falling back to simple text search:", error)
    const local = await simpleTextSearch(query)
    return { local, google: [] }
  }
}

async function booleanSearch(query: string): Promise<MatchResult[]> {
  try {
    // Parse Boolean query and build Prisma where conditions
    const whereConditions = parseBooleanQuery(query)
    
    const events = await prisma.event.findMany({
      where: whereConditions,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          }
        }
      },
      take: 20,
    })

    return formatResults(events)
  } catch (error) {
    console.error("Boolean search error:", error)
    throw new Error("Failed to execute Boolean search.")
  }
}

async function googleLinkedInSearch(booleanQuery: string): Promise<GoogleProfileResult[]> {
  const googleApiKey = process.env.GOOGLE_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  const cseId = process.env.GOOGLE_CSE_ID || process.env.NEXT_PUBLIC_GOOGLE_CSE_ID
  const hunterApiKey = process.env.HUNTER_API_KEY
  if (!googleApiKey || !cseId) return []

  // Add LinkedIn site restriction if not present
  let query = booleanQuery
  if (!query.includes('site:linkedin.com/in/')) {
    query += ' AND site:linkedin.com/in/'
  }

  function extractFirstAndLastName(fullName: string): { firstName: string, lastName: string } {
    const parts = fullName.split(' ')
    if (parts.length === 1) return { firstName: parts[0], lastName: '' }
    return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
  }

  async function findEmailWithHunter(name: string, company: string): Promise<string | undefined> {
    if (!hunterApiKey || !name || !company) return undefined
    const { firstName, lastName } = extractFirstAndLastName(name)
    console.log(`[Hunter] Looking for email:`, { name, firstName, lastName, company })
    // Try to get company domain from Hunter's domain search
    let domain = ''
    try {
      const domainRes = await fetch(`https://api.hunter.io/v2/domain-search?company=${encodeURIComponent(company)}&api_key=${hunterApiKey}`)
      const domainData = await domainRes.json()
      console.log(`[Hunter] Domain search response:`, domainData)
      if (domainData && domainData.data && domainData.data.domain) {
        domain = domainData.data.domain
      }
    } catch (err) {
      console.error(`[Hunter] Error during domain search:`, err)
    }
    if (!domain) {
      console.warn(`[Hunter] No domain found for company:`, company)
      return undefined
    }
    // Use Hunter email finder
    try {
      const emailRes = await fetch(`https://api.hunter.io/v2/email-finder?domain=${domain}&first_name=${encodeURIComponent(firstName)}&last_name=${encodeURIComponent(lastName)}&api_key=${hunterApiKey}`)
      const emailData = await emailRes.json()
      console.log(`[Hunter] Email finder response:`, emailData)
      if (emailData && emailData.data && emailData.data.email) {
        return emailData.data.email
      }
    } catch (err) {
      console.error(`[Hunter] Error during email finder:`, err)
    }
    console.warn(`[Hunter] No email found for:`, { name, company, domain })
    return undefined
  }

  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${cseId}&q=${encodeURIComponent(query)}&num=10`
    const response = await fetch(url)
    if (!response.ok) return []
    const data = await response.json()
    const profiles: GoogleProfileResult[] = []
    for (const item of data.items || []) {
      const url = item.link
      if (!url.includes('linkedin.com/in/')) continue
      const title = item.title || ''
      const snippet = item.snippet || ''
      const nameMatch = title.match(/^([^-]+)/)
      const name = nameMatch ? nameMatch[1].trim() : 'Unknown'
      let jobTitle = ''
      let company = ''
      const titleMatch = title.match(/- (.+?) at (.+?) \| LinkedIn/)
      if (titleMatch) {
        jobTitle = titleMatch[1].trim()
        company = titleMatch[2].trim()
      }
      // Improved company extraction from snippet/context if not found in title
      if (!company) {
        // Try 'at [Company]' in snippet
        const atMatch = snippet.match(/ at ([A-Za-z0-9&.,'\- ]+)/)
        if (atMatch) {
          company = atMatch[1].trim()
        } else {
          // Try 'Company: [Company]' in snippet
          const companyMatch = snippet.match(/Company: ([A-Za-z0-9&.,'\- ]+)/)
          if (companyMatch) {
            company = companyMatch[1].trim()
          }
        }
      }
      const locationMatch = snippet.match(/in (.+?)(?:,|\.|$)/)
      const location = locationMatch ? locationMatch[1].trim() : ''
      // Extract profile image if available
      let profileImageUrl: string | undefined = undefined
      if (item.pagemap && item.pagemap.cse_image && item.pagemap.cse_image.length > 0) {
        profileImageUrl = item.pagemap.cse_image[0].src
      } else if (item.pagemap && item.pagemap.cse_thumbnail && item.pagemap.cse_thumbnail.length > 0) {
        profileImageUrl = item.pagemap.cse_thumbnail[0].src
      }
      // Format bio: show only first 2 sentences
      let context = snippet
      if (context) {
        const sentences = context.match(/[^.!?]+[.!?]+/g)
        if (sentences && sentences.length > 0) {
          context = sentences.slice(0, 2).join(' ').trim()
        }
      }
      // AI-generated bio
      let bio = context
      if (hasGroqApiKey && groq) {
        try {
          const { object: aiBio } = await generateObject({
            model: groq("llama3-70b-8192"),
            system: `You are an expert at writing concise, professional LinkedIn bios.`,
            prompt: `Write a short, well-formatted LinkedIn-style bio for the following person.\n\nName: ${name}\nTitle: ${jobTitle}\nCompany: ${company}\nContext: ${context}\n\nBio:`,
            schema: z.object({
              bio: z.string().describe("A concise, professional LinkedIn-style bio for this person."),
            }),
          })
          if (aiBio && aiBio.bio) bio = aiBio.bio.trim()
        } catch (err) {
          // fallback to context
        }
      }
      // Find email with Hunter
      let email: string | undefined = undefined
      if (hunterApiKey && name && company) {
        email = await findEmailWithHunter(name, company)
      } else {
        console.warn(`[Hunter] Skipping email lookup due to missing name or company:`, { name, company })
      }
      profiles.push({
        name,
        title: jobTitle,
        company,
        location,
        profileUrl: url,
        context,
        profileImageUrl,
        bio,
        email,
      })
    }
    return profiles
  } catch (error) {
    console.error('Google search error:', error)
    return []
  }
}

function parseBooleanQuery(query: string): any {
  // Convert Boolean query to Prisma where conditions
  // This is a simplified parser - in production you'd want a more robust solution
  
  const conditions: any[] = []
  
  // Handle quoted phrases
  const quotedMatches = query.match(/"([^"]+)"/g)
  if (quotedMatches) {
    quotedMatches.forEach(match => {
      const phrase = match.slice(1, -1) // Remove quotes
      conditions.push({
        OR: [
          { title: { contains: phrase, mode: 'insensitive' } },
          { location: { contains: phrase, mode: 'insensitive' } },
          { description: { contains: phrase, mode: 'insensitive' } }
        ]
      })
    })
  }
  
  // Handle AND operators
  if (query.includes(' AND ')) {
    const andParts = query.split(' AND ').map(part => part.trim())
    const andConditions: any[] = []
    
    andParts.forEach(part => {
      // Remove quotes if present
      const cleanPart = part.replace(/"/g, '')
      if (cleanPart) {
        andConditions.push({
          OR: [
            { title: { contains: cleanPart, mode: 'insensitive' } },
            { location: { contains: cleanPart, mode: 'insensitive' } },
            { description: { contains: cleanPart, mode: 'insensitive' } }
          ]
        })
      }
    })
    
    if (andConditions.length > 0) {
      return { AND: andConditions }
    }
  }
  
  // Handle OR operators
  if (query.includes(' OR ')) {
    const orParts = query.split(' OR ').map(part => part.trim())
    const orConditions: any[] = []
    
    orParts.forEach(part => {
      // Remove quotes if present
      const cleanPart = part.replace(/"/g, '')
      if (cleanPart) {
        orConditions.push({
          OR: [
            { title: { contains: cleanPart, mode: 'insensitive' } },
            { location: { contains: cleanPart, mode: 'insensitive' } },
            { description: { contains: cleanPart, mode: 'insensitive' } }
          ]
        })
      }
    })
    
    if (orConditions.length > 0) {
      return { OR: orConditions }
    }
  }
  
  // If no Boolean operators found, treat as simple search
  return {
    OR: [
      { title: { contains: query, mode: 'insensitive' } },
      { location: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } }
    ]
  }
}

async function simpleTextSearch(query: string): Promise<MatchResult[]> {
  try {
    const events = await prisma.event.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { location: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          }
        }
      },
      take: 20,
    })

    return formatResults(events)
  } catch (error) {
    console.error("Database query error:", error)
    throw new Error("Failed to fetch potential matches from the database.")
  }
}

function formatResults(events: any[]): MatchResult[] {
  const results: MatchResult[] = events
    .filter((event) => event.user)
    .map((event) => ({
      id: event.user!.id,
      fullName: event.user!.fullName || event.user!.name || 'Unknown',
      avatarUrl: event.user!.avatarUrl,
      matchingEvent: {
        title: event.title,
        location: event.location || '',
        startYear: event.startYear || 0,
        endYear: event.endYear,
      },
    }))

  const uniqueResults = Array.from(new Map(results.map((item) => [item.id, item])).values())

  return uniqueResults
}
