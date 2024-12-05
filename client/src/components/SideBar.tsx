import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { HomeIcon } from "@radix-ui/react-icons";
import { AlignLeft, Search, TrendingUp } from "lucide-react";
import Footer from "./Footer";
import { HiPlus } from "react-icons/hi2";
import { useEffect, useState } from "react";
import {getJoinedDens , fetchUser} from "@/api/User";
import { Den, User } from "@/interfaces/interfaces";
import { RiFileList3Line } from "react-icons/ri";


function SideBar() {

   const [joinedDens, setJoinedDens] = useState<Den[]>([]);
   const [user, setUser] = useState<User>();

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

useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        fetchUser(token).then((user) => {
            setUser(user);
        }).catch((error) => {
            console.error("Error getting user:", error);
        });
    }
}
, []);




  return (
    <ScrollArea
      className="hidden h-[calc(100vh-64px)] lg:flex flex-col px-6 py-4 w-full border-r-2"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div className="flex flex-col gap-3 m-2 text-lg  ">
        <a href="/following" className="flex gap-4 justify-start  items-center">
        <HomeIcon width={23} height={25}></HomeIcon>
           <p  className=" flex gap-4 "> Home</p>
        </a>
        <a href="/popular" className="flex gap-4 justify-start  items-center">
        <TrendingUp width={25} height={25}></TrendingUp>
           <p  className=" flex gap-4 "> Popular</p>
        </a>
        <a href="/dens" className="flex gap-4 justify-start  items-center">
        <Search width={23} height={23}></Search>
           <p  className=" flex gap-4 "> Explore</p>
        </a>
        <a href="/" className="flex gap-4 justify-start  items-center">
        <AlignLeft width={25} height={25}></AlignLeft>
           <p  className=" flex gap-4 "> All</p>
        </a>


        <Separator />

        <h6 className=" text-base font-light opacity-70">Dens</h6>
        <a href="/d/create" className="flex gap-2 justify-start items-center ">
        <HiPlus size={26} ></HiPlus>
           <p  className=" "> Create a den</p>
        </a>
        
        {/* map throw joined dens key id */}

         {joinedDens.map((den) => (
               <a href={`/d/${den._id}`} key={den.name} className="flex gap-4 justify-start items-center ">
               <img
               src={den.avatar || 'https://via.placeholder.com/80'}
               alt={den.name}
               className="w-8 h-8 object-cover rounded-full  border-2 "
               />
                <p  className=" font-normal"> d/{den.name}</p>
               </a>
            ))}

            
         {/* map throw following users */}
         <Separator />
         <h6 className=" text-base font-light opacity-70">Following</h6>
         {user?.following.map((following) => (
               <a href={`/u/${following._id}`} key={following.username} className="flex gap-4 justify-start items-center ">
               <img
               src={following.avatar || 'https://via.placeholder.com/80'}
               alt={following.username}
               className="w-8 h-8 object-cover rounded-full  border-2 "
               />
                <p  className=" font-normal"> u/{following.username}</p>
               </a>
            ))}


            


         <Separator />

            
         <a href="/terms" className="flex gap-4 justify-start  items-center">
         <RiFileList3Line width={25} height={25}></RiFileList3Line>
            <p  className=" flex gap-4 "> Terms of Service</p>
         </a>

  

     


      </div>


      <Footer />
    </ScrollArea>
  );
}

export default SideBar;
