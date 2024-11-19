import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { HomeIcon } from "@radix-ui/react-icons";
import { AlignLeft, Search, TrendingUp } from "lucide-react";
import Footer from "./Footer";

import { GiMountainCave   } from "react-icons/gi"; // Game Icons
import { HiPlus } from "react-icons/hi2";

import { useEffect, useState } from "react";
import getJoinedDens from "@/api/GetJoinedDens";


interface densProps {
   _id: string;
   name: string;
   description: string;
   categories: string;
   avatar?: string;
   banner?: string;
   members: string[];


}


function SideBar() {

   const [joinedDens, setJoinedDens] = useState<densProps[]>([]);

   useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        getJoinedDens(token).then((dens) => {
            setJoinedDens(dens);
        }).catch((error) => {
            console.error("Error getting joined dens:", error);
        });
    }
}
, []);


  return (
    <ScrollArea
      className="hidden h-[calc(100vh-64px)] lg:flex flex-col p-4 w-full border-r-2"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div className="flex flex-col gap-3 m-5 text-xl  ">
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

        <h6 className=" text-base font-light opacity-70">Dens</h6>
        <a href="/den/create" className="flex gap-4 justify-start items-center ">
        <HiPlus size={30} ></HiPlus>
           <p  className=" "> Create a den</p>
        </a>
        
        {/* map throw joined dens key id */}

         {joinedDens.map((den) => (
               <a href={`/den/${den._id}`} key={den.name} className="flex gap-4 justify-start items-center ">
               <img
               src={den.avatar || 'https://via.placeholder.com/80'}
               alt={den.name}
               className="w-6 h-6 object-cover rounded-full  border-2 "
               />
                <p  className=" font-normal"> d/{den.name}</p>
               </a>
         ))}

  

     


      </div>


      <Footer />
    </ScrollArea>
  );
}

export default SideBar;
