import dynamic from 'next/dynamic'

// Dynamically import the DashboardContent component
const DashboardContent = dynamic(() => import('./DashboardContent'), {
  loading: () => <p>Loading...</p>,
  ssr: false
})

// Define the main DashboardPage component
export default function DashboardPage() {
  return <DashboardContent />
}

// For Non-Technical Readers:
// 
// This file sets up the Dashboard page for our AI Calorie Tracker app. Here's what it does:
// 
// 1. It uses a technique called "dynamic importing" to load the main content of the dashboard page.
//    This can help the page load faster initially.
// 
// 2. While the main content is loading, it shows a simple "Loading..." message.
// 
// 3. Once the content is loaded, it displays the full dashboard page with all its features.
// 
// 4. The actual dashboard functionality (like displaying user stats and recent entries) is now
//    handled in a separate file called DashboardContent.tsx. This helps keep this main page file
//    simple and focused.
// 
// 5. We set 'ssr: false' to ensure that the DashboardContent component (which contains Firebase-related code)
//    is only loaded on the client side. This is important for proper functionality with Firebase.
// 
// 6. This approach can improve the app's performance, especially on slower internet connections,
//    as it allows the basic structure of the page to load quickly while the more complex parts
//    are still being prepared.
// 
// This setup creates a more efficient and potentially faster-loading dashboard page, while keeping
// the code organized and easier to manage.
