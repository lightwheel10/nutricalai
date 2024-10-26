import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { pageview, trackEvent } from '@/lib/analytics/config'

export function usePageTracking() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = pathname + searchParams.toString()
    pageview(url)
  }, [pathname, searchParams])
}

export function useTimeOnPage(pageName: string) {
  useEffect(() => {
    const startTime = Date.now()

    return () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)
      trackEvent({
        action: 'time_spent',
        category: 'User Engagement',
        label: pageName,
        value: timeSpent,
      })
    }
  }, [pageName])
}

