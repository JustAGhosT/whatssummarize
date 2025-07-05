import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "../components/layouts/navigation"
import { AuthProvider } from "../contexts/auth-context"
import { AppProvider } from "../contexts/app-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WhatsApp Summarizer",
  description: "Summarize and manage your WhatsApp conversations",
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
            <main className="main-content">{children}</main>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
