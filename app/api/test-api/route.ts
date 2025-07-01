import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export async function GET() {
  try {
    // Test the API key with a simple request
    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: "Say 'Hello! Your Google AI API is working correctly.' in a friendly way.",
      maxTokens: 50,
    })

    return Response.json({
      success: true,
      message: "API key is working correctly!",
      response: text,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("API test failed:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
