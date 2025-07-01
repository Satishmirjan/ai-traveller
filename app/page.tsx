"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { AuthPage } from "@/components/auth/auth-page"
import { Navbar } from "@/components/navigation/navbar"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { EnhancedTripDisplay } from "@/components/trip/enhanced-trip-display"
import { BeautifulTripHistory } from "@/components/trip/beautiful-trip-history"
import { ProfilePage } from "@/components/profile/profile-page"
import { SettingsPage } from "@/components/settings/settings-page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Calendar,
  Clock,
  Heart,
  Loader2,
  Sparkles,
  History,
  Plus,
  Wand2,
  DollarSign,
  Users,
} from "lucide-react"
import { Toaster } from "sonner"

interface TripPlan {
  destination: string
  days: number
  month: string
  interests: string
  itinerary: string
  budget?: string
  travelers?: string
}

export default function TripPlanner() {
  const { user, loading: authLoading } = useAuth()
  const [currentPage, setCurrentPage] = useState("/")
  const [formData, setFormData] = useState({
    destination: "",
    days: "",
    interests: "",
    month: "",
    budget: "",
    travelers: "",
  })
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("planner")

  // Handle navigation
  useEffect(() => {
    const handleNavigation = (event: CustomEvent) => {
      setCurrentPage(event.detail.path)
    }

    window.addEventListener("navigate", handleNavigation as EventListener)
    return () => window.removeEventListener("navigate", handleNavigation as EventListener)
  }, [])

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const budgetOptions = [
    { value: "low", label: "💰 Low Budget", description: "Budget-friendly, hostels, street food" },
    { value: "moderate", label: "💰💰 Moderate", description: "Mid-range hotels, local restaurants" },
    { value: "high", label: "💰💰💰 High", description: "Luxury hotels, fine dining" },
    { value: "very-high", label: "💰💰💰💰 Very High", description: "Ultra-luxury, exclusive experiences" },
  ]

  const travelerOptions = [
    { value: "single", label: "🧑 Single (like me)", description: "Solo travel experiences" },
    { value: "couple", label: "💑 Couple (like Fawzan)", description: "Romantic experiences for two" },
    { value: "family", label: "👨‍👩‍👧‍👦 Family (like Aryan)", description: "Family-friendly activities" },
  ]

  const popularDestinations = [
    "Tokyo, Japan",
    "Paris, France",
    "New York, USA",
    "Bali, Indonesia",
    "London, UK",
    "Rome, Italy",
    "Barcelona, Spain",
    "Dubai, UAE",
  ]

  const interestSuggestions = [
    "local cuisine, cultural sites, museums",
    "adventure sports, hiking, nature",
    "nightlife, shopping, entertainment",
    "history, architecture, art galleries",
    "beaches, relaxation, spa treatments",
  ]

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300 text-lg">Preparing your travel companion...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

  // Render different pages based on current route
  if (currentPage === "/profile") {
    return (
      <>
        <Navbar />
        <ProfilePage />
        <Toaster position="top-right" />
      </>
    )
  }

  if (currentPage === "/settings") {
    return (
      <>
        <Navbar />
        <SettingsPage />
        <Toaster position="top-right" />
      </>
    )
  }

  if (currentPage === "/history") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BeautifulTripHistory />
        </div>
        <Toaster position="top-right" />
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setTripPlan(null)

    try {
      const response = await fetch("/api/plan-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to generate trip plan")
      }

      const data = await response.json()
      setTripPlan(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData({
      destination: "",
      days: "",
      interests: "",
      month: "",
      budget: "",
      travelers: "",
    })
    setTripPlan(null)
    setError("")
  }

  const fillSampleData = () => {
    setFormData({
      destination: "Tokyo, Japan",
      days: "7",
      interests: "local cuisine, cultural sites, technology, anime culture",
      month: "April",
      budget: "moderate",
      travelers: "couple",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <Navbar />
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 rounded-3xl blur-3xl"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-2xl">
              <Wand2 className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              AI Travel Wizard
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transform your travel dreams into reality with AI-powered itineraries crafted just for you
            </p>
          </div>
        </div>

        <StatsCards />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border-0 shadow-lg">
            <TabsTrigger
              value="planner"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Plus className="h-4 w-4" />
              Create New Adventure
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <History className="h-4 w-4" />
              My Travel Collection
            </TabsTrigger>
          </TabsList>

          <TabsContent value="planner" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Enhanced Form Section */}
              <Card className="backdrop-blur-lg bg-white/90 dark:bg-gray-800/90 border-0 shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                  <CardTitle className="flex items-center gap-3 text-2xl mb-2">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-lg flex items-center justify-center">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    Design Your Journey
                  </CardTitle>
                  <CardDescription className="text-white/90 text-base">
                    Share your travel vision and watch AI create magic
                  </CardDescription>
                </div>

                <CardContent className="p-8 space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="destination"
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4" />
                        Dream Destination
                      </Label>
                      <Input
                        id="destination"
                        placeholder="Where does your heart want to go?"
                        value={formData.destination}
                        onChange={(e) => handleInputChange("destination", e.target.value)}
                        className="h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 text-base bg-white/70 dark:bg-gray-700/70"
                        required
                      />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {popularDestinations.slice(0, 4).map((dest) => (
                          <Button
                            key={dest}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleInputChange("destination", dest)}
                            className="text-xs bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40"
                          >
                            {dest}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label
                          htmlFor="days"
                          className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
                        >
                          <Clock className="h-4 w-4" />
                          Duration
                        </Label>
                        <Input
                          id="days"
                          type="number"
                          min="1"
                          max="30"
                          placeholder="Days"
                          value={formData.days}
                          onChange={(e) => handleInputChange("days", e.target.value)}
                          className="h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-white/70 dark:bg-gray-700/70"
                          required
                        />
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="month"
                          className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
                        >
                          <Calendar className="h-4 w-4" />
                          Perfect Time
                        </Label>
                        <Select onValueChange={(value) => handleInputChange("month", value)} required>
                          <SelectTrigger className="h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-white/70 dark:bg-gray-700/70">
                            <SelectValue placeholder="Select month" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month) => (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label
                          htmlFor="budget"
                          className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
                        >
                          <DollarSign className="h-4 w-4" />
                          Budget Level
                        </Label>
                        <Select onValueChange={(value) => handleInputChange("budget", value)} required>
                          <SelectTrigger className="h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-white/70 dark:bg-gray-700/70">
                            <SelectValue placeholder="Choose budget" />
                          </SelectTrigger>
                          <SelectContent>
                            {budgetOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{option.label}</span>
                                  <span className="text-xs text-gray-500">{option.description}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="travelers"
                          className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
                        >
                          <Users className="h-4 w-4" />
                          Travel Style
                        </Label>
                        <Select onValueChange={(value) => handleInputChange("travelers", value)} required>
                          <SelectTrigger className="h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-white/70 dark:bg-gray-700/70">
                            <SelectValue placeholder="Who's traveling?" />
                          </SelectTrigger>
                          <SelectContent>
                            {travelerOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{option.label}</span>
                                  <span className="text-xs text-gray-500">{option.description}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="interests"
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
                      >
                        <Heart className="h-4 w-4" />
                        What Excites You?
                      </Label>
                      <Textarea
                        id="interests"
                        placeholder="Tell us what makes your heart race..."
                        value={formData.interests}
                        onChange={(e) => handleInputChange("interests", e.target.value)}
                        className="min-h-[120px] border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 resize-none bg-white/70 dark:bg-gray-700/70"
                        required
                      />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {interestSuggestions.slice(0, 3).map((interest, index) => (
                          <Button
                            key={index}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleInputChange("interests", interest)}
                            className="text-xs bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40"
                          >
                            {interest.split(",")[0]}...
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="submit"
                        className="flex-1 h-14 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-700 text-white font-semibold text-base shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Crafting Your Perfect Journey...
                          </>
                        ) : (
                          <>
                            <Wand2 className="mr-2 h-5 w-5" />
                            Create My Adventure
                          </>
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={fillSampleData}
                        className="h-14 px-6 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border-gray-200 dark:border-gray-600 hover:bg-white/90 dark:hover:bg-gray-700/90"
                      >
                        Try Sample
                      </Button>
                    </div>

                    {tripPlan && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                        className="w-full h-12 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/40 dark:hover:to-emerald-900/40"
                      >
                        Plan Another Adventure
                      </Button>
                    )}
                  </form>

                  {error && (
                    <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-700 rounded-xl">
                      <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Preview Section */}
              <Card className="backdrop-blur-lg bg-white/90 dark:bg-gray-800/90 border-0 shadow-2xl">
                <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 text-white">
                  <CardTitle className="flex items-center gap-3 text-2xl mb-2">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5" />
                    </div>
                    Your Magical Itinerary
                  </CardTitle>
                  <CardDescription className="text-white/90 text-base">
                    AI-crafted adventures await below
                  </CardDescription>
                </div>

                <CardContent className="p-8">
                  {tripPlan ? (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mx-auto flex items-center justify-center">
                        <Sparkles className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Adventure Ready!</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Your personalized itinerary has been crafted with love. Scroll down to explore every magical
                        detail!
                      </p>
                      <Button
                        onClick={() => {
                          document.getElementById("trip-details")?.scrollIntoView({ behavior: "smooth" })
                        }}
                        className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                      >
                        Explore My Adventure
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <MapPin className="h-12 w-12 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Ready for Magic?</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Your personalized travel itinerary will appear here
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Fill out the form and let AI create your perfect adventure
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Full Trip Display */}
            {tripPlan && (
              <div id="trip-details" className="scroll-mt-8">
                <EnhancedTripDisplay tripPlan={tripPlan} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            <BeautifulTripHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
