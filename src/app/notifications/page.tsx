"use client"

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Use dynamic import with SSR disabled
const Notifications = dynamic(
  () => import('@/components/features/notifications/notifications'),
  { 
    ssr: false,
    loading: () => (
      <div className="space-y-4 p-6">
        <div className="h-10 w-64 bg-gray-200 animate-pulse rounded"></div>
        <div className="space-y-2">
          <div className="h-24 w-full bg-gray-100 animate-pulse rounded"></div>
          <div className="h-24 w-full bg-gray-100 animate-pulse rounded"></div>
          <div className="h-24 w-full bg-gray-100 animate-pulse rounded"></div>
        </div>
      </div>
    )
  }
)

export default function NotificationsPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <Suspense fallback={
        <div className="space-y-4 p-6">
          <div className="h-10 w-64 bg-gray-200 animate-pulse rounded"></div>
          <div className="space-y-2">
            <div className="h-24 w-full bg-gray-100 animate-pulse rounded"></div>
            <div className="h-24 w-full bg-gray-100 animate-pulse rounded"></div>
            <div className="h-24 w-full bg-gray-100 animate-pulse rounded"></div>
          </div>
        </div>
      }>
        <Notifications />
      </Suspense>
    </div>
  )
}
