import dynamic from 'next/dynamic'

// Dynamically import the ActivityContent component with ssr: false
const ActivityContent = dynamic(() => import('./ActivityContent'), {
  loading: () => <p>Loading...</p>,
  ssr: false
})

// Define the main ActivityPage component
export default function ActivityPage() {
  return <ActivityContent />
}

// For Non-Technical Readers:
// 
// This file sets up the Activity Logging page for our AI Calorie Tracker app.
// Here's what it does:
// 
// 1. It uses a technique called "dynamic importing" to load the main content
//    of the activity page. This can help the page load faster initially.
// 
// 2. While the main content is loading, it shows a simple "Loading..." message.
// 
// 3. Once the content is loaded, it displays the full activity page with all
//    its features, including the ability to log activities and view past logs.
// 
// 4. The actual functionality (like form handling and displaying logs) is
//    handled in a separate file called ActivityContent.tsx. This helps keep
//    this main page file simple and focused.
// 
// 5. This approach improves the app's performance by ensuring that Firebase-related
//    code is only loaded on the client side, not during server-side rendering.
// 
// 6. The 'ssr: false' option ensures that the component is only rendered on the
//    client side, which is necessary for components that use Firebase or other
//    browser-specific APIs.
// 
// This setup creates a more efficient and potentially faster-loading activity
// page, while keeping the code organized and easier to manage, and ensures
// compatibility with client-side only libraries like Firebase.