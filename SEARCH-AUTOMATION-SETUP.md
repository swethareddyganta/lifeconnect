# Search Automation Setup Guide

This guide will help you set up the powerful search automation feature that automates the process of finding LinkedIn profiles, extracting emails, and generating personalized cold emails.

## 🚀 Overview

The Search Automation feature provides:
- **Google Boolean Search**: Generate optimized search strings for LinkedIn profiles
- **LinkedIn Profile Scraping**: Extract profile information from Google search results
- **Email Finding**: Use Hunter.io to find email addresses
- **Cold Email Generation**: Create personalized emails using OpenAI
- **Export & Integration**: Export results to CSV and integrate with Gmail

## 📋 Required API Keys

### 1. Google Custom Search API
**Purpose**: Search for LinkedIn profiles on Google

**Setup**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the "Custom Search API"
4. Create credentials (API Key)
5. Go to [Google Custom Search](https://cse.google.com/)
6. Create a new search engine
7. Add `linkedin.com/in/` to the sites to search
8. Get your Search Engine ID (cx)

**Environment Variables**:
```env
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_CSE_ID=your_custom_search_engine_id_here
```

### 2. Hunter.io API
**Purpose**: Find email addresses for LinkedIn profiles

**Setup**:
1. Go to [Hunter.io](https://hunter.io/)
2. Sign up for an account
3. Get your API key from the dashboard
4. Verify your domain (optional but recommended)

**Environment Variables**:
```env
HUNTER_API_KEY=your_hunter_api_key_here
```

### 3. OpenAI API
**Purpose**: Generate personalized cold emails

**Setup**:
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Generate an API key
4. Add billing information (required for API usage)

**Environment Variables**:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

## 🔧 Complete Environment Setup

Add these variables to your `.env.local` file:

```env
# Search Automation APIs
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_CSE_ID=your_custom_search_engine_id_here
HUNTER_API_KEY=your_hunter_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Gmail Integration (Future Feature)
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret

# Optional: Google Sheets Integration (Future Feature)
GOOGLE_SHEETS_CLIENT_ID=your_google_sheets_client_id
GOOGLE_SHEETS_CLIENT_SECRET=your_google_sheets_client_secret
```

## 🎯 How to Use

### 1. Basic Search
1. Go to Dashboard → Search Automation
2. Fill in the search target:
   - **Name**: Person's name (optional)
   - **Company**: Company name (optional)
   - **Job Title**: Job title (optional)
   - **Location**: Location (optional)
3. Add keywords and years if needed
4. Provide email context
5. Click "Start Search"

### 2. Advanced Search
- **Keywords**: Add specific keywords to narrow down results
- **Years**: Add years to find people from specific time periods
- **Max Results**: Adjust the number of profiles to find (1-50)

### 3. Results Management
- **View Profiles**: See all found LinkedIn profiles
- **View Emails**: See generated cold emails
- **Export CSV**: Download results as CSV file
- **Send Emails**: Open emails in your default email client

## 🔍 Search Examples

### Example 1: Find Former Colleagues
```
Name: Sarah Johnson
Company: Google
Job Title: Software Engineer
Location: San Francisco
Keywords: ["Python", "Machine Learning"]
Years: [2018, 2019, 2020]
Context: "I worked with Sarah at Google and would like to reconnect about AI opportunities"
```

### Example 2: Find Alumni
```
Company: Stanford University
Job Title: Computer Science
Location: Stanford, CA
Keywords: ["Graduation", "Class of 2020"]
Years: [2020]
Context: "I'm reaching out to fellow Stanford CS alumni about career opportunities"
```

### Example 3: Find Industry Contacts
```
Job Title: Product Manager
Company: (leave empty)
Location: New York
Keywords: ["SaaS", "B2B", "Startup"]
Years: [2021, 2022, 2023]
Context: "I'm looking to connect with product managers in the SaaS space"
```

## 📊 Understanding Results

### LinkedIn Profiles
- **Name**: Person's full name
- **Title**: Current job title
- **Company**: Current company
- **Location**: Geographic location
- **Profile URL**: Direct link to LinkedIn profile
- **Email**: Found email address (if available)

### Generated Emails
- **Recipient**: Email address
- **Subject**: Personalized subject line
- **Body**: Personalized email content
- **Context**: Information about the generation

## 🛠️ Troubleshooting

### Common Issues

#### 1. "Google API key not configured"
**Solution**: 
- Verify `GOOGLE_API_KEY` is set in `.env.local`
- Check that the API key is valid
- Ensure Custom Search API is enabled

#### 2. "No profiles found"
**Solution**:
- Try broader search terms
- Remove specific filters
- Check that your search engine includes LinkedIn profiles
- Verify `GOOGLE_CSE_ID` is correct

#### 3. "No emails found"
**Solution**:
- Verify `HUNTER_API_KEY` is set
- Check your Hunter.io account status
- Try searching for larger companies (better domain coverage)

#### 4. "Email generation failed"
**Solution**:
- Verify `OPENAI_API_KEY` is set
- Check your OpenAI account billing
- Try shorter context descriptions

### API Limits

#### Google Custom Search API
- **Free Tier**: 100 queries/day
- **Paid Tier**: $5 per 1000 queries

#### Hunter.io
- **Free Tier**: 25 searches/month
- **Paid Plans**: Starting at $49/month

#### OpenAI
- **Usage-based**: ~$0.002 per 1K tokens
- **Typical cost**: $0.01-0.05 per email generated

## 🔮 Future Features

### Planned Integrations

#### 1. Gmail Integration
- Draft emails directly in Gmail
- Send emails automatically
- Track email opens and responses

#### 2. Google Sheets Integration
- Export results to Google Sheets
- Create automated reports
- Share results with team members

#### 3. Advanced Analytics
- Track search success rates
- Analyze email response rates
- Generate insights and recommendations

#### 4. Email Templates
- Custom email templates
- A/B testing for email content
- Response tracking and analytics

## 📈 Best Practices

### 1. Search Strategy
- Start with broad searches, then narrow down
- Use specific company names when possible
- Include relevant keywords from the industry
- Add location filters for better results

### 2. Email Context
- Be specific about your connection
- Mention shared experiences or interests
- Keep context concise but meaningful
- Include a clear call-to-action

### 3. Follow-up Strategy
- Track your outreach efforts
- Follow up after 3-5 days
- Personalize follow-up messages
- Maintain a professional tone

### 4. Compliance
- Respect LinkedIn's terms of service
- Don't spam or mass email without permission
- Follow email marketing best practices
- Respect privacy and data protection laws

## 🚨 Legal Considerations

### Important Notes
1. **LinkedIn Terms**: Ensure compliance with LinkedIn's terms of service
2. **Email Laws**: Follow CAN-SPAM and GDPR requirements
3. **Data Privacy**: Respect user privacy and data protection
4. **Rate Limiting**: Don't exceed API rate limits
5. **Professional Use**: Use this tool for legitimate networking purposes

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all API keys are correctly configured
3. Check your API account status and billing
4. Review the console logs for detailed error messages
5. Contact support with specific error details

---

**Search Automation** - Powerful LinkedIn profile discovery and cold email generation! 🚀 