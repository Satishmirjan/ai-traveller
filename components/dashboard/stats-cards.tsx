"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, Globe, Heart } from "lucide-react"

export function StatsCards() {
  const stats = [
    {
      title: "Trips Planned",
      value: "12",
      icon: MapPin,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
    },
    {
      title: "Countries Visited",
      value: "8",
      icon: Globe,
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
    },
    {
      title: "Days Traveled",
      value: "45",
      icon: Calendar,
      color: "from-purple-500 to-violet-500",
      bgColor: "from-purple-50 to-violet-50",
    },
    {
      title: "Saved Trips",
      value: "6",
      icon: Heart,
      color: "from-pink-500 to-rose-500",
      bgColor: "from-pink-50 to-rose-50",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className={`bg-gradient-to-br ${stat.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
