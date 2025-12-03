# 📚 HƯỚNG DẪN ĐỌC DOCS & CUSTOM UI CHATGPT

> **Tài liệu phân tích source code project chatbot**  
> Tác giả: AI Assistant  
> Ngày: 2025-12-03

---

## 📑 MỤC LỤC

1. [Cấu trúc thư mục](#-1-cấu-trúc-thư-mục)
2. [Phân tích file quan trọng](#-2-phân-tích-file-quan-trọng)
3. [AI Elements Components](#-3-ai-elements-components)
4. [Nơi custom UI](#-4-nơi-custom-ui)
5. [Kết nối MCP](#-5-kết-nối-mcp)
6. [Docs cần đọc](#-6-docs-cần-đọc)
7. [Roadmap build ChatGPT UI](#-7-roadmap-build-chatgpt-ui)

---

## 🗂️ 1. CẤU TRÚC THƯ MỤC

### 📁 Tổng quan

```
D:\chatbot\
├── app/                      ← Next.js App Router (QUAN TRỌNG)
│   ├── page.tsx              ← Main UI (có thể custom)
│   ├── layout.tsx            ← Layout wrapper
│   ├── globals.css           ← Global styles
│   └── api/
│       └── chat/
│           └── route.ts      ← API endpoint (kết nối AI)
│
├── components/
│   ├── ai-elements/          ← AI Elements components (19 files)
│   │   ├── message.tsx       ← Chat bubbles
│   │   ├── prompt-input.tsx  ← Input field
│   │   ├── conversation.tsx  ← Chat container
│   │   ├── loader.tsx        ← Loading animation
│   │   ├── code-block.tsx    ← Code highlighting
│   │   ├── model-selector.tsx← Model dropdown
│   │   └── ... 13 files khác
│   │
│   └── ui/                   ← shadcn/ui base components
│       ├── button.tsx
│       ├── input.tsx
│       └── ... 16 files khác
│
├── lib/
│   └── utils.ts              ← Helper functions (cn, clsx...)
│
├── public/                   ← Static assets
├── package.json              ← Dependencies
├── tsconfig.json             ← TypeScript config
├── next.config.ts            ← Next.js config
└── vercel.json               ← Vercel deployment
```

### 📊 Vai trò từng thư mục

| Thư mục | Vai trò | Có thể edit? |
|---------|---------|--------------|
| **`app/`** | Core application, routing, pages | ✅ CẦN EDIT |
| **`components/ai-elements/`** | AI-specific UI components | ✅ CÓ THỂ CUSTOM |
| **`components/ui/`** | Base UI components (shadcn) | ❌ Không nên |
| **`lib/`** | Utility functions | ❌ Không cần |
| **`public/`** | Images, fonts, static files | ✅ Thêm assets |

---

## 📝 2. PHÂN TÍCH FILE QUAN TRỌNG

### 🎯 File 1: `app/page.tsx` (190 dòng)

**Đây là file QUAN TRỌNG NHẤT - Main UI của app**

#### Structure Overview

```typescript
// IMPORTS (Line 1-22)
import { PromptInput, Message, Conversation, ... }

// STATE MANAGEMENT (Line 29-38)
const [message, setMessage] = useState('');
const [chatHistory, setChatHistory] = useState([]);
const [isLoading, setIsLoading] = useState(false);

// EVENT HANDLER (Line 40-91)
const handleSendMessage = async (promptMessage) => {
  // 1. Add user message
  // 2. Call API
  // 3. Add AI response
};

// UI RENDER (Line 93-189)
return (
  <div className="h-screen flex">
    {/* Left: Chat Panel */}
    {/* Right: Preview Panel */}
  </div>
);
```

#### Chi tiết từng phần

##### **PHẦN 1: Imports (Line 1-22)**

```typescript
// AI Elements Components
import { PromptInput } from '@/components/ai-elements/prompt-input';
// → Component để nhập tin nhắn (textarea + send button)

import { Message, MessageContent } from '@/components/ai-elements/message';
// → Component hiển thị chat bubbles (user & AI)

import { Conversation, ConversationContent } from '@/components/ai-elements/conversation';
// → Container cho toàn bộ chat history

import { WebPreview } from '@/components/ai-elements/web-preview';
// → Preview panel (dùng cho v0 clone, có thể bỏ nếu làm ChatGPT thuần)

import { Loader } from '@/components/ai-elements/loader';
// → Loading animation (ba chấm "...")

import { Suggestions, Suggestion } from '@/components/ai-elements/suggestion';
// → Quick prompt chips
```

##### **PHẦN 2: State Management (Line 29-38)**

```typescript
const [message, setMessage] = useState('');
// → Lưu text đang gõ trong input

const [currentChat, setCurrentChat] = useState<Chat | null>(null);
// → Lưu thông tin chat hiện tại (id, demo URL)

const [isLoading, setIsLoading] = useState(false);
// → True khi đang gọi API, false khi xong

const [chatHistory, setChatHistory] = useState<Array<{
  type: 'user' | 'assistant';
  content: string;
}>>([]);
// → Mảng lưu toàn bộ messages
```

##### **PHẦN 3: Handle Send Message (Line 40-91)**

```typescript
const handleSendMessage = async (promptMessage: PromptInputMessage) => {
  // Bước 1: Validation
  if (!promptMessage.text || isLoading) return;
  
  // Bước 2: Thêm user message vào history
  setChatHistory((prev) => [
    ...prev, 
    { type: 'user', content: userMessage }
  ]);
  
  // Bước 3: Call API
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message: userMessage })
  });
  
  // Bước 4: Parse response
  const chat = await response.json();
  
  // Bước 5: Thêm AI response vào history
  setChatHistory((prev) => [
    ...prev,
    { type: 'assistant', content: chat.response }
  ]);
};
```

**🎨 Custom điểm này để:**
- Thay đổi cách xử lý response
- Thêm streaming text
- Error handling
- Retry logic

##### **PHẦN 4: UI Structure (Line 93-189)**

```typescript
return (
  <div className="h-screen flex">
    {/* ========== LEFT PANEL: CHAT ========== */}
    <div className="w-1/2 flex flex-col border-r">
      
      {/* Header (Line 98-100) */}
      <div className="border-b p-3 h-14">
        <h1>v0 Clone</h1>  {/* ← Đổi thành "ChatGPT" */}
      </div>

      {/* Chat Area (Line 102-130) */}
      <div className="flex-1 overflow-y-auto p-4">
        {chatHistory.length === 0 ? (
          // Welcome screen
          <div className="text-center">
            <p>What can we build together?</p>
            {/* ← Custom thành "How can I help you today?" */}
          </div>
        ) : (
          // Messages
          <Conversation>
            {chatHistory.map((msg) => (
              <Message from={msg.type}>
                <MessageContent>{msg.content}</MessageContent>
              </Message>
            ))}
          </Conversation>
        )}
      </div>

      {/* Input Area (Line 132-171) */}
      <div className="border-t p-4">
        {/* Suggestions */}
        <Suggestions>
          <Suggestion>Create a navbar</Suggestion>
        </Suggestions>

        {/* Prompt Input */}
        <PromptInput onSubmit={handleSendMessage}>
          <PromptInputTextarea 
            placeholder="Type your message..."
            {/* ← Đổi thành "Message ChatGPT..." */}
          />
          <PromptInputSubmit />
        </PromptInput>
      </div>
    </div>

    {/* ========== RIGHT PANEL: PREVIEW ========== */}
    <div className="w-1/2">
      <WebPreview>
        {/* ← Có thể bỏ panel này nếu làm ChatGPT thuần */}
      </WebPreview>
    </div>
  </div>
);
```

#### 🎨 Nơi custom UI trong file này

| Dòng | Code hiện tại | Custom thành | Mục đích |
|------|---------------|--------------|----------|
| **94** | `className="h-screen flex"` | `className="h-screen flex flex-col"` | Layout 1 cột (không split) |
| **96** | `className="w-1/2"` | `className="w-full max-w-4xl mx-auto"` | Full width, center |
| **99** | `<h1>v0 Clone</h1>` | `<h1>ChatGPT</h1>` | Title |
| **105** | `What can we build together?` | `How can I help you today?` | Welcome text |
| **112** | `<Message from={msg.type}>` | Add avatar, colors | Custom bubbles |
| **159** | `placeholder="Type..."` | `placeholder="Message ChatGPT..."` | Input hint |
| **175** | `<div className="w-1/2">...</div>` | Xóa hoặc comment | Bỏ preview panel |

---

### 🔌 File 2: `app/api/chat/route.ts` (42 dòng)

**Backend API endpoint - Nơi kết nối với AI/MCP**

#### Structure

```typescript
// IMPORTS
import { NextRequest, NextResponse } from 'next/server';
import { v0 } from 'v0-sdk';  // ← Hiện dùng v0 SDK

// API HANDLER
export async function POST(request: NextRequest) {
  // 1. Parse request body
  const { message, chatId } = await request.json();

  // 2. Validate
  if (!message) {
    return NextResponse.json({ error: 'Message required' }, { status: 400 });
  }

  // 3. Call AI API
  let chat = await v0.chats.create({ message });

  // 4. Return response
  return NextResponse.json({
    id: chat.id,
    demo: chat.demo
  });
}
```

#### 🔄 Đổi từ v0 sang OpenAI

**HIỆN TẠI (v0 SDK):**
```typescript
import { v0 } from 'v0-sdk';

const chat = await v0.chats.create({
  message: userMessage
});

return NextResponse.json({
  id: chat.id,
  demo: chat.demo
});
```

**ĐỔI THÀNH (OpenAI):**
```typescript
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

const result = await streamText({
  model: openai('gpt-4o-mini'),
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: message }
  ],
});

return result.toTextStreamResponse();
```

#### 🔗 Hoặc kết nối MCP

```typescript
import { MCPClient } from '@modelcontextprotocol/sdk';

const client = new MCPClient();
await client.connect(process.env.MCP_SERVER_URL);

const response = await client.callTool({
  name: 'chat',
  arguments: { message }
});

return NextResponse.json({ response: response.content });
```

---

## 🎨 3. AI ELEMENTS COMPONENTS

### 📦 Danh sách components có sẵn

| Component | File | Dùng để | Docs |
|-----------|------|---------|------|
| **Message** | `message.tsx` | Chat bubbles | [Link](https://v6.ai-sdk.dev/elements/components/message) |
| **PromptInput** | `prompt-input.tsx` | Input field | [Link](https://v6.ai-sdk.dev/elements/components/prompt-input) |
| **Conversation** | `conversation.tsx` | Chat container | [Link](https://v6.ai-sdk.dev/elements/components/conversation) |
| **Loader** | `loader.tsx` | Loading animation | [Link](https://v6.ai-sdk.dev/elements/components/loader) |
| **CodeBlock** | `code-block.tsx` | Code highlighting | [Link](https://v6.ai-sdk.dev/elements/components/code-block) |
| **ModelSelector** | `model-selector.tsx` | Model dropdown | [Link](https://v6.ai-sdk.dev/elements/components/model-selector) |
| **Suggestions** | `suggestion.tsx` | Quick prompts | [Link](https://v6.ai-sdk.dev/elements/components/suggestion) |
| **ChainOfThought** | `chain-of-thought.tsx` | AI reasoning | [Link](https://v6.ai-sdk.dev/elements/components/chain-of-thought) |
| **Artifact** | `artifact.tsx` | Preview HTML/React | [Link](https://v6.ai-sdk.dev/elements/components/artifact) |
| **WebPreview** | `web-preview.tsx` | iframe preview | [Link](https://v6.ai-sdk.dev/elements/components/web-preview) |

### 🔍 Chi tiết các components quan trọng

#### 1. **Message Component** (449 dòng)

**File:** `components/ai-elements/message.tsx`

**Cấu trúc:**
```typescript
<Message from="user" | "assistant">
  <MessageContent>
    Your message here
  </MessageContent>
  <MessageActions>
    <MessageAction>Copy</MessageAction>
    <MessageAction>Regenerate</MessageAction>
  </MessageActions>
</Message>
```

**Props:**
- `from`: "user" hoặc "assistant"
- `avatar`: Custom avatar component
- `className`: Custom styles

**Default styling (Line 30-39):**
```typescript
className={cn(
  "max-w-[80%]",                      // Max width 80%
  from === "user" 
    ? "ml-auto justify-end"           // User: right align
    : "is-assistant",                 // AI: left align
)}
```

**Custom để giống ChatGPT:**
```typescript
// Trong app/page.tsx
<Message 
  from="user"
  className="max-w-3xl"              // Rộng hơn
  avatar={<img src="/user.png" />}   // Custom avatar
>
  <MessageContent 
    className="bg-blue-600 text-white rounded-3xl px-6 py-3"
  >
    {msg.content}
  </MessageContent>
</Message>
```

#### 2. **PromptInput Component** (1405 dòng)

**File:** `components/ai-elements/prompt-input.tsx`

**Cấu trúc:**
```typescript
<PromptInput onSubmit={handleSubmit}>
  <PromptInputTextarea 
    placeholder="Message ChatGPT..."
    value={input}
    onChange={(e) => setInput(e.target.value)}
  />
  <PromptInputAttachments />  {/* File upload */}
  <PromptInputSubmit 
    status={isLoading ? 'streaming' : 'ready'}
  />
</PromptInput>
```

**Features:**
- Multiline textarea
- File upload
- Submit button
- Stop button (khi streaming)
- Auto-resize

**Custom styles:**
```typescript
<PromptInput className="max-w-3xl mx-auto">
  <PromptInputTextarea 
    className="
      min-h-[60px] 
      rounded-3xl 
      bg-gray-100 
      dark:bg-gray-800
      border-none
      focus:ring-2
      focus:ring-blue-500
    "
  />
</PromptInput>
```

#### 3. **Conversation Component** (101 dòng)

**File:** `components/ai-elements/conversation.tsx`

**Cấu trúc:**
```typescript
<Conversation>
  <ConversationContent>
    {messages.map(msg => (
      <Message key={msg.id} from={msg.role}>
        <MessageContent>{msg.content}</MessageContent>
      </Message>
    ))}
  </ConversationContent>
</Conversation>
```

**Custom:**
```typescript
<Conversation className="max-w-4xl mx-auto">
  <ConversationContent className="space-y-6 px-4">
    {/* Messages */}
  </ConversationContent>
</Conversation>
```

#### 4. **CodeBlock Component** (179 dòng)

**File:** `components/ai-elements/code-block.tsx`

**Tự động highlight code trong messages:**

```typescript
<Message from="assistant">
  <MessageContent>
    Here's the code:
    ```python
    def hello():
        print("Hello")
    ```
  </MessageContent>
</Message>
```

**Features:**
- Syntax highlighting (Shiki)
- Copy button
- Language badge
- Line numbers

---

## 🎯 4. NƠI CUSTOM UI

### Checklist: Build ChatGPT UI

#### ✅ Phase 1: Layout & Structure

**File: `app/page.tsx`**

- [ ] **Remove split layout** (Line 94)
  ```typescript
  // BEFORE
  <div className="h-screen flex">
    <div className="w-1/2">Chat</div>
    <div className="w-1/2">Preview</div>
  </div>
  
  // AFTER
  <div className="h-screen flex flex-col">
    <div>Header</div>
    <div className="flex-1">Chat</div>
    <div>Input</div>
  </div>
  ```

- [ ] **Add header with model selector** (Line 98-100)
  ```typescript
  <header className="border-b px-4 py-3 flex items-center justify-between">
    <h1 className="text-lg font-semibold">ChatGPT</h1>
    <ModelSelector />
  </header>
  ```

- [ ] **Center chat area** (Line 102)
  ```typescript
  <div className="flex-1 overflow-y-auto">
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Conversation>
        {/* Messages */}
      </Conversation>
    </div>
  </div>
  ```

#### ✅ Phase 2: Welcome Screen

- [ ] **Custom welcome message** (Line 104-106)
  ```typescript
  {chatHistory.length === 0 && (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold mb-8">
        How can I help you today?
      </h1>
      <div className="grid grid-cols-2 gap-4 max-w-2xl">
        <Suggestion>Write a poem</Suggestion>
        <Suggestion>Explain quantum physics</Suggestion>
        <Suggestion>Plan a trip to Japan</Suggestion>
        <Suggestion>Debug my code</Suggestion>
      </div>
    </div>
  )}
  ```

#### ✅ Phase 3: Message Styling

- [ ] **Custom user messages** (Line 112-114)
  ```typescript
  <Message 
    from="user"
    className="max-w-3xl mx-auto"
  >
    <MessageContent className="
      bg-gray-100 dark:bg-gray-700
      rounded-3xl
      px-5 py-3
      text-gray-900 dark:text-gray-100
    ">
      {msg.content}
    </MessageContent>
  </Message>
  ```

- [ ] **Custom AI messages**
  ```typescript
  <Message 
    from="assistant"
    className="max-w-3xl mx-auto"
    avatar={<div className="w-8 h-8 rounded-full bg-green-500" />}
  >
    <MessageContent className="
      bg-transparent
      rounded-3xl
      text-gray-900 dark:text-gray-100
    ">
      {msg.content}
    </MessageContent>
    <MessageActions>
      <MessageAction tooltip="Copy">📋</MessageAction>
      <MessageAction tooltip="Regenerate">🔄</MessageAction>
    </MessageActions>
  </Message>
  ```

#### ✅ Phase 4: Input Area

- [ ] **Custom prompt input** (Line 155-169)
  ```typescript
  <div className="border-t bg-white dark:bg-gray-900 p-4">
    <div className="max-w-3xl mx-auto">
      <PromptInput 
        onSubmit={handleSendMessage}
        className="relative"
      >
        <PromptInputTextarea
          placeholder="Message ChatGPT..."
          className="
            w-full
            rounded-3xl
            bg-gray-100 dark:bg-gray-800
            border-none
            px-6 py-4
            pr-12
            focus:ring-2
            focus:ring-blue-500
          "
        />
        <PromptInputSubmit 
          className="absolute bottom-2 right-2"
          status={isLoading ? 'streaming' : 'ready'}
        />
      </PromptInput>
    </div>
  </div>
  ```

#### ✅ Phase 5: Advanced Features

- [ ] **Add regenerate button**
  ```typescript
  const [lastUserMessage, setLastUserMessage] = useState('');
  
  const handleRegenerate = () => {
    // Remove last AI message
    setChatHistory(prev => prev.slice(0, -1));
    // Resend last user message
    handleSendMessage({ text: lastUserMessage });
  };
  
  <MessageAction onClick={handleRegenerate}>
    🔄 Regenerate
  </MessageAction>
  ```

- [ ] **Add stop generation**
  ```typescript
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const handleStop = () => {
    abortControllerRef.current?.abort();
  };
  
  <PromptInputSubmit 
    status={isLoading ? 'streaming' : 'ready'}
    onStop={handleStop}
  />
  ```

- [ ] **Add dark mode toggle**
  ```typescript
  import { useTheme } from 'next-themes';
  
  const { theme, setTheme } = useTheme();
  
  <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
    {theme === 'dark' ? '🌞' : '🌙'}
  </Button>
  ```

---

## 🔌 5. KẾT NỐI MCP

### MCP là gì?

**MCP (Model Context Protocol)** = Chuẩn giao thức để AI model kết nối với external tools

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Your App  │ ───▶ │  MCP Server │ ───▶ │    Tools    │
│  (Frontend) │      │  (Backend)  │      │ (DB, APIs)  │
└─────────────┘      └─────────────┘      └─────────────┘
```

### Tài liệu MCP

- **Official docs:** https://modelcontextprotocol.io/
- **GitHub:** https://github.com/modelcontextprotocol
- **Examples:** https://github.com/modelcontextprotocol/typescript-sdk

### Setup MCP trong project

#### Bước 1: Install SDK

```bash
npm install @modelcontextprotocol/sdk
```

#### Bước 2: Tạo MCP Client

**File: `lib/mcp-client.ts`**

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

export async function createMCPClient() {
  const transport = new StdioClientTransport({
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-memory'],
  });

  const client = new Client({
    name: 'chatbot-client',
    version: '1.0.0',
  }, {
    capabilities: {
      tools: {},
    },
  });

  await client.connect(transport);
  return client;
}
```

#### Bước 3: Sử dụng trong API

**File: `app/api/chat/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createMCPClient } from '@/lib/mcp-client';

export async function POST(request: NextRequest) {
  const { message } = await request.json();

  // Connect to MCP server
  const client = await createMCPClient();

  // List available tools
  const tools = await client.listTools();
  console.log('Available tools:', tools);

  // Call a tool
  const result = await client.callTool({
    name: 'search',
    arguments: {
      query: message
    }
  });

  return NextResponse.json({
    response: result.content
  });
}
```

#### Bước 4: MCP Servers có sẵn

| Server | Mô tả | Package |
|--------|-------|---------|
| **Memory** | Long-term memory | `@modelcontextprotocol/server-memory` |
| **Filesystem** | File operations | `@modelcontextprotocol/server-filesystem` |
| **GitHub** | GitHub API | `@modelcontextprotocol/server-github` |
| **Google Drive** | Drive API | `@modelcontextprotocol/server-gdrive` |
| **Brave Search** | Web search | `@modelcontextprotocol/server-brave-search` |

**Example: Sử dụng Memory server**

```bash
# Install
npm install @modelcontextprotocol/server-memory

# Sử dụng
const transport = new StdioClientTransport({
  command: 'npx',
  args: ['-y', '@modelcontextprotocol/server-memory'],
});
```

---

## 📖 6. DOCS CẦN ĐỌC

### AI Elements Docs (Quan trọng)

| Docs | Link | Mục đích |
|------|------|----------|
| **Chatbot Example** | https://v6.ai-sdk.dev/elements/examples/chatbot | Build chatbot cơ bản |
| **Message Component** | https://v6.ai-sdk.dev/elements/components/message | Custom chat bubbles |
| **PromptInput Component** | https://v6.ai-sdk.dev/elements/components/prompt-input | Custom input field |
| **Conversation Component** | https://v6.ai-sdk.dev/elements/components/conversation | Chat container |
| **CodeBlock Component** | https://v6.ai-sdk.dev/elements/components/code-block | Code highlighting |
| **ModelSelector Component** | https://v6.ai-sdk.dev/elements/components/model-selector | Model dropdown |
| **ChainOfThought Component** | https://v6.ai-sdk.dev/elements/components/chain-of-thought | AI reasoning |

### AI SDK Docs

| Docs | Link | Mục đích |
|------|------|----------|
| **AI SDK Core** | https://sdk.vercel.ai/docs | Core concepts |
| **OpenAI Provider** | https://sdk.vercel.ai/providers/ai-sdk-providers/openai | Connect OpenAI |
| **Streaming** | https://sdk.vercel.ai/docs/ai-sdk-core/streaming | Text streaming |
| **Tools** | https://sdk.vercel.ai/docs/ai-sdk-core/tools | Function calling |

### MCP Docs

| Docs | Link | Mục đích |
|------|------|----------|
| **MCP Introduction** | https://modelcontextprotocol.io/ | What is MCP |
| **TypeScript SDK** | https://github.com/modelcontextprotocol/typescript-sdk | SDK docs |
| **Servers Registry** | https://github.com/modelcontextprotocol/servers | Available servers |

### Next.js Docs

| Docs | Link | Mục đích |
|------|------|----------|
| **App Router** | https://nextjs.org/docs/app | App routing |
| **API Routes** | https://nextjs.org/docs/app/building-your-application/routing/route-handlers | API endpoints |
| **Streaming** | https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming | SSR streaming |

---

## 🗺️ 7. ROADMAP BUILD CHATGPT UI

### Phase 1: Setup Base (1 giờ)

- [ ] ✅ Đã có: Next.js project
- [ ] ✅ Đã có: AI Elements installed
- [ ] ✅ Đã có: Basic v0 clone UI
- [ ] 🔲 Đọc docs: Chatbot example
- [ ] 🔲 Đọc docs: Message component
- [ ] 🔲 Đọc docs: PromptInput component

### Phase 2: Layout & Structure (2 giờ)

- [ ] Remove split layout (1 cột thay vì 2)
- [ ] Add header với model selector
- [ ] Center chat area (max-width 3xl)
- [ ] Custom welcome screen
- [ ] Add suggestions grid

### Phase 3: Message Styling (2 giờ)

- [ ] Custom user message bubbles
  - Background color
  - Border radius
  - Padding
  - Max width
- [ ] Custom AI message bubbles
  - Avatar
  - Background
  - Actions (copy, regenerate)
- [ ] Add message timestamps
- [ ] Add message status (sending, sent, error)

### Phase 4: Input Area (1 giờ)

- [ ] Custom PromptInput styling
  - Rounded corners
  - Shadow
  - Focus state
- [ ] Add file upload button
- [ ] Add stop generation button
- [ ] Add character count (optional)

### Phase 5: Backend (2 giờ)

#### Option A: OpenAI
- [ ] Đổi từ v0 SDK sang OpenAI SDK
- [ ] Implement text streaming
- [ ] Add system prompt
- [ ] Handle errors

#### Option B: MCP
- [ ] Install MCP SDK
- [ ] Create MCP client
- [ ] Connect to MCP server
- [ ] Test tools

### Phase 6: Advanced Features (3 giờ)

- [ ] Regenerate response
- [ ] Copy message
- [ ] Edit message
- [ ] Delete message
- [ ] Dark mode toggle
- [ ] Save chat history (localStorage)
- [ ] Export chat (markdown/txt)
- [ ] Search messages

### Phase 7: Polish & Deploy (1 giờ)

- [ ] Responsive design (mobile)
- [ ] Loading states
- [ ] Error messages
- [ ] Empty states
- [ ] Accessibility (keyboard nav)
- [ ] SEO metadata
- [ ] Deploy to Vercel
- [ ] Test production

---

## 📝 GHI CHÚ QUAN TRỌNG

### ⚠️ Lưu ý khi custom

1. **Không edit `components/ui/*`** - Đây là base components từ shadcn
2. **Có thể edit `components/ai-elements/*`** - Nhưng nên override bằng className trong `app/page.tsx` thay vì edit trực tiếp
3. **Environment variables** - Thêm vào `.env.local`:
   ```
   OPENAI_API_KEY=sk-...
   V0_API_KEY=v0_...
   MCP_SERVER_URL=http://localhost:3000
   ```
4. **Vercel deployment** - Nhớ add environment variables trên Vercel dashboard

### 🐛 Debug tips

- **Console log** trong `app/page.tsx` để xem state
- **Network tab** để xem API responses
- **React DevTools** để inspect components
- **Vercel logs** để debug production

### 🚀 Performance tips

- Use `React.memo()` cho Message component
- Virtualize long chat history (react-window)
- Debounce input onChange
- Lazy load code highlighting

---

## 📞 LIÊN HỆ & HỖ TRỢ

- **AI Elements GitHub:** https://github.com/vercel/ai-elements
- **AI SDK Discord:** https://discord.gg/vercel
- **Docs feedback:** https://github.com/vercel/ai/issues

---

**🎉 Chúc bạn thành công với project ChatGPT clone!**

*Tài liệu này được tạo bởi AI Assistant để hướng dẫn custom UI ChatGPT với AI Elements*

