import Link from "next/link"
import { Home, Compass, Zap, PaintbrushIcon as Clock, MoreHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function Sidebar() {
  return (
    <div className="w-[250px] border-r h-screen p-4">
      <Button className="w-full mb-4">
        Create
      </Button>
      
      <nav className="space-y-2">
        <Link href="#" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>
        <Link href="#" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
          <Compass className="h-5 w-5" />
          <span>Discover</span>
        </Link>
        <Link href="#" className="flex items-center gap-2 p-2 rounded-lg bg-gray-100">
          <Zap className="h-5 w-5" />
          <span>TaskFusion</span>
        </Link> 
        <Link href="#" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
          <Clock className="h-5 w-5" />
          <span>TaskFusion History</span>
        </Link>
        <Link href="#" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
          <MoreHorizontal className="h-5 w-5" />
          <span>More</span>
        </Link>
      </nav>
    </div>
  )
}

