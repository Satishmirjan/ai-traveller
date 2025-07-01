import { generateText } from "ai"
import { google } from "@ai-sdk/google"

export async function POST(request: Request) {
  try {
    // Check if API key is configured
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("Google Generative AI API key is not configured")
      return Response.json({ error: "API configuration error. Please contact support." }, { status: 500 })
    }

    const { destination, days, interests, month, budget, travelers } = await request.json()

    // Validate required fields
    if (!destination || !days || !interests || !month || !budget || !travelers) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create budget context
    const budgetContext = {
      low: "budget-friendly options, hostels, street food, free attractions",
      moderate: "mid-range hotels, local restaurants, mix of paid and free activities",
      high: "luxury hotels, fine dining, premium experiences, private tours",
      "very-high":
        "ultra-luxury resorts, Michelin-starred restaurants, exclusive experiences, private jets/helicopters",
    }

    // Create traveler context
    const travelerContext = {
      single: "solo traveler experiences, safety tips, social opportunities, flexible scheduling",
      couple: "romantic experiences, couple activities, intimate dining, shared adventures",
      family: "family-friendly activities, kid-safe options, educational experiences, group accommodations",
    }

    // Create the enhanced prompt for Gemini
    const prompt = `Plan a ${days}-day trip to ${destination} in ${month} for a ${travelers} with a ${budget} budget, focused on ${interests}. 

Budget Level: ${budget} - Focus on ${budgetContext[budget as keyof typeof budgetContext]}
Travel Style: ${travelers} - Include ${travelerContext[travelers as keyof typeof travelerContext]}

Please provide a detailed day-by-day itinerary that includes:
- Specific places to visit with brief descriptions
- Recommended timing for each activity
- ${budget === "low" ? "Budget-friendly food options and free/cheap attractions" : budget === "very-high" ? "Luxury dining and exclusive experiences" : "Local food recommendations and mix of activities"}
- Transportation tips appropriate for ${budget} budget
- Cultural insights and tips
- ${travelers === "family" ? "Family-friendly activities and safety considerations" : travelers === "couple" ? "Romantic spots and couple experiences" : "Solo travel tips and social opportunities"}
- Accommodation suggestions for ${budget} budget level

Format the response as a clear, well-structured itinerary that's easy to follow. Make it engaging and informative, tailored specifically for ${travelers} with ${budget} budget preferences.`

    // Call Gemini API using AI SDK
    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: prompt,
      maxTokens: 2000,
    })

    // Return the structured response with new fields
    return Response.json({
      destination,
      days: Number.parseInt(days),
      month,
      interests,
      budget,
      travelers,
      itinerary: text,
    })
  } catch (error) {
    console.error("Error generating trip plan:", error)

    // Check for specific API key related errors
    if (error instanceof Error && error.message.includes("API key")) {
      return Response.json({ error: "API key configuration error. Please check your setup." }, { status: 500 })
    }

    return Response.json({ error: "Failed to generate trip plan. Please try again." }, { status: 500 })
  }
}
