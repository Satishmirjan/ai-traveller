import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/lib/auth-context"
import { ThemeProvider } from "@/lib/theme-context"
import "./globals.css"
//adding new things in layout
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Trip Planner - Your Intelligent Travel Companion",
  description: "Plan perfect trips with AI-powered itineraries tailored to your preferences",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
