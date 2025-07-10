#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 LifeConnect Setup Helper\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('✅ .env.local file already exists');
} else {
  console.log('📝 Creating .env.local file...');
  
  const envContent = `# Database Configuration
DATABASE_URL="file:./dev.db"

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# OAuth Providers (Optional - Add these for authentication)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

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
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local file created');
}

console.log('\n📋 Next Steps:');
console.log('1. Generate NextAuth secret: openssl rand -base64 32');
console.log('2. Update NEXTAUTH_SECRET in .env.local');
console.log('3. (Optional) Add OAuth provider credentials');
console.log('4. Run database setup: pnpm db:setup');
console.log('5. Start the app with: pnpm dev');
console.log('\n📖 For detailed instructions, see SETUP.md'); 