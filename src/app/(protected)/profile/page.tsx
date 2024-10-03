import dynamic from 'next/dynamic'

// Dynamically import the ProfileContent component with ssr: false
const ProfileContent = dynamic(() => import('./ProfileContent'), {
  loading: () => <p>Loading...</p>,
  ssr: false
})

// Define the main ProfilePage component
export default function ProfilePage() {
  return <ProfileContent />
}

// For Non-Technical Readers:
// 
// This file sets up the Profile page for our AI Calorie Tracker app. Here's what it does:
// 
// 1. It uses a technique called "dynamic importing" to load the main content of the profile page.
//    This can help the page load faster initially.
// 
// 2. While the main content is loading, it shows a simple "Loading..." message.
// 
// 3. Once the content is loaded, it displays the full profile page with all its features.
// 
// 4. The actual profile functionality (like displaying and editing user information) is now
//    handled in a separate file called ProfileContent.tsx. This helps keep this main page file
//    simple and focused.
// 
// 5. This approach improves the app's performance, especially on slower internet connections,
//    as it allows the basic structure of the page to load quickly while the more complex parts
//    are still being prepared.
// 
// 6. By setting 'ssr: false', we ensure that the ProfileContent component is only loaded on the 
//    client side. This is important for components that rely on browser-specific APIs or need 
//    to access client-side data.
// 
// This setup creates a more efficient and potentially faster-loading profile page, while keeping
// the code organized, easier to manage, and compatible with client-side only operations.
