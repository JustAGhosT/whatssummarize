"use client"

import { ReactNode, Suspense, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { PageLoading } from '@/components/ui/loading'

type DynamicComponentProps = {
  component: () => Promise<{ default: React.ComponentType<any> }>
  loading?: ReactNode
}

export function createPage(componentImport: () => Promise<any>) {
  const DynamicComponent = dynamic(
    () => componentImport().then(mod => ({
      default: mod.default || mod
    })),
    { 
      loading: () => <PageLoading />,
      ssr: false
    }
  )

  return function PageWrapper() {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
      setIsMounted(true)
    }, [])

    if (!isMounted) {
      return <PageLoading />
    }

    return (
      <Suspense fallback={<PageLoading />}>
        <DynamicComponent />
      </Suspense>
    )
  }
}
