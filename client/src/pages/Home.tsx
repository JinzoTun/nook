import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import LeftSidebar from "@/components/LeftSidebar";
import React from "react";

type HomeProps = {
  children: React.ReactNode;
};

export default function Home({ children }: HomeProps) {
  return (
    <>
      <Header />

      <div className="flex">
        {/* Sidebar fixed to the left */}
        <div className="hidden lg:flex fixed lg:w-1/5 w-0 ">
          <SideBar />
        </div>

        {/* Main Content dynamically rendered */}
        <div className="lg:w-3/5 w-full p-5 lg:ml-[20%]  pr-20">
          {children}
        </div>

        {/* CardDescription fixed to the right */}
        <div className="flex">
        <div className="hidden lg:block fixed mr-5 ml-12  top-16 right-0 lg:w-1/5 w-0 ">
          <LeftSidebar  />
        </div></div>
      </div>
    </>
  );
}
