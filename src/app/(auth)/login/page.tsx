import dynamic from 'next/dynamic'

// Dynamically import the LoginContent component
const LoginContent = dynamic(() => import('./LoginContent'), {
  loading: () => <p>Loading...</p>,
})

// Define the main LoginPage component
export default function LoginPage() {
  return <LoginContent />
}

// For Non-Technical Readers:
// 
// This code sets up the login page for a web application. Here's what it does in simple terms:
// 
// 1. It uses a technique called "dynamic importing" to load the main content of the login page.
//    This can help the page load faster initially.
// 
// 2. While the main content is loading, it shows a simple "Loading..." message.
// 
// 3. Once the content is loaded, it displays the full login page with all its features.
// 
// 4. The actual login functionality (like the Google sign-in button) is now handled in a separate file
//    called LoginContent.tsx. This helps keep this main page file simple and focused.
// 
// 5. This approach can improve the app's performance, especially on slower internet connections,
//    as it allows the basic structure of the page to load quickly while the more complex parts
//    are still being prepared.
// 
// This setup creates a more efficient and potentially faster-loading login page, while keeping
// the code organized and easier to manage.
