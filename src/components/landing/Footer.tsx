import Link from 'next/link'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm text-gray-600 mb-4 md:mb-0">
          © 2024 AI Calorie Tracker. All rights reserved.
        </div>
        <nav className="flex gap-6">
          <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">Privacy Policy</Link>
          <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">Terms of Service</Link>
          <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">Contact Us</Link>
        </nav>
      </div>
    </footer>
  )
}

export default Footer
