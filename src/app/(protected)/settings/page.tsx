import dynamic from 'next/dynamic'

// Dynamically import the SettingsContent component with ssr: false
const SettingsContent = dynamic(() => import('./SettingsContent'), {
  loading: () => <p>Loading...</p>,
  ssr: false
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
// 5. This approach improves the app's performance by ensuring that client-side specific code is only
//    loaded on the client side. This is achieved by setting 'ssr: false' in the dynamic import.
// 
// 6. Loading the client-side specific content only on the client side helps avoid potential issues
//    with server-side rendering, as some operations are typically used for client-side functionality.
// 
// This setup creates a more efficient and potentially faster-loading settings page, while keeping
// the code organized and easier to manage.