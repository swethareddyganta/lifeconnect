# API Setup Guide

This guide will help you set up all the necessary API keys and environment variables for LifeConnect.

## Environment Variables

Copy the following template to your `.env.local` file and fill in your actual API keys:

```env
# Database Configuration
DATABASE_URL="your_postgresql_connection_string"

# NextAuth Configuration
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

## Required Setup

### 1. Database (Required)
- **PostgreSQL Database**: You need a PostgreSQL database. You can use:
  - [Neon](https://neon.tech) (Free tier available)
  - [Supabase](https://supabase.com) (Free tier available)
  - [Railway](https://railway.app) (Free tier available)
  - Local PostgreSQL installation

### 2. NextAuth Secret (Required)
Generate a secure random string for `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

## Optional Setup

### 3. AI APIs (Optional - for enhanced search)
The application will work without these, but AI-powered search will be disabled.

#### Groq API (Recommended)
1. Sign up at [Groq](https://console.groq.com)
2. Create an API key
3. Add to `GROQ_API_KEY`

#### Anthropic API
1. Sign up at [Anthropic](https://console.anthropic.com)
2. Create an API key
3. Add to `ANTHROPIC_API_KEY`

### 4. OAuth Providers (Optional - for social login)
The application includes a demo login that works without OAuth setup.

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Add credentials to `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

#### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Add homepage URL: `http://localhost:3000`
4. Add callback URL: `http://localhost:3000/api/auth/callback/github`
5. Add credentials to `GITHUB_ID` and `GITHUB_SECRET`

### 5. LinkedIn API (Optional)
1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Create a new app
3. Request access to Marketing Developer Platform
4. Add credentials to `LINKEDIN_CLIENT_ID` and `LINKEDIN_CLIENT_SECRET`

### 6. Twitter API (Optional)
1. Go to [Twitter Developer Portal](https://developer.twitter.com)
2. Create a new app
3. Generate access tokens
4. Add credentials to Twitter environment variables

## Testing the Setup

1. **Database**: Run `pnpm db:push` to test database connection
2. **NextAuth**: Try logging in with demo credentials
3. **AI Search**: Try searching for memories - it should work with or without AI APIs
4. **OAuth**: Try social login buttons (will redirect to OAuth providers if configured)

## Troubleshooting

### "Invalid API Key" Error
- Check that your API keys are correctly copied
- Ensure the `.env.local` file is in the project root
- Restart the development server after changing environment variables

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Ensure your database is accessible
- Check that the database exists and is running

### OAuth Issues
- Verify redirect URIs match exactly
- Check that OAuth apps are properly configured
- Ensure environment variables are correctly set

## Security Notes

- Never commit `.env.local` to version control
- Use strong, unique secrets for production
- Rotate API keys regularly
- Use environment-specific configurations for staging/production

## Production Deployment

For production deployment:
1. Set `NEXTAUTH_URL` to your production domain
2. Use production database credentials
3. Configure production OAuth redirect URIs
4. Use strong, unique secrets
5. Consider using a secrets management service 