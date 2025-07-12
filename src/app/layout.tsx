import { EnhancedBackground } from "@/components/common/enhanced-background";
import { Navigation } from "@/components/layouts/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from "@/contexts/app-context";
import { AuthProvider } from "@/contexts/auth-context";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WhatsApp Conversation Summarizer",
  description: "Analyze and summarize your WhatsApp conversations with AI-powered insights",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning style={{ height: '100%' }}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem('whatsapp-summarizer-theme');
                const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const preferredTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
                document.documentElement.classList.remove('light', 'dark');
                document.documentElement.classList.add(preferredTheme);
                document.documentElement.style.colorScheme = preferredTheme;
                document.documentElement.setAttribute('data-theme', preferredTheme);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`} style={{ minHeight: '100vh', height: '100%' }}>
        <ThemeProvider>
          <AuthProvider>
            <AppProvider>
              <EnhancedBackground />
              <div className="min-h-screen flex flex-col relative">
                <Navigation />
                <main className="flex-1 flex flex-col">{children}</main>
              </div>
              <Toaster />
            </AppProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
