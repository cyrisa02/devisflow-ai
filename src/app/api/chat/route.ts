import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.VISION_BACKEND_URL || 'https://cyrilgourdon.pythonanywhere.com';

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  
  // messages = [{role: 'user'|'assistant', content: string, image?: string (base64)}]
  
  try {
    const lastUserMessage = messages[messages.length - 1];
    
    const payload: any = {
      prompt: lastUserMessage.content
    };
    
    if (lastUserMessage.image) {
      payload.image_base64 = lastUserMessage.image;
    }
    
    const response = await fetch(`${BACKEND_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ error: data.error }, { status: response.status });
    }
    
    return NextResponse.json({ text: data.text, model: data.model });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur de connexion au backend' },
      { status: 500 }
    );
  }
}