import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppProvider } from "../contexts/app-context"
import { Navigation } from "../components/layouts/navigation"
import { AuthProvider } from "../contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WhatsSummarize - AI-Powered WhatsApp Group Summaries",
  description:
    "Automated WhatsApp group conversation summarization with AI-driven insights and multiple distribution channels.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AppProvider>
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <main className="pt-16">{children}</main>
            </div>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
