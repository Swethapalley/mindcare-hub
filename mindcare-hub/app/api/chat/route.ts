import { NextResponse } from "next/server"

// Mock database for chat messages
const chatMessages: Record<string, any[]> = {}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const psychiatristId = searchParams.get("psychiatristId")

  if (!userId || !psychiatristId) {
    return NextResponse.json({ error: "User ID and psychiatrist ID are required" }, { status: 400 })
  }

  const chatId = `${userId}-${psychiatristId}`
  const messages = chatMessages[chatId] || []

  return NextResponse.json(messages)
}

export async function POST(request: Request) {
  try {
    const { userId, psychiatristId, message } = await request.json()

    if (!userId || !psychiatristId || !message) {
      return NextResponse.json({ error: "User ID, psychiatrist ID, and message are required" }, { status: 400 })
    }

    const chatId = `${userId}-${psychiatristId}`

    // Initialize chat if it doesn't exist
    if (!chatMessages[chatId]) {
      chatMessages[chatId] = []
    }

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: message,
      timestamp: new Date().toISOString(),
    }

    chatMessages[chatId].push(userMessage)

    // Simulate psychiatrist response
    const psychiatristMessage = {
      id: (Date.now() + 1).toString(),
      sender: "psychiatrist",
      text: getAutomaticResponse(message),
      timestamp: new Date().toISOString(),
    }

    chatMessages[chatId].push(psychiatristMessage)

    return NextResponse.json({
      userMessage,
      psychiatristMessage,
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 })
  }
}

function getAutomaticResponse(message: string): string {
  // Simple automatic responses for demo purposes
  if (message.toLowerCase().includes("hello") || message.toLowerCase().includes("hi")) {
    return `Hello! How are you feeling today?`
  } else if (message.toLowerCase().includes("appointment")) {
    return `If you'd like to schedule an appointment, you can do so from the Appointments section. When would you prefer to meet?`
  } else if (message.toLowerCase().includes("anxious") || message.toLowerCase().includes("anxiety")) {
    return `I understand that anxiety can be challenging. Can you tell me more about what you're experiencing?`
  } else if (message.toLowerCase().includes("sad") || message.toLowerCase().includes("depressed")) {
    return `I'm sorry to hear you're feeling this way. It's important to talk about these feelings. Would you like to share more about what's been going on?`
  } else {
    return `Thank you for sharing. How else can I help you today?`
  }
}

