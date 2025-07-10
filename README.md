# LifeConnect - AI-Powered Memory Search & Social Integration

LifeConnect is a comprehensive Next.js application that helps you find and reconnect with people from your past using AI-powered memory search and social media integrations.

## 🚀 Features

### 🤖 AI-Powered Memory Search
- **Natural Language Processing**: Search using everyday language
- **Entity Extraction**: Automatically extracts names, locations, and dates from memories
- **Fuzzy Matching**: Find people even with partial information
- **Fallback Search**: Works without AI APIs using simple text search
- **Search History**: Track and analyze search patterns

### 🔍 Search Automation
- **Google Boolean Search**: Generate optimized search strings for LinkedIn profiles
- **LinkedIn Profile Scraping**: Extract profile information from Google search results
- **Email Finding**: Use Hunter.io to find email addresses
- **Cold Email Generation**: Create personalized emails using OpenAI
- **Export & Integration**: Export results to CSV and integrate with Gmail

### 📅 Interactive Timeline
- **Event Management**: Add, edit, and organize life events
- **Event Categories**: Education, work, location, and personal events
- **Tagging System**: Add tags for better search and organization
- **Visual Timeline**: Beautiful chronological view of life events
- **Rich Descriptions**: Detailed event descriptions and metadata

### 🔗 Connection Management
- **Connection Requests**: Send and receive connection requests
- **Request Messages**: Add personal messages to connection requests
- **Status Management**: Accept, reject, or block connections
- **Connection History**: Track all connection activities
- **Network View**: See your accepted connections

### 💼 LinkedIn Integration
- **OAuth Authentication**: Secure LinkedIn account connection
- **Profile Import**: Import LinkedIn profile information
- **Connection Discovery**: Fetch and view LinkedIn connections
- **Content Sharing**: Share memories and experiences on LinkedIn
- **Professional Networking**: Connect with professional contacts

### 🐦 Twitter Integration
- **Profile Lookup**: Search and view Twitter profiles
- **Tweet Search**: Search for relevant tweets and conversations
- **Content Creation**: Share memories and experiences on Twitter
- **Social Engagement**: Like, retweet, and reply to content
- **Real-time Updates**: Live Twitter data integration

### 🧠 AI Analysis
- **Memory Analysis**: Analyze memories for sentiment and topics
- **Conversation Starters**: AI-generated conversation starters
- **Sentiment Analysis**: Understand emotional tone of memories
- **Topic Extraction**: Identify key themes and topics
- **Social Sharing**: Share analysis results on social platforms

### 🔐 Authentication & User Management
- **NextAuth Integration**: Secure authentication with multiple providers
- **Demo Login**: Test the app without OAuth setup
- **User Profiles**: Complete user profile management
- **Session Management**: Persistent user sessions
- **OAuth Providers**: Google and GitHub integration ready

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with OAuth providers
- **AI**: Anthropic Claude API, Groq API, OpenAI API
- **Search**: Google Custom Search API, Hunter.io API
- **Social APIs**: LinkedIn API, Twitter API v2
- **Icons**: React Icons (Font Awesome)
- **Notifications**: Sonner toast notifications

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- PostgreSQL database
- API keys for the integrations you want to use

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd lifeconnect
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your API keys
   ```

4. **Set up the database**:
   ```bash
   pnpm db:push
   ```

5. **Start the development server**:
   ```bash
   pnpm dev
   ```

6. **Visit the application**: `http://localhost:3000`

## 📋 Environment Setup

Create a `.env.local` file with the following variables:

```env
# Database Configuration (Required)
DATABASE_URL="your_postgresql_connection_string"

# NextAuth Configuration (Required)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# OAuth Providers (Optional - for social login)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

# AI Configuration (Optional - for AI-powered search)
ANTHROPIC_API_KEY=your_anthropic_api_key
GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=your_openai_api_key

# Search Automation APIs (Optional)
GOOGLE_API_KEY=your_google_api_key
GOOGLE_CSE_ID=your_custom_search_engine_id
HUNTER_API_KEY=your_hunter_api_key

# LinkedIn Configuration (Optional - for LinkedIn integration)
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_REDIRECT_URI=http://localhost:3000/api/linkedin/callback

# Twitter Configuration (Optional - for Twitter integration)
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
```

## 🎯 Core Features

### Memory Search
1. Navigate to the Dashboard
2. Go to the "Memory Search" tab
3. Enter a memory or experience
4. View AI-powered search results

### Search Automation
1. Go to the "Search Automation" tab
2. Fill in search criteria (name, company, job title, etc.)
3. Add keywords and years for better targeting
4. Provide email context for personalization
5. View found profiles and generated emails
6. Export results to CSV

### Timeline Management
1. Go to the "Timeline" page
2. Add your life events with details
3. Categorize events (education, work, location, personal)
4. Add tags for better searchability

### Connection Management
1. Go to the "Connections" tab
2. Send connection requests to other users
3. Accept or reject incoming requests
4. Manage your network

### AI Analysis
1. Go to the "AI Analysis" tab
2. Enter a memory to analyze
3. Optionally add a person's name
4. View sentiment analysis, topics, and conversation starters

### LinkedIn Integration
1. Go to the "LinkedIn" tab
2. Click "Connect LinkedIn Account"
3. Authorize the application
4. View connections and share content

### Twitter Integration
1. Go to the "Twitter" tab
2. Search for tweets or profiles
3. Share memories and experiences
4. Engage with relevant content

## 📊 Database Schema

The application uses PostgreSQL with the following main tables:

### `users`
- User authentication and profile information
- LinkedIn and Twitter integration data
- Created automatically by NextAuth

### `events`
- Life events and memories
- Location and time data
- Associated with users

### `connections`
- User connections and relationships
- Connection status and privacy

### `search_history`
- Track search queries and results
- Analytics and insights

### `conversation_starters`
- AI-generated conversation starters
- Memory analysis results

### `search_results`
- Search automation results
- LinkedIn profiles and generated emails

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:push          # Push schema to database
pnpm db:studio        # Open Prisma Studio
pnpm db:generate      # Generate Prisma client

# Linting
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix linting issues
```

### Project Structure

```
lifeconnect/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Authentication pages
│   └── timeline/         # Timeline pages
├── components/            # React components
│   ├── ui/               # UI components
│   └── ...               # Feature components
├── lib/                   # Utility libraries
├── prisma/               # Database schema
└── public/               # Static assets
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** with automatic builds

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- **Railway**: Easy PostgreSQL integration
- **Netlify**: Static site hosting
- **AWS**: Scalable cloud deployment
- **DigitalOcean**: VPS deployment

## 📚 Documentation

- **[API Setup Guide](API-SETUP.md)**: Complete API configuration
- **[Prisma Setup Guide](SETUP-PRISMA.md)**: Database setup instructions
- **[Features Overview](FEATURES.md)**: Detailed feature list
- **[OAuth Setup Guide](OAUTH-SETUP.md)**: Social login configuration
- **[Search Automation Setup](SEARCH-AUTOMATION-SETUP.md)**: Search automation configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please:
1. Check the documentation files
2. Review the troubleshooting guides
3. Open an issue on GitHub
4. Contact the development team

## 🎉 Success Stories

> "I found my best friend from high school after 15 years using LifeConnect's memory search!"

> "The search automation feature helped me find 50+ former colleagues and reconnect with them!"

> "The AI analysis helped me craft the perfect conversation starter to reconnect with an old colleague."

> "The timeline feature helped me organize my life events and made it easier for others to find me."

---

**LifeConnect** - Rediscover connections from your past with the power of AI and social networking! 🚀 