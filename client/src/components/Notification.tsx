import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import {  Bell } from "lucide-react"

function Notification() {
  return (
    <>
 <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Toggle Notification menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className=" w-48" align="end">
              <DropdownMenuLabel>Notification</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem >Nothing to show ...</DropdownMenuItem>

       
            </DropdownMenuContent>
          </DropdownMenu>
</>
  )
}

export default Notification