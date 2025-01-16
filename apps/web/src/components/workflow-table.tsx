import { MoreVertical, Zap } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { WorkflowsProps } from '@/app/(workflow)/workflow/page'
import Image from 'next/image'
import { Switch } from './ui/switch'
import { Avatar } from './ui/avatar'
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'

const WorkflowTable = ({ data }: { data: WorkflowsProps[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Apps</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Last modified</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      {data && data.map((item : WorkflowsProps) => {
        return (
          <TableBody key={item.id} className='hover:bg-none'>
            <TableRow>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  {item.name}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {item?.icons?.actionIcons?.map((actionItem, index) => (
                    <Image
                      key={index}
                      src={actionItem}
                      width={20}
                      height={20}
                      alt={`action-icon-${index}`}
                    />
                  ))}
                  <Image
                    src={item?.icons?.triggerIcon}
                    width={20}
                    height={20}
                    alt="trigger-icon"
                  />
                </div>
              </TableCell>
              <TableCell>
                {item?.user?.firstname} {item?.user?.lastname} (Personal)
              </TableCell>
              <TableCell>2 seconds ago</TableCell>
              <TableCell>
                <Switch/>
              </TableCell>
              <TableCell>
              <Avatar className="w-6 h-6 bg-teal-200 border">
                <AvatarImage src="" />
                <AvatarFallback className="uppercase text-black/70 text-sm font-semibold mx-auto my-auto">
                  {item.user?.firstname?.slice(0, 1)}{item.user?.lastname?.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        );
      })}

    </Table>
  )
}


export default WorkflowTable;