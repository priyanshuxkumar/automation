import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export function TopNav() {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold">TaskFusion</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search" className="pl-8 w-[200px]" />
        </div>
        <Avatar className="w-10 h-10 bg-teal-200 border">
          <AvatarImage src="" />
          <AvatarFallback className="uppercase text-black/70 text-sm font-semibold mx-auto my-auto">
            PK
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}

