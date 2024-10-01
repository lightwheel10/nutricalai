import dynamic from 'next/dynamic'

// Dynamically import the HistoryContent component
const HistoryContent = dynamic(() => import('./HistoryContent'), {
  loading: () => <p>Loading...</p>,
})

// Define the main HistoryPage component
export default function HistoryPage() {
  return <HistoryContent />
}

// For Non-Technical Readers:
// 
// This file sets up the History page for our AI Calorie Tracker app. Here's what it does:
// 
// 1. It uses a technique called "dynamic importing" to load the main content of the history page.
//    This can help the page load faster initially.
// 
// 2. While the main content is loading, it shows a simple "Loading..." message.
// 
// 3. Once the content is loaded, it displays the full history page with all its features.
// 
// 4. The actual history functionality (like displaying meal logs and filtering) is now
//    handled in a separate file called HistoryContent.tsx. This helps keep this main page file
//    simple and focused.
// 
// 5. This approach can improve the app's performance, especially on slower internet connections,
//    as it allows the basic structure of the page to load quickly while the more complex parts
//    are still being prepared.
// 
// This setup creates a more efficient and potentially faster-loading history page, while keeping
// the code organized and easier to manage.