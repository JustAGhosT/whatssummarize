"use client"

import { Github, Twitter, Linkedin } from "lucide-react"

// Generic Link component that can be used across different frameworks
interface LinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

function Link({ href, children, className }: LinkProps) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  )
}

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-green-300 dark:bg-green-700 rounded-full filter blur-3xl translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute left-0 top-0 w-64 h-64 bg-green-200 dark:bg-green-800 rounded-full filter blur-3xl -translate-x-1/3 -translate-y-1/3"></div>
      </div>
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 text-gradient">WhatsSummarize</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-md">
              Analyze and summarize your WhatsApp conversations with AI-powered insights.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://github.com/yourusername/whatssummarize" title="github" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400">
                <Github className="w-6 h-6" />
              </a>
              <a href="https://twitter.com/yourusername" title="twitter" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="https://linkedin.com/in/yourusername" title="linkedin"  target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/" className="text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400">Home</Link></li>
              <li><Link href="/features" className="text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400">Features</Link></li>
              <li><Link href="/pricing" className="text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400">Pricing</Link></li>
              <li><Link href="/blog" className="text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400">Blog</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/privacy" className="text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400">Terms of Service</Link></li>
              <li><Link href="/cookies" className="text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} WhatsSummarize. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
