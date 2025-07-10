# OAuth Provider Setup Guide

This guide will help you configure OAuth providers for social login functionality.

## 🚀 Quick Setup

### 1. Google OAuth Setup

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Create a new project or select existing one

2. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"

4. **Configure OAuth Consent Screen**
   - Add your app name: "LifeConnect"
   - Add authorized domains: `localhost`
   - Add scopes: `email`, `profile`

5. **Add Authorized Redirect URIs**
   - Add: `http://localhost:3000/api/auth/callback/google`

6. **Copy Credentials**
   - Copy the Client ID and Client Secret
   - Add to your `.env.local`:
   ```env
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   ```

### 2. GitHub OAuth Setup

1. **Go to GitHub Developer Settings**
   - Visit: https://github.com/settings/developers
   - Click "New OAuth App"

2. **Configure OAuth App**
   - **Application name**: LifeConnect
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`

3. **Copy Credentials**
   - Copy the Client ID and Client Secret
   - Add to your `.env.local`:
   ```env
   GITHUB_ID=your_client_id_here
   GITHUB_SECRET=your_client_secret_here
   ```

### 3. Generate NextAuth Secret

Generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
```

Add to your `.env.local`:
```env
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=http://localhost:3000
```

## 🧪 Testing

1. **Start the development server**:
   ```bash
   pnpm dev
   ```

2. **Visit the login page**: `http://localhost:3000/login`

3. **Test OAuth providers**:
   - Click "Continue with Google" or "Continue with GitHub"
   - You should be redirected to the OAuth provider
   - After authorization, you'll be redirected to the dashboard

## 🚨 Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**
   - Make sure the redirect URI in your OAuth app matches exactly
   - For Google: `http://localhost:3000/api/auth/callback/google`
   - For GitHub: `http://localhost:3000/api/auth/callback/github`

2. **"Client ID not found"**
   - Verify your environment variables are set correctly
   - Restart the development server after changing `.env.local`

3. **"OAuth not configured"**
   - This means the OAuth credentials are not set
   - Use the "Demo Login" button for testing without OAuth

### Demo Mode

If you don't want to set up OAuth providers right now:
- Use the "Demo Login" button on the login page
- This bypasses authentication for testing purposes
- You can still test all the other features (AI, LinkedIn, Twitter)

## 🔄 Production Setup

For production deployment:

1. **Update redirect URIs** to your production domain
2. **Set environment variables** in your hosting platform
3. **Update NEXTAUTH_URL** to your production URL
4. **Use a secure NEXTAUTH_SECRET**

## 📞 Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all environment variables are set
3. Ensure redirect URIs match exactly
4. Check the NextAuth documentation: https://next-auth.js.org/ 