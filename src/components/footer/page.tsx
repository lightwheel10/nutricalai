import Link from 'next/link'
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="text-lg font-bold text-gray-900">
              AI Calorie Tracker
            </Link>
          </div>
          <div className="flex space-x-4 mb-4 md:mb-0">
            <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">About</Link>
            <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">Contact</Link>
            <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">Terms of Service</Link>
          </div>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900">
              <Facebook size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900">
              <Twitter size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900">
              <Instagram size={20} />
            </a>
            <a href="mailto:contact@aicalorietracker.com" className="text-gray-400 hover:text-gray-900">
              <Mail size={20} />
            </a>
          </div>
        </div>
        <div className="mt-4 border-t border-gray-200 pt-4 text-center">
          <p className="text-sm text-gray-400">
            &copy; 2024 AI Calorie Tracker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer