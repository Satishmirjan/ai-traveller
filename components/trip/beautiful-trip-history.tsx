"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { tripsService, type Trip } from "@/lib/trips-service"
import {
  MapPin,
  Calendar,
  Clock,
  Trash2,
  Eye,
  Loader2,
  Search,
  Filter,
  Star,
  DollarSign,
  Award,
  Globe,
  Heart,
  Users,
} from "lucide-react"
import { toast } from "sonner"

export function BeautifulTripHistory() {
  const { user } = useAuth()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("all")

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

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.title.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterBy === "all") return matchesSearch
    if (filterBy === "recent")
      return matchesSearch && new Date(trip.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    if (filterBy === "long") return matchesSearch && trip.days > 7
    if (filterBy === "short") return matchesSearch && trip.days <= 7

    return matchesSearch
  })

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "Easy":
        return "from-green-400 to-emerald-500"
      case "Moderate":
        return "from-yellow-400 to-orange-500"
      case "Challenging":
        return "from-red-400 to-pink-500"
      default:
        return "from-blue-400 to-cyan-500"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your amazing trips...</p>
        </div>
      </div>
    )
  }

  if (trips.length === 0) {
    return (
      <Card className="text-center py-16 bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-xl">
        <CardContent>
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Globe className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No saved trips yet</h3>
          <p className="text-gray-600 text-lg mb-6">Start planning your first adventure to see it here!</p>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            Plan Your First Trip
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Search and Filter */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search trips by destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/70 backdrop-blur-sm border-white/50"
              />
            </div>
            <div className="flex gap-2">
              {["all", "recent", "long", "short"].map((filter) => (
                <Button
                  key={filter}
                  variant={filterBy === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterBy(filter)}
                  className={
                    filterBy === filter
                      ? "bg-gradient-to-r from-blue-500 to-purple-600"
                      : "bg-white/70 backdrop-blur-sm"
                  }
                >
                  <Filter className="h-3 w-3 mr-1" />
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trip Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-blue-900">{trips.length}</p>
            <p className="text-sm text-blue-700">Total Trips</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-green-900">{trips.reduce((sum, trip) => sum + trip.days, 0)}</p>
            <p className="text-sm text-green-700">Total Days</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-purple-900">{new Set(trips.map((trip) => trip.destination)).size}</p>
            <p className="text-sm text-purple-700">Destinations</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <Star className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-orange-900">4.9</p>
            <p className="text-sm text-orange-700">Avg Rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Trips Grid */}
      <div className="grid gap-6">
        {filteredTrips.map((trip) => (
          <Card
            key={trip.id}
            className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="flex flex-col md:flex-row">
              {/* Trip Image/Gradient */}
              <div className="w-full md:w-48 h-48 md:h-auto bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <MapPin className="h-8 w-8 mx-auto mb-2" />
                    <p className="font-bold text-lg">{trip.destination}</p>
                    <p className="text-sm opacity-90">{trip.days} Days</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/20 backdrop-blur-lg border-white/30 text-white">{trip.month}</Badge>
                </div>
              </div>

              {/* Trip Content */}
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{trip.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {trip.days} days
                      </Badge>
                      {trip.difficulty && (
                        <Badge
                          className={`bg-gradient-to-r ${getDifficultyColor(trip.difficulty)} text-white border-0`}
                        >
                          <Award className="h-3 w-3 mr-1" />
                          {trip.difficulty}
                        </Badge>
                      )}
                      {trip.estimatedBudget && (
                        <Badge variant="outline" className="text-xs">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {trip.estimatedBudget}
                        </Badge>
                      )}
                      {trip.budget && (
                        <Badge variant="outline" className="text-xs">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {trip.budget.charAt(0).toUpperCase() + trip.budget.slice(1).replace("-", " ")}
                        </Badge>
                      )}
                      {trip.travelers && (
                        <Badge variant="outline" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {trip.travelers.charAt(0).toUpperCase() + trip.travelers.slice(1)}
                        </Badge>
                      )}
                    </div>

                    {trip.tags && trip.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {trip.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {trip.highlights && trip.highlights.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Highlights:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {trip.highlights.slice(0, 2).map((highlight, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Star className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedTrip(selectedTrip?.id === trip.id ? null : trip)}
                      className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => trip.id && handleDeleteTrip(trip.id)}
                      className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-gray-500">Created on {new Date(trip.createdAt).toLocaleDateString()}</div>
              </div>
            </div>

            {selectedTrip?.id === trip.id && (
              <div className="border-t bg-gradient-to-r from-gray-50 to-blue-50 p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      Interests:
                    </h4>
                    <p className="text-gray-700 text-sm bg-white/70 p-3 rounded-lg">{trip.interests}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      Detailed Itinerary:
                    </h4>
                    <div className="text-gray-700 text-sm whitespace-pre-wrap max-h-60 overflow-y-auto bg-white/70 p-4 rounded-lg border">
                      {trip.itinerary}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      Budget & Travel Style:
                    </h4>
                    <div className="flex gap-2 mb-3">
                      {trip.budget && (
                        <Badge className="bg-green-50 text-green-700 border-green-200">
                          {trip.budget.charAt(0).toUpperCase() + trip.budget.slice(1).replace("-", " ")} Budget
                        </Badge>
                      )}
                      {trip.travelers && (
                        <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                          {trip.travelers.charAt(0).toUpperCase() + trip.travelers.slice(1)} Travel
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {filteredTrips.length === 0 && searchTerm && (
        <Card className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 border-0">
          <CardContent>
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No trips found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
