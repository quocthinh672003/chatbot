import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await streamText({
    model: openai("gpt-4o-mini"),
    messages,
  });

  return response.toTextStreamResponse();
}
