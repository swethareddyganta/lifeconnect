export interface TwitterProfile {
  id: string;
  username: string;
  name: string;
  profileImageUrl?: string;
  description?: string;
  followersCount: number;
  followingCount: number;
  tweetCount: number;
}

export interface TwitterTweet {
  id: string;
  text: string;
  created_at: string;
  public_metrics?: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
}

class TwitterAPI {
  private apiKey: string;
  private apiSecret: string;
  private accessToken: string;
  private accessTokenSecret: string;

  constructor() {
    this.apiKey = process.env.TWITTER_API_KEY || '';
    this.apiSecret = process.env.TWITTER_API_SECRET || '';
    this.accessToken = process.env.TWITTER_ACCESS_TOKEN || '';
    this.accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET || '';
  }

  private async makeRequest(endpoint: string, method: 'GET' | 'POST' = 'GET', body?: any): Promise<any> {
    const url = `https://api.twitter.com/2${endpoint}`;
    
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body && method === 'POST') {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`Twitter API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Twitter API request error:', error);
      throw new Error('Failed to make Twitter API request');
    }
  }

  async getProfile(username: string): Promise<TwitterProfile> {
    try {
      const data = await this.makeRequest(`/users/by/username/${username}?user.fields=profile_image_url,description,public_metrics`);
      
      return {
        id: data.data.id,
        username: data.data.username,
        name: data.data.name,
        profileImageUrl: data.data.profile_image_url,
        description: data.data.description,
        followersCount: data.data.public_metrics?.followers_count || 0,
        followingCount: data.data.public_metrics?.following_count || 0,
        tweetCount: data.data.public_metrics?.tweet_count || 0,
      };
    } catch (error) {
      console.error('Twitter profile fetch error:', error);
      throw new Error('Failed to fetch Twitter profile');
    }
  }

  async searchTweets(query: string, maxResults: number = 10): Promise<TwitterTweet[]> {
    try {
      const data = await this.makeRequest(`/tweets/search/recent?query=${encodeURIComponent(query)}&max_results=${maxResults}&tweet.fields=created_at,public_metrics`);
      
      return data.data?.map((tweet: any) => ({
        id: tweet.id,
        text: tweet.text,
        created_at: tweet.created_at,
        public_metrics: tweet.public_metrics,
      })) || [];
    } catch (error) {
      console.error('Twitter search error:', error);
      throw new Error('Failed to search Twitter tweets');
    }
  }

  async getUserTweets(userId: string, maxResults: number = 10): Promise<TwitterTweet[]> {
    try {
      const data = await this.makeRequest(`/users/${userId}/tweets?max_results=${maxResults}&tweet.fields=created_at,public_metrics`);
      
      return data.data?.map((tweet: any) => ({
        id: tweet.id,
        text: tweet.text,
        created_at: tweet.created_at,
        public_metrics: tweet.public_metrics,
      })) || [];
    } catch (error) {
      console.error('Twitter user tweets fetch error:', error);
      throw new Error('Failed to fetch user tweets');
    }
  }

  async createTweet(text: string): Promise<{ id: string; text: string }> {
    try {
      const data = await this.makeRequest('/tweets', 'POST', {
        text: text,
      });
      
      return {
        id: data.data.id,
        text: data.data.text,
      };
    } catch (error) {
      console.error('Twitter tweet creation error:', error);
      throw new Error('Failed to create tweet');
    }
  }

  async replyToTweet(tweetId: string, text: string): Promise<{ id: string; text: string }> {
    try {
      const data = await this.makeRequest('/tweets', 'POST', {
        text: text,
        reply: {
          in_reply_to_tweet_id: tweetId,
        },
      });
      
      return {
        id: data.data.id,
        text: data.data.text,
      };
    } catch (error) {
      console.error('Twitter reply error:', error);
      throw new Error('Failed to reply to tweet');
    }
  }

  async likeTweet(tweetId: string): Promise<void> {
    try {
      await this.makeRequest(`/users/${await this.getCurrentUserId()}/likes`, 'POST', {
        tweet_id: tweetId,
      });
    } catch (error) {
      console.error('Twitter like error:', error);
      throw new Error('Failed to like tweet');
    }
  }

  async retweet(tweetId: string): Promise<void> {
    try {
      await this.makeRequest(`/users/${await this.getCurrentUserId()}/retweets`, 'POST', {
        tweet_id: tweetId,
      });
    } catch (error) {
      console.error('Twitter retweet error:', error);
      throw new Error('Failed to retweet');
    }
  }

  private async getCurrentUserId(): Promise<string> {
    try {
      const data = await this.makeRequest('/users/me');
      return data.data.id;
    } catch (error) {
      console.error('Twitter current user fetch error:', error);
      throw new Error('Failed to get current user ID');
    }
  }
}

export const twitterAPI = new TwitterAPI(); 