import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Navigation } from "../components/layouts/navigation"
import { BackgroundAnimation } from "../components/common/background-animation"
import { AuthProvider } from "../contexts/auth-context"
import { ThemeProvider } from "../contexts/theme-context"
import { AppProvider } from "../contexts/app-context"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WhatsApp Summarizer",
  description: "Summarize your WhatsApp conversations with AI",
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
          <AuthProvider>
            <AppProvider>
              <BackgroundAnimation />
              <Navigation />
              <main className="main-content">{children}</main>
            </AppProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
