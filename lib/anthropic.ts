import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface AIAnalysisResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  topics: string[];
  summary: string;
  suggestions: string[];
}

export async function analyzeMemory(memory: string): Promise<AIAnalysisResult> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `Analyze this memory and provide insights: "${memory}"
          
          Please respond with a JSON object containing:
          - sentiment: "positive", "negative", or "neutral"
          - topics: array of relevant topics/tags
          - summary: brief summary of the memory
          - suggestions: array of potential conversation starters or follow-up questions`
        }
      ]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      try {
        return JSON.parse(content.text);
      } catch (error) {
        console.error('Failed to parse AI response:', error);
        return {
          sentiment: 'neutral',
          topics: [],
          summary: 'Unable to analyze memory',
          suggestions: []
        };
      }
    }
    
    throw new Error('Unexpected response format from Anthropic');
  } catch (error) {
    console.error('Anthropic API error:', error);
    throw new Error('Failed to analyze memory');
  }
}

export async function generateConversationStarter(memory: string, personName: string): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: `Based on this memory: "${memory}", generate a natural conversation starter to ask ${personName} about this shared experience. Keep it casual and friendly.`
        }
      ]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return content.text.trim();
    }
    
    throw new Error('Unexpected response format from Anthropic');
  } catch (error) {
    console.error('Anthropic API error:', error);
    return "Hey! I was thinking about that time we...";
  }
} 