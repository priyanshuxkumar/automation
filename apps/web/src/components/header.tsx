import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between mx-auto">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl">
            TaskFusion
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  Products <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Zapier Platform</DropdownMenuItem>
                <DropdownMenuItem>Integrations</DropdownMenuItem>
                <DropdownMenuItem>Features</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  Solutions <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>For Sales</DropdownMenuItem>
                <DropdownMenuItem>For Marketing</DropdownMenuItem>
                <DropdownMenuItem>For IT</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost">Resources</Button>
            <Button variant="ghost">Enterprise</Button>
            <Button variant="ghost">Pricing</Button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost">Explore apps</Button>
          <Button variant="ghost">Contact sales</Button>
          <Button variant="ghost">Log in</Button>
          <Button >Sign up</Button>
        </div>
      </div>
    </header>
  )
}

