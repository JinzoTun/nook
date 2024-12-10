import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { HomeIcon } from "@radix-ui/react-icons";
import { AlignLeft, Search, TrendingUp } from "lucide-react";
import Footer from "./Footer";
import { HiPlus } from "react-icons/hi2";
import { useEffect, useState } from "react";
import { getJoinedDens } from "@/api/User";
import { Den } from "@/interfaces/interfaces";
import { RiFileList3Line } from "react-icons/ri";
import { useUser } from "@/context/UserContext";

function SideBar() {
  const { user, isLoading: userLoading } = useUser();
  const [joinedDens, setJoinedDens] = useState<Den[]>([]);
  const [isLoadingDens, setIsLoadingDens] = useState(true);

  // Load cached dens from localStorage initially
  useEffect(() => {
    const cachedDens = localStorage.getItem("dens");
    if (cachedDens) {
      setJoinedDens(JSON.parse(cachedDens));
    }

    // Fetch updated dens
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoadingDens(true);
      getJoinedDens(token)
        .then((dens) => {
          setJoinedDens(dens);
          localStorage.setItem("dens", JSON.stringify(dens));
        })
        .catch((error) => console.error("Error getting joined dens:", error))
        .finally(() => setIsLoadingDens(false));
    } else {
      setIsLoadingDens(false);
    }
  }, []);

  const loading = userLoading || isLoadingDens;

  return (
    <ScrollArea
      className="hidden h-[calc(100vh-64px)] lg:flex flex-col px-6 py-4 w-full border-r-2"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div className="flex flex-col gap-3 m-2 text-lg">
        {/* Static Links */}
        <a href="/following" className="flex gap-4 justify-start items-center">
          <HomeIcon width={23} height={25} />
          <p className="flex gap-4">Home</p>
        </a>
        <a href="/popular" className="flex gap-4 justify-start items-center">
          <TrendingUp width={25} height={25} />
          <p className="flex gap-4">Popular</p>
        </a>
        <a href="/dens" className="flex gap-4 justify-start items-center">
          <Search width={23} height={23} />
          <p className="flex gap-4">Explore</p>
        </a>
        <a href="/" className="flex gap-4 justify-start items-center">
          <AlignLeft width={25} height={25} />
          <p className="flex gap-4">All</p>
        </a>

        <Separator />

        {/* Dens Section */}
        <h6 className="text-base font-light opacity-70">Dens</h6>
        <a href="/d/create" className="flex gap-2 justify-start items-center">
          <HiPlus size={26} />
          <p>Create a den</p>
        </a>

        {loading && joinedDens.length === 0 ? (
          <p className="text-sm text-gray-500">Loading dens...</p>
        ) : (
          joinedDens.map((den) => (
            <a
              href={`/d/${den._id}`}
              key={den.name}
              className="flex gap-4 justify-start items-center"
            >
              <img
                src={den.avatar || "https://via.placeholder.com/80"}
                alt={den.name}
                className="w-8 h-8 object-cover rounded-full border-2"
              />
              <p className="font-normal">d/{den.name}</p>
            </a>
          ))
        )}

        <Separator />

        {/* Following Users Section */}
        <h6 className="text-base font-light opacity-70">Following</h6>
        {loading && !user ? (
          <p className="text-sm text-gray-500">Loading followers...</p>
        ) : (
          user?.following.map((following) => (
            <a
              href={`/u/${following._id}`}
              key={following.username}
              className="flex gap-4 justify-start items-center"
            >
              <img
                src={following.avatar || "https://via.placeholder.com/80"}
                alt={following.username}
                className="w-8 h-8 object-cover rounded-full border-2"
              />
              <p className="font-normal">u/{following.username}</p>
            </a>
          ))
        )}

        <Separator />

        {/* Footer Links */}
        <a href="/terms" className="flex gap-4 justify-start items-center">
          <RiFileList3Line width={25} height={25} />
          <p className="flex gap-4">Terms of Service</p>
        </a>
      </div>

      <Footer />
    </ScrollArea>
  );
}

export default SideBar;
