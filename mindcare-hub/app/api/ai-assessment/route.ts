import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { symptoms, duration, severity } = await request.json()

    // Validate input
    if (!symptoms || !duration || !severity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Use AI SDK to generate a response based on symptoms
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        As a mental health screening assistant, analyze the following symptoms and provide a preliminary assessment.
        This is NOT a diagnosis, just an initial screening to help the user understand if they should seek professional help.
        
        Symptoms: ${symptoms}
        Duration: ${duration}
        Severity: ${severity}
        
        Provide a brief assessment of what these symptoms might indicate, potential mental health concerns, 
        and a clear recommendation on whether the user should consult with a mental health professional.
        Format your response in a compassionate, non-alarming way.
      `,
    })

    return NextResponse.json({
      assessment: text,
      recommendConsultation: text.toLowerCase().includes("recommend") || text.toLowerCase().includes("consult"),
    })
  } catch (error) {
    console.error("AI assessment error:", error)
    return NextResponse.json({ error: "Failed to process assessment" }, { status: 500 })
  }
}

