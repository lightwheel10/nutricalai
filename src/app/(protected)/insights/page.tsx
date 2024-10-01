import dynamic from 'next/dynamic'

// Dynamically import the InsightsContent component with ssr: false
const InsightsContent = dynamic(() => import('./InsightsContent'), {
  loading: () => <p>Loading...</p>,
  ssr: false
})

// Define the main InsightsPage component
export default function InsightsPage() {
  return <InsightsContent />
}

// For Non-Technical Readers:
// 
// This file sets up the Insights page for our AI Calorie Tracker app. Here's what it does:
// 
// 1. It uses a technique called "dynamic importing" to load the main content of the insights page.
//    This can help the page load faster initially.
// 
// 2. While the main content is loading, it shows a simple "Loading..." message.
// 
// 3. Once the content is loaded, it displays the full insights page with all its features.
// 
// 4. The actual insights functionality (like displaying charts and nutrient data) is now
//    handled in a separate file called InsightsContent.tsx. This helps keep this main page file
//    simple and focused.
// 
// 5. This approach improves the app's performance by ensuring that Firebase-related code
//    is only loaded on the client side. This is achieved by setting 'ssr: false' in the
//    dynamic import options.
// 
// 6. By loading Firebase-related code only on the client side, we avoid potential issues
//    with server-side rendering (SSR) and ensure that Firebase initialization happens in
//    the browser environment where it's designed to work.
// 
// This setup creates a more efficient and potentially faster-loading insights page, while keeping
// the code organized, easier to manage, and compatible with client-side Firebase operations.