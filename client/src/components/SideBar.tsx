import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { HomeIcon } from "@radix-ui/react-icons";
import { AlignLeft, Search, TrendingUp } from "lucide-react";
import Footer from "./Footer";

function SideBar() {
  return (
    <ScrollArea
      className="hidden h-[calc(100vh-64px)] lg:flex flex-col p-4 w-full border-r-2 "
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div className="">
        <h4 className="flex ml-6 gap-4 my-6 text-2xl font-medium leading-none">
          <HomeIcon width={25} height={25} /> Home
        </h4>

        <h4 className="flex my-6 ml-6 gap-4 text-2xl font-medium leading-none">
          <TrendingUp width={25} height={25} /> Popular
        </h4>

        <h4 className="flex ml-6 my-6 gap-4 text-2xl font-medium leading-none">
          <Search width={25} height={25} /> Explore
        </h4>

        <h4 className="flex ml-6 my-6 gap-4 text-2xl font-medium leading-none">
          <AlignLeft width={25} height={25} /> All
        </h4>
        <Separator />
    
      </div>


      <Footer />
    </ScrollArea>
  );
}

export default SideBar;
