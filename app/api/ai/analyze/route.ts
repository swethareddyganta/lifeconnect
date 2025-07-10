import { NextRequest, NextResponse } from 'next/server';
import { analyzeMemory, generateConversationStarter } from '@/lib/anthropic';

export async function POST(request: NextRequest) {
  try {
    const { memory, personName } = await request.json();
    
    if (!memory) {
      return NextResponse.json({ error: 'Memory text is required' }, { status: 400 });
    }

    // Analyze the memory
    const analysis = await analyzeMemory(memory);
    
    // Generate conversation starter if person name is provided
    let conversationStarter = null;
    if (personName) {
      conversationStarter = await generateConversationStarter(memory, personName);
    }
    
    return NextResponse.json({ 
      analysis,
      conversationStarter
    });
  } catch (error) {
    console.error('AI analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze memory' }, { status: 500 });
  }
} 