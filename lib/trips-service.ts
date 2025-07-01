import { collection, addDoc, getDocs, query, where, orderBy, deleteDoc, doc } from "firebase/firestore"
import { db } from "./firebase"
import type { User } from "firebase/auth"

export interface Trip {
  id?: string
  userId: string
  destination: string
  days: number
  month: string
  interests: string
  itinerary: string
  createdAt: Date
  title: string
  budget?: string
  travelers?: string
  highlights?: string[]
  estimatedBudget?: string
  difficulty?: "Easy" | "Moderate" | "Challenging"
  tags?: string[]
}

const tripsService = {
  async saveTrip(user: User, tripData: Omit<Trip, "id" | "userId" | "createdAt">) {
    try {
      const enhancedTripData = {
        ...tripData,
        userId: user.uid,
        createdAt: new Date(),
        highlights: this.extractHighlights(tripData.itinerary),
        tags: this.generateTags(tripData.destination, tripData.interests, tripData.budget, tripData.travelers),
        difficulty: this.calculateDifficulty(tripData.days, tripData.interests),
        estimatedBudget: this.estimateBudget(tripData.destination, tripData.days, tripData.budget),
      }

      const docRef = await addDoc(collection(db, "trips"), enhancedTripData)
      return docRef.id
    } catch (error) {
      console.error("Error saving trip:", error)
      throw error
    }
  },

  async getUserTrips(user: User): Promise<Trip[]> {
    try {
      const q = query(collection(db, "trips"), where("userId", "==", user.uid), orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Trip[]
    } catch (error) {
      console.error("Error fetching trips:", error)
      throw error
    }
  },

  async deleteTrip(tripId: string) {
    try {
      await deleteDoc(doc(db, "trips", tripId))
    } catch (error) {
      console.error("Error deleting trip:", error)
      throw error
    }
  },

  // Helper methods remain the same
  extractHighlights(itinerary: string): string[] {
    const highlights = []
    const lines = itinerary.split("\n")

    for (const line of lines) {
      if (line.includes("visit") || line.includes("explore") || line.includes("experience")) {
        const cleaned = line.replace(/^[-•*]\s*/, "").trim()
        if (cleaned.length > 10 && cleaned.length < 100) {
          highlights.push(cleaned)
        }
      }
    }

    return highlights.slice(0, 4)
  },

  generateTags(destination: string, interests: string, budget?: string, travelers?: string): string[] {
    const tags = []
    const interestWords = interests.toLowerCase().split(/[,\s]+/)

    // Add destination-based tags
    if (destination.toLowerCase().includes("japan") || destination.toLowerCase().includes("tokyo")) {
      tags.push("Asia", "Culture", "Technology")
    } else if (destination.toLowerCase().includes("paris") || destination.toLowerCase().includes("france")) {
      tags.push("Europe", "Romance", "Art")
    } else if (destination.toLowerCase().includes("new york")) {
      tags.push("Urban", "Shopping", "Entertainment")
    }

    // Add interest-based tags
    interestWords.forEach((word) => {
      if (word.includes("food")) tags.push("Culinary")
      if (word.includes("history")) tags.push("Historical")
      if (word.includes("nature")) tags.push("Nature")
      if (word.includes("adventure")) tags.push("Adventure")
      if (word.includes("art")) tags.push("Art & Culture")
    })

    // Add budget-based tags
    if (budget) {
      switch (budget) {
        case "low":
          tags.push("Budget-Friendly", "Backpacker")
          break
        case "moderate":
          tags.push("Mid-Range", "Comfortable")
          break
        case "high":
          tags.push("Luxury", "Premium")
          break
        case "very-high":
          tags.push("Ultra-Luxury", "Exclusive")
          break
      }
    }

    // Add traveler-based tags
    if (travelers) {
      switch (travelers) {
        case "single":
          tags.push("Solo Travel", "Independent")
          break
        case "couple":
          tags.push("Romantic", "Couples")
          break
        case "family":
          tags.push("Family-Friendly", "Kids")
          break
      }
    }

    return [...new Set(tags)].slice(0, 6)
  },

  calculateDifficulty(days: number, interests: string): "Easy" | "Moderate" | "Challenging" {
    const adventureKeywords = ["hiking", "climbing", "adventure", "extreme", "trekking"]
    const hasAdventure = adventureKeywords.some((keyword) => interests.toLowerCase().includes(keyword))

    if (hasAdventure || days > 14) return "Challenging"
    if (days > 7) return "Moderate"
    return "Easy"
  },

  estimateBudget(destination: string, days: number, budget?: string): string {
    let baseRate = 100 // default moderate rate

    // Adjust base rate by destination
    if (
      destination.toLowerCase().includes("japan") ||
      destination.toLowerCase().includes("switzerland") ||
      destination.toLowerCase().includes("norway")
    ) {
      baseRate = 200
    } else if (
      destination.toLowerCase().includes("thailand") ||
      destination.toLowerCase().includes("vietnam") ||
      destination.toLowerCase().includes("india")
    ) {
      baseRate = 50
    }

    // Adjust by budget level
    if (budget) {
      switch (budget) {
        case "low":
          baseRate *= 0.5
          break
        case "moderate":
          baseRate *= 1
          break
        case "high":
          baseRate *= 2
          break
        case "very-high":
          baseRate *= 4
          break
      }
    }

    const total = baseRate * days
    return `$${total.toLocaleString()} - $${(total * 1.3).toLocaleString()}`
  },
}

export { tripsService }
