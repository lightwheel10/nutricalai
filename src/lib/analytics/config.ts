export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

interface GtagEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

// More specific type for gtag parameters
type GtagParams = {
  page_path?: string;
  event_category?: string;
  event_label?: string;
  value?: number;
  send_to?: string;
  event_time?: number;
  user_id?: string;
  [key: string]: string | number | boolean | undefined; // More specific index signature
}

// Types for window.gtag
declare global {
  interface Window {
    gtag: (
      type: string,
      action: string,
      params?: GtagParams
    ) => void;
    dataLayer: Array<{
      [key: string]: string | number | boolean | undefined;
    }>;
  }
}

// Page view tracking
export function pageview(url: string) {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_TRACKING_ID!, {
      page_path: url,
    })
  }
}

// Event tracking
export function trackEvent({
  action,
  category,
  label,
  value,
}: GtagEvent) {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}
