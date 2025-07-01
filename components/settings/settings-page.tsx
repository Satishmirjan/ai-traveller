"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"
import { useTheme } from "@/lib/theme-context"
import {
  Settings,
  Moon,
  Sun,
  Bell,
  Shield,
  Key,
  Globe,
  Palette,
  Database,
  Download,
  Trash2,
  Check,
  Eye,
  EyeOff,
} from "lucide-react"
import { toast } from "sonner"

export function SettingsPage() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [showApiKey, setShowApiKey] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [testingApi, setTestingApi] = useState(false)

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      tripReminders: true,
      weatherAlerts: true,
      priceDrops: false,
    },
    privacy: {
      profileVisibility: "public",
      shareTrips: true,
      analytics: true,
    },
    preferences: {
      language: "en",
      currency: "USD",
      units: "metric",
      autoSave: true,
    },
  })

  const handleTestApiKey = async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter an API key")
      return
    }

    setTestingApi(true)
    try {
      const response = await fetch("/api/test-api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey }),
      })

      if (response.ok) {
        toast.success("API key is valid and working!")
      } else {
        toast.error("API key is invalid or not working")
      }
    } catch (error) {
      toast.error("Failed to test API key")
    } finally {
      setTestingApi(false)
    }
  }

  const handleExportData = () => {
    // Export user data
    const userData = {
      profile: user,
      settings,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `travel-data-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success("Data exported successfully!")
  }

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        // In a real app, you'd call a delete account API
        toast.success("Account deletion request submitted")
      } catch (error) {
        toast.error("Failed to delete account")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-xl">
            <Settings className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Customize your travel experience</p>
        </div>

        {/* Appearance Settings */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === "dark" ? (
                  <Moon className="h-5 w-5 text-blue-600" />
                ) : (
                  <Sun className="h-5 w-5 text-yellow-600" />
                )}
                <div>
                  <Label className="text-base font-medium">Theme</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Choose between light and dark mode</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={toggleTheme} className="bg-white/70 dark:bg-gray-700/70">
                {theme === "dark" ? (
                  <>
                    <Sun className="h-4 w-4 mr-2" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4 mr-2" />
                    Dark Mode
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* API Configuration */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="apiKey">Google Gemini API Key</Label>
              <div className="flex gap-2 mt-2">
                <div className="relative flex-1">
                  <Input
                    id="apiKey"
                    type={showApiKey ? "text" : "password"}
                    placeholder="Enter your Gemini API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="bg-white/70 dark:bg-gray-700/70 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <Button onClick={handleTestApiKey} disabled={testingApi} variant="outline">
                  {testingApi ? "Testing..." : "Test"}
                </Button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Get your API key from{" "}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {key === "email" && "Receive email notifications"}
                    {key === "push" && "Receive push notifications"}
                    {key === "tripReminders" && "Get reminders about upcoming trips"}
                    {key === "weatherAlerts" && "Weather updates for your destinations"}
                    {key === "priceDrops" && "Notifications about price changes"}
                  </p>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      notifications: { ...prev.notifications, [key]: checked },
                    }))
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Profile Visibility</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Who can see your profile</p>
              </div>
              <Select
                value={settings.privacy.profileVisibility}
                onValueChange={(value) =>
                  setSettings((prev) => ({
                    ...prev,
                    privacy: { ...prev.privacy, profileVisibility: value },
                  }))
                }
              >
                <SelectTrigger className="w-32 bg-white/70 dark:bg-gray-700/70">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="friends">Friends</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Share Trips</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Allow others to see your trips</p>
              </div>
              <Switch
                checked={settings.privacy.shareTrips}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    privacy: { ...prev.privacy, shareTrips: checked },
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Analytics</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Help improve our service</p>
              </div>
              <Switch
                checked={settings.privacy.analytics}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    privacy: { ...prev.privacy, analytics: checked },
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Language</Label>
                <Select
                  value={settings.preferences.language}
                  onValueChange={(value) =>
                    setSettings((prev) => ({
                      ...prev,
                      preferences: { ...prev.preferences, language: value },
                    }))
                  }
                >
                  <SelectTrigger className="bg-white/70 dark:bg-gray-700/70">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Currency</Label>
                <Select
                  value={settings.preferences.currency}
                  onValueChange={(value) =>
                    setSettings((prev) => ({
                      ...prev,
                      preferences: { ...prev.preferences, currency: value },
                    }))
                  }
                >
                  <SelectTrigger className="bg-white/70 dark:bg-gray-700/70">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="JPY">JPY (¥)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Auto-save Trips</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Automatically save generated trips</p>
              </div>
              <Switch
                checked={settings.preferences.autoSave}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    preferences: { ...prev.preferences, autoSave: checked },
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Export Data</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Download all your travel data</p>
              </div>
              <Button variant="outline" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium text-red-600">Delete Account</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Permanently delete your account and data</p>
              </div>
              <Button variant="destructive" onClick={handleDeleteAccount}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Settings */}
        <div className="flex justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8"
            onClick={() => {
              localStorage.setItem(`settings_${user?.uid}`, JSON.stringify(settings))
              toast.success("Settings saved successfully!")
            }}
          >
            <Check className="h-5 w-5 mr-2" />
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
