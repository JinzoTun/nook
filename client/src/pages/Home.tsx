import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import PostList  from "@/components/PostList";


export default function Home() {
  return (
    <>
      <Header />

      <div className="flex">
        {/* Sidebar fixed to the left */}
        <div className="hidden lg:flex fixed lg:w-1/5 w-0 ">
          <SideBar />
        </div>

        {/* Main Content */}
        <div className="lg:w-3/5  w-full p-5 lg:ml-[20%] h-[calc(100vh-64px)] overflow-auto">
        <PostList />

    
        </div>

        {/* CardDescription fixed to the right */}
        <div className="hidden lg:block fixed top-16 right-0 lg:w-1/5 w-0 border-l-2 h-[calc(100vh-64px)] p-5">
          <p>CardDescription</p>
        </div>
      </div>
    </>
  );
}
