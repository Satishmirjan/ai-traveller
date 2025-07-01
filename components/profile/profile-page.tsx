"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { tripsService } from "@/lib/trips-service"
import {
  User,
  Calendar,
  MapPin,
  Edit3,
  Save,
  X,
  Camera,
  Award,
  Globe,
  Star,
  TrendingUp,
  Heart,
  Plane,
  Mountain,
  Building,
  Utensils,
} from "lucide-react"
import { toast } from "sonner"
import { updateProfile } from "firebase/auth"

interface UserStats {
  totalTrips: number
  totalDays: number
  countriesVisited: number
  favoriteDestination: string
  averageRating: number
  totalDistance: number
}

export function ProfilePage() {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<UserStats>({
    totalTrips: 0,
    totalDays: 0,
    countriesVisited: 0,
    favoriteDestination: "Not set",
    averageRating: 4.8,
    totalDistance: 0,
  })

  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
    bio: "",
    location: "",
    favoriteDestination: "",
    travelStyle: "",
    languages: "",
  })

  useEffect(() => {
    if (user) {
      loadUserStats()
      loadUserProfile()
    }
  }, [user])

  const loadUserStats = async () => {
    if (!user) return

    try {
      const trips = await tripsService.getUserTrips(user)
      const destinations = new Set(trips.map((trip) => trip.destination))

      setStats({
        totalTrips: trips.length,
        totalDays: trips.reduce((sum, trip) => sum + trip.days, 0),
        countriesVisited: destinations.size,
        favoriteDestination: trips.length > 0 ? trips[0].destination : "Not set",
        averageRating: 4.8,
        totalDistance: trips.length * 2500, // Estimated
      })
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  const loadUserProfile = () => {
    // Load additional profile data from localStorage or Firebase
    const savedProfile = localStorage.getItem(`profile_${user?.uid}`)
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile)
      setProfileData((prev) => ({ ...prev, ...parsed }))
    }
  }

  const handleSaveProfile = async () => {
    if (!user) return

    setLoading(true)
    try {
      // Update Firebase Auth profile
      if (profileData.displayName !== user.displayName) {
        await updateProfile(user, {
          displayName: profileData.displayName,
        })
      }

      // Save additional profile data to localStorage
      localStorage.setItem(
        `profile_${user.uid}`,
        JSON.stringify({
          bio: profileData.bio,
          location: profileData.location,
          favoriteDestination: profileData.favoriteDestination,
          travelStyle: profileData.travelStyle,
          languages: profileData.languages,
        }),
      )

      setEditing(false)
      toast.success("Profile updated successfully!")
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const achievements = [
    { icon: Plane, title: "Frequent Flyer", description: "Completed 10+ trips", earned: stats.totalTrips >= 10 },
    { icon: Globe, title: "World Explorer", description: "Visited 5+ countries", earned: stats.countriesVisited >= 5 },
    { icon: Mountain, title: "Adventure Seeker", description: "Completed challenging trips", earned: true },
    { icon: Star, title: "Top Rated", description: "Maintained 4.5+ rating", earned: stats.averageRating >= 4.5 },
  ]

  const travelInterests = [
    { icon: Utensils, label: "Culinary", color: "bg-orange-100 text-orange-700" },
    { icon: Building, label: "Culture", color: "bg-purple-100 text-purple-700" },
    { icon: Mountain, label: "Adventure", color: "bg-green-100 text-green-700" },
    { icon: Heart, label: "Romance", color: "bg-pink-100 text-pink-700" },
  ]

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Profile Header */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-white/20">
                  <AvatarImage src={user.photoURL || ""} />
                  <AvatarFallback className="bg-white/20 text-white text-2xl font-bold">
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 border-2 border-white/30"
                >
                  <Camera className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{user.displayName || "Travel Enthusiast"}</h1>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditing(!editing)}
                    className="text-white hover:bg-white/20"
                  >
                    {editing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-white/80 mb-4">{user.email}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-white/20 text-white border-white/30">
                    <MapPin className="h-3 w-3 mr-1" />
                    {profileData.location || "Location not set"}
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30">
                    <Calendar className="h-3 w-3 mr-1" />
                    Member since {new Date(user.metadata.creationTime || "").getFullYear()}
                  </Badge>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold mb-1">{stats.totalTrips}</div>
                <div className="text-white/80 text-sm">Total Trips</div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit Profile Form */}
            {editing && (
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit3 className="h-5 w-5" />
                    Edit Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        value={profileData.displayName}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, displayName: e.target.value }))}
                        className="bg-white/70 dark:bg-gray-700/70"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="City, Country"
                        value={profileData.location}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, location: e.target.value }))}
                        className="bg-white/70 dark:bg-gray-700/70"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself and your travel experiences..."
                      value={profileData.bio}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                      className="bg-white/70 dark:bg-gray-700/70"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="favoriteDestination">Favorite Destination</Label>
                      <Input
                        id="favoriteDestination"
                        placeholder="Your dream destination"
                        value={profileData.favoriteDestination}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, favoriteDestination: e.target.value }))}
                        className="bg-white/70 dark:bg-gray-700/70"
                      />
                    </div>
                    <div>
                      <Label htmlFor="travelStyle">Travel Style</Label>
                      <Input
                        id="travelStyle"
                        placeholder="Adventure, Luxury, Budget, etc."
                        value={profileData.travelStyle}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, travelStyle: e.target.value }))}
                        className="bg-white/70 dark:bg-gray-700/70"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="languages">Languages</Label>
                    <Input
                      id="languages"
                      placeholder="English, Spanish, French..."
                      value={profileData.languages}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, languages: e.target.value }))}
                      className="bg-white/70 dark:bg-gray-700/70"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleSaveProfile} disabled={loading} className="flex-1">
                      {loading ? (
                        <>
                          <Save className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Travel Stats */}
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Travel Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <Plane className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalTrips}</div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">Total Trips</div>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.totalDays}</div>
                    <div className="text-sm text-green-700 dark:text-green-300">Days Traveled</div>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/50 dark:to-purple-800/50 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <Globe className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      {stats.countriesVisited}
                    </div>
                    <div className="text-sm text-purple-700 dark:text-purple-300">Countries</div>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/50 dark:to-orange-800/50 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <Star className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.averageRating}</div>
                    <div className="text-sm text-orange-700 dark:text-orange-300">Avg Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  About Me
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profileData.bio ? (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{profileData.bio}</p>
                ) : (
                  <div className="text-center py-8">
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No bio added yet</p>
                    <Button variant="outline" onClick={() => setEditing(true)}>
                      Add Bio
                    </Button>
                  </div>
                )}

                {(profileData.favoriteDestination || profileData.travelStyle || profileData.languages) && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid md:grid-cols-3 gap-4">
                      {profileData.favoriteDestination && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Favorite Destination</h4>
                          <p className="text-gray-600 dark:text-gray-400">{profileData.favoriteDestination}</p>
                        </div>
                      )}
                      {profileData.travelStyle && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Travel Style</h4>
                          <p className="text-gray-600 dark:text-gray-400">{profileData.travelStyle}</p>
                        </div>
                      )}
                      {profileData.languages && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Languages</h4>
                          <p className="text-gray-600 dark:text-gray-400">{profileData.languages}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      achievement.earned
                        ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800"
                        : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        achievement.earned
                          ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                      }`}
                    >
                      <achievement.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`font-semibold ${
                          achievement.earned
                            ? "text-yellow-900 dark:text-yellow-100"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {achievement.title}
                      </h4>
                      <p
                        className={`text-sm ${
                          achievement.earned
                            ? "text-yellow-700 dark:text-yellow-300"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      >
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Travel Interests */}
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Travel Interests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {travelInterests.map((interest, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 p-3 rounded-lg ${interest.color} dark:bg-opacity-20`}
                    >
                      <interest.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{interest.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
