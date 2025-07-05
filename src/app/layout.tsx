import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppProvider } from "../contexts/app-context"
import { AuthProvider } from "../contexts/auth-context"
import { Navigation } from "../components/layouts/navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WhatsApp Conversation Summarizer",
  description: "AI-powered WhatsApp conversation summaries",
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
            <Navigation />
            <main className="pt-20">{children}</main>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
