"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { tripsService, type Trip } from "@/lib/trips-service"
import { MapPin, Calendar, Clock, Trash2, Eye, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function TripHistory() {
  const { user } = useAuth()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)

  useEffect(() => {
    if (user) {
      loadTrips()
    }
  }, [user])

  const loadTrips = async () => {
    if (!user) return

    try {
      const userTrips = await tripsService.getUserTrips(user)
      setTrips(userTrips)
    } catch (error) {
      toast.error("Failed to load trips")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTrip = async (tripId: string) => {
    try {
      await tripsService.deleteTrip(tripId)
      setTrips(trips.filter((trip) => trip.id !== tripId))
      toast.success("Trip deleted successfully")
    } catch (error) {
      toast.error("Failed to delete trip")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (trips.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved trips yet</h3>
          <p className="text-gray-600">Start planning your first trip to see it here!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {trips.map((trip) => (
          <Card key={trip.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    {trip.title}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {trip.month}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {trip.days} days
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedTrip(selectedTrip?.id === trip.id ? null : trip)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => trip.id && handleDeleteTrip(trip.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {selectedTrip?.id === trip.id && (
              <CardContent className="pt-0">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Interests:</h4>
                  <p className="text-gray-600 text-sm mb-4">{trip.interests}</p>
                  <h4 className="font-medium text-gray-900 mb-2">Itinerary:</h4>
                  <div className="text-gray-600 text-sm whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {trip.itinerary}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
