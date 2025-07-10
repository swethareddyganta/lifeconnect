# LifeConnect Setup Guide (Prisma + SQLite)

This guide will help you set up LifeConnect with Prisma and SQLite instead of Supabase.

## 🚀 Quick Start

1. **Set up Environment Variables**
2. **Initialize Database**
3. **Configure OAuth (Optional)**
4. **Start the Application**

## 📋 Prerequisites

- Node.js 18+ and pnpm
- API keys for the integrations you want to use

## 🔧 Step-by-Step Setup

### 1. Set up Environment Variables

Run the setup script to create your `.env.local` file:

```bash
pnpm setup
```

This will create a `.env.local` file with all the necessary environment variables.

### 2. Generate NextAuth Secret

Generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
```

Copy the output and update `NEXTAUTH_SECRET` in your `.env.local` file.

### 3. Initialize Database

Set up the SQLite database:

```bash
pnpm db:setup
```

This will:
- Generate the Prisma client
- Create the SQLite database file (`dev.db`)
- Apply the database schema

### 4. Configure OAuth Providers (Optional)

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Set up OAuth consent screen
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID and Client Secret
8. Add to your `.env.local` file

#### GitHub OAuth Setup
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: LifeConnect
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret
5. Add to your `.env.local` file

### 5. Start Development Server

```bash
pnpm dev
```

## 🔗 API Integrations Setup

### Anthropic Claude API
✅ **Already configured** with the provided API key

### LinkedIn API
✅ **Already configured** with the provided credentials

### Twitter API
✅ **Already configured** with the provided credentials

## 🧪 Testing the Setup

1. **Visit the application**: `http://localhost:3000`
2. **Test authentication**: Try signing in with Google/GitHub (if configured)
3. **Test AI features**: Go to Dashboard → AI Analysis
4. **Test LinkedIn**: Go to Dashboard → LinkedIn
5. **Test Twitter**: Go to Dashboard → Twitter

## 🗄️ Database Management

### View Database
```bash
pnpm db:studio
```
This opens Prisma Studio in your browser for database management.

### Reset Database
```bash
rm dev.db
pnpm db:setup
```

### Add Sample Data
You can add sample data through Prisma Studio or create a seed script.

## 🚨 Troubleshooting

### Database Issues
- Ensure `DATABASE_URL` is set correctly in `.env.local`
- Run `pnpm db:generate` to regenerate Prisma client
- Check that `dev.db` file exists in the root directory

### Authentication Issues
- Verify `NEXTAUTH_SECRET` is set
- Check OAuth provider credentials are correct
- Ensure redirect URIs match your setup

### API Integration Issues
- Verify API keys are valid and have proper permissions
- Check network connectivity
- Review browser console for CORS errors

## 📊 Database Schema

The application uses SQLite with the following tables:

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

## 🎉 Success!

Once everything is set up, you should be able to:
- ✅ Sign in with OAuth providers (if configured)
- ✅ Use AI-powered memory analysis
- ✅ Connect LinkedIn and share content
- ✅ Search and post on Twitter
- ✅ Find people from your past using memory search

## 🔄 Migration from Supabase

If you were previously using Supabase:

1. **Export your data** from Supabase dashboard
2. **Update environment variables** to use the new configuration
3. **Run database setup** to create the new schema
4. **Import your data** using Prisma Studio or scripts

## 📞 Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all environment variables are set
3. Ensure the database is properly initialized
4. Check the README.md for additional documentation 