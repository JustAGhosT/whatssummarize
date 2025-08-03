import { Header, Footer } from "@ui/layouts"
import { AuthProvider, AppProvider } from "@whatssummarize/contexts"
import { ThemeProvider } from "@ui/theme-provider"
import { Toaster } from "@ui/toaster"
import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "WhatsSummarize - WhatsApp Conversation Analyzer",
  description: "Analyze and summarize your WhatsApp conversations with AI",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <AppProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-grow pt-16">
                  {children}
                  <Toaster />
                </main>
                <Footer />
              </div>
            </AppProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}