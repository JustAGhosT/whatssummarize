import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/layouts/navigation"
import { EnhancedBackground } from "@/components/common/enhanced-background"
import { AuthProvider } from "@/contexts/auth-context"
import { AppProvider } from "@/contexts/app-context"
import { ThemeProvider } from "@/contexts/theme-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WhatsApp Conversation Summarizer",
  description: "Analyze and summarize your WhatsApp conversations with AI-powered insights",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <AppProvider>
              <EnhancedBackground />
              <Navigation />
              <main className="main-content">{children}</main>
            </AppProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
