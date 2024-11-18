import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { HomeIcon } from "@radix-ui/react-icons";
import { AlignLeft, Search, TrendingUp } from "lucide-react";
import Footer from "./Footer";

import { GiMountainCave   } from "react-icons/gi"; // Game Icons


function SideBar() {
  return (
    <ScrollArea
      className="hidden h-[calc(100vh-64px)] lg:flex flex-col p-4 w-full border-r-2"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div className="flex flex-col gap-3 m-5 text-2xl font-semibold ">
        <a href="/" className="flex gap-4 justify-start  items-center">
        <HomeIcon width={25} height={25}></HomeIcon>
           <p  className=" flex gap-4 "> Home</p>
        </a>
        <a href="/" className="flex gap-4 justify-start  items-center">
        <TrendingUp width={25} height={25}></TrendingUp>
           <p  className=" flex gap-4 "> Popular</p>
        </a>
        <a href="/" className="flex gap-4 justify-start  items-center">
        <Search width={25} height={25}></Search>
           <p  className=" flex gap-4 "> Explore</p>
        </a>
        <a href="/" className="flex gap-4 justify-start  items-center">
        <AlignLeft width={25} height={25}></AlignLeft>
           <p  className=" flex gap-4 "> All</p>
        </a>

   
        <Separator />

        <a href="/dens" className="flex gap-4 justify-start  items-center">
        <GiMountainCave width={25} height={25}></GiMountainCave>
           <p  className=" flex gap-4 "> Dens</p>
        </a>

        <Separator />

        <h6 className=" text-base font-light opacity-70">My Dens</h6>
        {/* map throw joined dens */}

     


      </div>


      <Footer />
    </ScrollArea>
  );
}

export default SideBar;
