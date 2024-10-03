import dynamic from 'next/dynamic'

// Dynamically import the OnboardingContent component with ssr: false
const OnboardingContent = dynamic(() => import('./OnboardingContent'), {
  loading: () => <p>Loading...</p>,
  ssr: false
})

// Define the main OnboardingPage component
export default function OnboardingPage() {
  return <OnboardingContent />
}

// For Non-Technical Readers:
// 
// This file sets up the Onboarding page for our AI Calorie Tracker app. Here's what it does:
// 
// 1. It uses a technique called "dynamic importing" to load the main content of the onboarding page.
//    This can help the page load faster initially.
// 
// 2. While the main content is loading, it shows a simple "Loading..." message.
// 
// 3. Once the content is loaded, it displays the full onboarding page with all its features.
// 
// 4. The actual onboarding functionality (like collecting user information and preferences) is now
//    handled in a separate file called OnboardingContent.tsx. This helps keep this main page file
//    simple and focused.
// 
// 5. This approach improves the app's performance by ensuring that client-specific code is only
//    loaded on the client side. This is achieved by setting 'ssr: false' in the dynamic import.
// 
// 6. Loading the client-specific content only on the client side helps avoid potential issues
//    with server-side rendering, as some operations are typically used for client-side functionality.
// 
// This setup creates a more efficient and potentially faster-loading onboarding page, while keeping
// the code organized, easier to manage, and compatible with client-side operations.