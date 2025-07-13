import * as React from 'react';
import { Loader2 } from "lucide-react"

export function LoadingSpinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

export function PageLoading() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl">
        <div className="relative">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <div className="absolute inset-0 blur-md opacity-50 animate-pulse bg-primary rounded-full"></div>
        </div>
        <p className="text-slate-600 dark:text-slate-300 font-medium">Loading content...</p>
      </div>
    </div>
  )
}
