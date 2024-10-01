import React from 'react'
import { Bell, Activity, History, BarChart, Settings } from 'lucide-react'
import UserDropdown from './user-dropdown'

interface DashboardHeaderProps {
  currentPage: string
  theme: 'light' | 'dark'
  onThemeChange: (theme: 'light' | 'dark') => void
}

const pageIcons = {
  Dashboard: Activity,
  History: History,
  Insights: BarChart,
  Settings: Settings,
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ currentPage, theme, onThemeChange }) => {
  const IconComponent = pageIcons[currentPage as keyof typeof pageIcons] || Activity

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <IconComponent className="h-6 w-6 text-gray-600" />
        <h1 className="text-xl font-semibold text-gray-800">{currentPage}</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Bell className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700" />
        <UserDropdown theme={theme} onThemeChange={onThemeChange} />
      </div>
    </header>
  )
}

export default DashboardHeader