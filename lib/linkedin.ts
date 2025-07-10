export interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  headline?: string;
  summary?: string;
  location?: string;
  industry?: string;
  connections?: number;
}

export interface LinkedInConnection {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  headline?: string;
  company?: string;
  position?: string;
}

class LinkedInAPI {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = process.env.LINKEDIN_CLIENT_ID || '';
    this.clientSecret = process.env.LINKEDIN_CLIENT_SECRET || '';
    this.redirectUri = process.env.LINKEDIN_REDIRECT_URI || '';
  }

  getAuthUrl(): string {
    const scope = 'r_liteprofile r_emailaddress w_member_social';
    return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${this.clientId}&redirect_uri=${encodeURIComponent(this.redirectUri)}&scope=${encodeURIComponent(scope)}&state=${Math.random().toString(36).substring(7)}`;
  }

  async getAccessToken(code: string): Promise<string> {
    try {
      const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          redirect_uri: this.redirectUri,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`LinkedIn OAuth error: ${data.error_description || data.error}`);
      }

      return data.access_token;
    } catch (error) {
      console.error('LinkedIn token exchange error:', error);
      throw new Error('Failed to get LinkedIn access token');
    }
  }

  async getProfile(accessToken: string): Promise<LinkedInProfile> {
    try {
      const response = await fetch('https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams),headline,summary,location,industry)', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      });

      if (!response.ok) {
        throw new Error(`LinkedIn API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        id: data.id,
        firstName: data.firstName.localized.en_US,
        lastName: data.lastName.localized.en_US,
        headline: data.headline,
        summary: data.summary,
        location: data.location?.name,
        industry: data.industry,
        profilePicture: data.profilePicture?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier,
      };
    } catch (error) {
      console.error('LinkedIn profile fetch error:', error);
      throw new Error('Failed to fetch LinkedIn profile');
    }
  }

  async getConnections(accessToken: string): Promise<LinkedInConnection[]> {
    try {
      const response = await fetch('https://api.linkedin.com/v2/connections?start=0&count=100', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      });

      if (!response.ok) {
        throw new Error(`LinkedIn API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.elements?.map((connection: any) => ({
        id: connection.id,
        firstName: connection.firstName,
        lastName: connection.lastName,
        headline: connection.headline,
        company: connection.company?.name,
        position: connection.position?.title,
        profilePicture: connection.profilePicture?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier,
      })) || [];
    } catch (error) {
      console.error('LinkedIn connections fetch error:', error);
      throw new Error('Failed to fetch LinkedIn connections');
    }
  }

  async sharePost(accessToken: string, text: string, visibility: 'PUBLIC' | 'CONNECTIONS' = 'PUBLIC'): Promise<void> {
    try {
      const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify({
          author: `urn:li:person:${await this.getProfile(accessToken).then(p => p.id)}`,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: {
                text: text,
              },
              shareMediaCategory: 'NONE',
            },
          },
          visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': visibility,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`LinkedIn share error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('LinkedIn share error:', error);
      throw new Error('Failed to share on LinkedIn');
    }
  }
}

export const linkedInAPI = new LinkedInAPI(); 