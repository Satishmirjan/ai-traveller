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
  ExternalLink,
  Star,
} from "lucide-react"
import { toast } from "sonner"

interface TripPlan {
  destination: string
  days: number
  month: string
  interests: string
  itinerary: string
}

interface TripDisplayProps {
  tripPlan: TripPlan
}

export function TripDisplay({ tripPlan }: TripDisplayProps) {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [exporting, setExporting] = useState(false)

  // Parse the itinerary into structured data
  const parseItinerary = (itinerary: string) => {
    const lines = itinerary.split("\n").filter((line) => line.trim())
    const days: { day: number; title: string; activities: string[] }[] = []
    let currentDay: { day: number; title: string; activities: string[] } | null = null

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
        // Clean up the line and add as activity
        const cleanLine = line.replace(/^[-•*]\s*/, "").trim()
        if (cleanLine) currentDay.activities.push(cleanLine)
      }
    })

    if (currentDay) days.push(currentDay)
    return days
  }

  const parsedDays = parseItinerary(tripPlan.itinerary)

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
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\n${tripPlan.itinerary}`)
        toast.success("Trip details copied to clipboard!")
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\n${tripPlan.itinerary}`)
      toast.success("Trip details copied to clipboard!")
    }
  }

  const handleExportPDF = async () => {
    setExporting(true)
    try {
      // Create a formatted text version for PDF
      const content = `
${tripPlan.days}-Day Trip to ${tripPlan.destination}
Travel Month: ${tripPlan.month}
Interests: ${tripPlan.interests}

DETAILED ITINERARY:
${tripPlan.itinerary}

Generated by AI Trip Planner
      `.trim()

      // Create a blob and download
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
    <div className="space-y-6">
      {/* Trip Header */}
      <Card className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-blue-600" />
                {tripPlan.days}-Day Adventure in {tripPlan.destination}
              </CardTitle>
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="bg-white/70 text-blue-700 border-blue-200">
                  <Calendar className="h-3 w-3 mr-1" />
                  {tripPlan.month}
                </Badge>
                <Badge variant="secondary" className="bg-white/70 text-purple-700 border-purple-200">
                  <Clock className="h-3 w-3 mr-1" />
                  {tripPlan.days} days
                </Badge>
                <Badge variant="secondary" className="bg-white/70 text-pink-700 border-pink-200">
                  <Heart className="h-3 w-3 mr-1" />
                  {tripPlan.interests}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handleSaveTrip}
          disabled={saving || saved}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
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

        <Button onClick={handleShareTrip} variant="outline" className="border-blue-200 hover:bg-blue-50 bg-transparent">
          <Share className="h-4 w-4 mr-2" />
          Share Trip
        </Button>

        <Button
          onClick={handleExportPDF}
          disabled={exporting}
          variant="outline"
          className="border-purple-200 hover:bg-purple-50 bg-transparent"
        >
          {exporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
          {exporting ? "Exporting..." : "Export"}
        </Button>
      </div>

      {/* Structured Itinerary */}
      <div className="space-y-4">
        {parsedDays.length > 0 ? (
          parsedDays.map((day, index) => (
            <Card
              key={index}
              className="bg-white border-l-4 border-l-blue-500 shadow-md hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {day.day}
                  </div>
                  {day.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {day.activities.map((activity, actIndex) => (
                    <div key={actIndex} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed">{activity}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          // Fallback for unstructured content
          <Card className="bg-white shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Complete Itinerary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-lg">
                  {tripPlan.itinerary}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Trip Highlights */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" />
            Trip Highlights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Duration</h4>
              <p className="text-gray-600">{tripPlan.days} days of adventure</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Best Time</h4>
              <p className="text-gray-600">Perfect for {tripPlan.month} travel</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Focus Areas</h4>
              <p className="text-gray-600">{tripPlan.interests}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Destination</h4>
              <p className="text-gray-600 flex items-center gap-1">
                {tripPlan.destination}
                <ExternalLink className="h-3 w-3" />
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
