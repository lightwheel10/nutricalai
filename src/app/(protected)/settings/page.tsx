import dynamic from 'next/dynamic'

// Dynamically import the SettingsContent component
const SettingsContent = dynamic(() => import('./SettingsContent'), {
  loading: () => <p>Loading...</p>,
})

// Define the main SettingsPage component
export default function SettingsPage() {
  return <SettingsContent />
}

// For Non-Technical Readers:
// 
// This file sets up the Settings page for our AI Calorie Tracker app. Here's what it does:
// 
// 1. It uses a technique called "dynamic importing" to load the main content of the settings page.
//    This can help the page load faster initially.
// 
// 2. While the main content is loading, it shows a simple "Loading..." message.
// 
// 3. Once the content is loaded, it displays the full settings page with all its features.
// 
// 4. The actual settings functionality (like user profile, notifications, theme settings, etc.) is now
//    handled in a separate file called SettingsContent.tsx. This helps keep this main page file
//    simple and focused.
// 
// 5. This approach can improve the app's performance, especially on slower internet connections,
//    as it allows the basic structure of the page to load quickly while the more complex parts
//    are still being prepared.
// 
// This setup creates a more efficient and potentially faster-loading settings page, while keeping
// the code organized and easier to manage.