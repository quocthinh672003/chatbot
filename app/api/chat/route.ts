import { NextRequest, NextResponse } from 'next/server';
import { v0 } from 'v0-sdk';

export async function POST(request: NextRequest) {
  try {
    const { message, chatId } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 },
      );
    }

    let chat;

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

    const response = chat as { id?: string; chatId?: string; demo?: string; url?: string };

    return NextResponse.json({
      id: response.id || response.chatId || chatId,
      demo: response.demo || response.url || '',
    });
  } catch (error) {
    console.error('V0 API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 },
    );
  }
}
