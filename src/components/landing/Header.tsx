import Link from 'next/link'
import { Button } from "@/components/ui/button"

const Header: React.FC = () => {
  return (
    <header className="py-4 px-6 flex justify-between items-center">
      <div className="text-2xl font-bold">AI Calorie Tracker</div>
      <nav>
        <Button asChild variant="ghost">
          <Link href="/login">Login</Link>
        </Button>
      </nav>
    </header>
  )
}

export default Header
