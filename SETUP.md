# LifeConnect Setup Guide

This guide will help you set up all the required services and environment variables for LifeConnect.

## 🚀 Quick Start

1. **Create Supabase Project** (Required)
2. **Set up Environment Variables**
3. **Run Database Migrations**
4. **Start the Application**

## 📋 Prerequisites

- Node.js 18+ and pnpm
- Supabase account (free tier works)
- API keys for the integrations you want to use

## 🔧 Step-by-Step Setup

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `lifeconnect` (or your preferred name)
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to you
5. Click "Create new project"
6. Wait for the project to be created (2-3 minutes)

### 2. Get Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)

### 3. Set up Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# AI Configuration
ANTHROPIC_API_KEY=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

# LinkedIn Configuration
LINKEDIN_CLIENT_ID=77ibccvtbi1jap
LINKEDIN_CLIENT_SECRET=WPL_AP1.ze7OJcqh15Tls6hu.N800tw==
LINKEDIN_REDIRECT_URI=http://localhost:3000/api/linkedin/callback

# Twitter Configuration
TWITTER_API_KEY=sn5QFf6QW6ATzfppv4VLemARv
TWITTER_API_SECRET=YWIMgcU10ASp0Gg7D7zVGsIYLgRrh7BXqifbRxunUPcYv3HF19
TWITTER_ACCESS_TOKEN=1934654791105310720-caT04LJifgrcJHzNUhA9YneFWEntRY
TWITTER_ACCESS_TOKEN_SECRET=GpoCI4PDEp740PIACiLH17shEYLDQd27ve9JDUTl3AB33
```

### 4. Set up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Run the following SQL scripts in order:

#### Create Tables

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  linkedin_id TEXT,
  linkedin_access_token TEXT,
  linkedin_profile JSONB,
  twitter_id TEXT,
  twitter_access_token TEXT,
  twitter_profile JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  location TEXT,
  start_year INTEGER,
  end_year INTEGER,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create connections table
CREATE TABLE IF NOT EXISTS connections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  requester_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(requester_id, recipient_id)
);

-- Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Events policies
CREATE POLICY "Users can view all events" ON events
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own events" ON events
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own events" ON events
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own events" ON events
  FOR DELETE USING (auth.uid() = profile_id);

-- Connections policies
CREATE POLICY "Users can view their connections" ON connections
  FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can create connection requests" ON connections
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update their connections" ON connections
  FOR UPDATE USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

-- Create functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 5. Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable the providers you want to use:
   - **Google** (recommended)
   - **GitHub**
   - **LinkedIn**
   - **Facebook**
   - **Instagram**

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Set up OAuth consent screen
6. Add authorized redirect URI: `https://your-project-ref.supabase.co/auth/v1/callback`
7. Copy Client ID and Client Secret
8. Add to Supabase Google provider settings

### 6. Install Dependencies

```bash
pnpm install
```

### 7. Start Development Server

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
2. **Test authentication**: Try signing in with Google
3. **Test AI features**: Go to Dashboard → AI Analysis
4. **Test LinkedIn**: Go to Dashboard → LinkedIn
5. **Test Twitter**: Go to Dashboard → Twitter

## 🚨 Troubleshooting

### Supabase Connection Issues
- Verify your environment variables are correct
- Check that your Supabase project is active
- Ensure the database schema is properly set up

### Authentication Issues
- Verify OAuth providers are configured in Supabase
- Check redirect URIs are correct
- Ensure environment variables are loaded

### API Integration Issues
- Verify API keys are valid and have proper permissions
- Check network connectivity
- Review browser console for CORS errors

## 📞 Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all environment variables are set
3. Ensure Supabase project is properly configured
4. Check the README.md for additional documentation

## 🎉 Success!

Once everything is set up, you should be able to:
- ✅ Sign in with OAuth providers
- ✅ Use AI-powered memory analysis
- ✅ Connect LinkedIn and share content
- ✅ Search and post on Twitter
- ✅ Find people from your past using memory search 