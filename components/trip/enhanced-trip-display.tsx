"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { tripsService } from "@/lib/trips-service"
import {
  MapPin,
  Calendar,
  Clock,
  Heart,
  Save,
  Share,
  Download,
  Loader2,
  CheckCircle,
  Star,
  DollarSign,
  Users,
  Camera,
  Utensils,
  Mountain,
  Building,
  Sparkles,
  Award,
  TrendingUp,
} from "lucide-react"
import { toast } from "sonner"

interface TripPlan {
  destination: string
  days: number
  month: string
  interests: string
  itinerary: string
  budget?: string
  travelers?: string
}

interface TripDisplayProps {
  tripPlan: TripPlan
}

export function EnhancedTripDisplay({ tripPlan }: TripDisplayProps) {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [exporting, setExporting] = useState(false)

  // Parse the itinerary into structured data
  const parseItinerary = (itinerary: string) => {
    const lines = itinerary.split("\n").filter((line) => line.trim())
    const days: { day: number; title: string; activities: { time?: string; activity: string; type: string }[] }[] = []
    let currentDay: {
      day: number
      title: string
      activities: { time?: string; activity: string; type: string }[]
    } | null = null

    lines.forEach((line) => {
      const dayMatch = line.match(/Day (\d+)[:.]?\s*(.*)/)
      if (dayMatch) {
        if (currentDay) days.push(currentDay)
        currentDay = {
          day: Number.parseInt(dayMatch[1]),
          title: dayMatch[2] || `Day ${dayMatch[1]}`,
          activities: [],
        }
      } else if (currentDay && line.trim()) {
        const cleanLine = line.replace(/^[-•*]\s*/, "").trim()
        if (cleanLine) {
          // Extract time if present
          const timeMatch = cleanLine.match(/^(\d{1,2}:\d{2}|\d{1,2}\s*[ap]m|\d{1,2}\s*[AP]M)\s*[-:]?\s*(.*)/)
          const time = timeMatch ? timeMatch[1] : undefined
          const activity = timeMatch ? timeMatch[2] : cleanLine

          // Determine activity type
          let type = "general"
          if (
            activity.toLowerCase().includes("restaurant") ||
            activity.toLowerCase().includes("food") ||
            activity.toLowerCase().includes("eat")
          ) {
            type = "food"
          } else if (
            activity.toLowerCase().includes("museum") ||
            activity.toLowerCase().includes("temple") ||
            activity.toLowerCase().includes("palace")
          ) {
            type = "culture"
          } else if (
            activity.toLowerCase().includes("park") ||
            activity.toLowerCase().includes("garden") ||
            activity.toLowerCase().includes("nature")
          ) {
            type = "nature"
          } else if (activity.toLowerCase().includes("shopping") || activity.toLowerCase().includes("market")) {
            type = "shopping"
          }

          currentDay.activities.push({ time, activity, type })
        }
      }
    })

    if (currentDay) days.push(currentDay)
    return days
  }

  const parsedDays = parseItinerary(tripPlan.itinerary)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "food":
        return <Utensils className="h-4 w-4" />
      case "culture":
        return <Building className="h-4 w-4" />
      case "nature":
        return <Mountain className="h-4 w-4" />
      case "shopping":
        return <Users className="h-4 w-4" />
      default:
        return <Camera className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "food":
        return "from-orange-400 to-red-500"
      case "culture":
        return "from-purple-400 to-indigo-500"
      case "nature":
        return "from-green-400 to-emerald-500"
      case "shopping":
        return "from-pink-400 to-rose-500"
      default:
        return "from-blue-400 to-cyan-500"
    }
  }

  const handleSaveTrip = async () => {
    if (!user) return

    setSaving(true)
    try {
      await tripsService.saveTrip(user, {
        destination: tripPlan.destination,
        days: tripPlan.days,
        month: tripPlan.month,
        interests: tripPlan.interests,
        itinerary: tripPlan.itinerary,
        budget: tripPlan.budget,
        travelers: tripPlan.travelers,
        title: `${tripPlan.days}-Day Trip to ${tripPlan.destination}`,
      })
      setSaved(true)
      toast.success("Trip saved successfully!")
    } catch (error) {
      toast.error("Failed to save trip")
    } finally {
      setSaving(false)
    }
  }

  const handleShareTrip = async () => {
    const shareData = {
      title: `${tripPlan.days}-Day Trip to ${tripPlan.destination}`,
      text: `Check out this amazing ${tripPlan.days}-day itinerary for ${tripPlan.destination} in ${tripPlan.month}!`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        toast.success("Trip shared successfully!")
      } catch (error) {
        await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\n${tripPlan.itinerary}`)
        toast.success("Trip details copied to clipboard!")
      }
    } else {
      await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\n${tripPlan.itinerary}`)
      toast.success("Trip details copied to clipboard!")
    }
  }

  const handleExportPDF = async () => {
    setExporting(true)
    try {
      const content = `
${tripPlan.days}-Day Trip to ${tripPlan.destination}
Travel Month: ${tripPlan.month}
Interests: ${tripPlan.interests}

DETAILED ITINERARY:
${tripPlan.itinerary}

Generated by AI Trip Planner
      `.trim()

      const blob = new Blob([content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${tripPlan.destination}-${tripPlan.days}days-itinerary.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success("Trip exported successfully!")
    } catch (error) {
      toast.error("Failed to export trip")
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-400/20 to-transparent rounded-full blur-2xl"></div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">{tripPlan.destination}</h1>
                  <p className="text-white/80 text-lg">{tripPlan.days} Days of Adventure</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <Badge className="bg-white/20 backdrop-blur-lg border-white/30 text-white hover:bg-white/30">
                  <Calendar className="h-3 w-3 mr-1" />
                  {tripPlan.month}
                </Badge>
                <Badge className="bg-white/20 backdrop-blur-lg border-white/30 text-white hover:bg-white/30">
                  <Clock className="h-3 w-3 mr-1" />
                  {tripPlan.days} days
                </Badge>
                <Badge className="bg-white/20 backdrop-blur-lg border-white/30 text-white hover:bg-white/30">
                  <Heart className="h-3 w-3 mr-1" />
                  {tripPlan.interests.split(",")[0]}
                </Badge>
                <Badge className="bg-white/20 backdrop-blur-lg border-white/30 text-white hover:bg-white/30">
                  <DollarSign className="h-3 w-3 mr-1" />
                  {tripPlan.budget?.charAt(0).toUpperCase() + tripPlan.budget?.slice(1).replace("-", " ")}
                </Badge>
                <Badge className="bg-white/20 backdrop-blur-lg border-white/30 text-white hover:bg-white/30">
                  <Users className="h-3 w-3 mr-1" />
                  {tripPlan.travelers?.charAt(0).toUpperCase() + tripPlan.travelers?.slice(1)}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleSaveTrip}
              disabled={saving || saved}
              className="bg-white/20 backdrop-blur-lg border-white/30 text-white hover:bg-white/30"
              variant="outline"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : saved ? (
                <CheckCircle className="h-4 w-4 mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {saved ? "Saved!" : saving ? "Saving..." : "Save Trip"}
            </Button>

            <Button
              onClick={handleShareTrip}
              className="bg-white/20 backdrop-blur-lg border-white/30 text-white hover:bg-white/30"
              variant="outline"
            >
              <Share className="h-4 w-4 mr-2" />
              Share Trip
            </Button>

            <Button
              onClick={handleExportPDF}
              disabled={exporting}
              className="bg-white/20 backdrop-blur-lg border-white/30 text-white hover:bg-white/30"
              variant="outline"
            >
              {exporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
              {exporting ? "Exporting..." : "Export"}
            </Button>
          </div>
        </div>
      </div>

      {/* Trip Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-blue-900">{tripPlan.days}</p>
            <p className="text-sm text-blue-700">Days</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-green-900">$$</p>
            <p className="text-sm text-green-700">Budget</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <Award className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-purple-900">4.9</p>
            <p className="text-sm text-purple-700">Rating</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-orange-900">95%</p>
            <p className="text-sm text-orange-700">Match</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Itinerary */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Your Daily Adventure
          </h2>
          <p className="text-gray-600">Carefully crafted itinerary for the perfect trip</p>
        </div>

        {parsedDays.length > 0 ? (
          <div className="space-y-6">
            {parsedDays.map((day, index) => (
              <Card key={index} className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
                  <CardTitle className="flex items-center gap-4 text-xl">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center text-white text-lg font-bold">
                      {day.day}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{day.title}</h3>
                      <p className="text-white/80 text-sm">{day.activities.length} activities planned</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {day.activities.map((activity, actIndex) => (
                      <div
                        key={actIndex}
                        className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                      >
                        <div
                          className={`w-10 h-10 bg-gradient-to-br ${getActivityColor(activity.type)} rounded-lg flex items-center justify-center text-white flex-shrink-0`}
                        >
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {activity.time && (
                              <Badge variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {activity.time}
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs capitalize">
                              {activity.type}
                            </Badge>
                          </div>
                          <p className="text-gray-800 font-medium leading-relaxed">{activity.activity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Fallback for unstructured content
          <Card className="bg-white shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <CardTitle className="flex items-center gap-3">
                <Sparkles className="h-6 w-6" />
                Complete Itinerary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200">
                  {tripPlan.itinerary}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Trip Highlights */}
      <Card className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Star className="h-5 w-5 text-white" />
            </div>
            Trip Highlights & Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  Duration & Timing
                </h4>
                <p className="text-gray-700">
                  {tripPlan.days} days of adventure in {tripPlan.month}
                </p>
              </div>

              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-600" />
                  Focus Areas
                </h4>
                <p className="text-gray-700">{tripPlan.interests}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-600" />
                  Destination
                </h4>
                <p className="text-gray-700">{tripPlan.destination}</p>
              </div>

              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-purple-600" />
                  Budget Level
                </h4>
                <p className="text-gray-700 capitalize">{tripPlan.budget?.replace("-", " ")} budget</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-600" />
                  Travel Style
                </h4>
                <p className="text-gray-700 capitalize">{tripPlan.travelers} travel</p>
              </div>

              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-pink-600" />
                  AI Optimized
                </h4>
                <p className="text-gray-700">Personalized itinerary crafted by AI</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
