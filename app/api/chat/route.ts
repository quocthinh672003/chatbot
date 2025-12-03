import { NextRequest, NextResponse } from 'next/server';
import { v0 } from 'v0-sdk';

interface V0ChatResponse {
  id?: string;
  chatId?: string;
  demo?: string;
  url?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { message, chatId } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 },
      );
    }

    let chat: V0ChatResponse;

    if (chatId) {
      chat = await v0.chats.sendMessage({
        chatId: chatId,
        message,
      });
    } else {
      chat = await v0.chats.create({
        message,
      });
    }

    return NextResponse.json({
      id: chat.id || chat.chatId || chatId,
      demo: chat.demo || chat.url || '',
    });
  } catch (error) {
    console.error('V0 API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 },
    );
  }
}
