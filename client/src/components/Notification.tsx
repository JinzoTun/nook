import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { getNotifications } from "@/api/Notification";
import { useEffect, useState } from "react";
import { Notification as Notif } from "@/interfaces/interfaces";
import { formatDate } from "@/utils/formatDate";

function Notification() {
  const [notifications, setNotifications] = useState<Notif[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    getNotifications(token).then((data) => {
      setNotifications(data);
    });
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500" />
          )}
          <span className="sr-only">Toggle Notification menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-2" align="end">
        <DropdownMenuLabel className="font-bold text-lg">Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="flex justify-center py-4 text-gray-500 text-sm">
            No new notifications
          </div>
        ) : (
          notifications.map((notif) => (
            <DropdownMenuItem key={notif._id} className="flex flex-col gap-2 p-2 ">
              <div className="flex items-start ">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <img src={notif.sender.avatar} className="text-xs font-bold text-gray-700 rounded-full"></img>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">
                 u/{notif.sender.username || "unknown user"} has {notif.type}ed you
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(notif.createdAt)}</p>
                </div>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Notification;
