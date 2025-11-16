import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { useSidebar } from "@/context/SidebarContext";

const Admin = () => {
  const { isHidden } = useSidebar();
  return (
    <>
      <Sidebar variant="admin" />
      <div className={`min-h-screen bg-background pt-16 md:pt-0 transition-all duration-300 ${isHidden ? "md:pl-0" : "md:pl-72"}`}>
        <div className="px-6 py-10 space-y-8">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Admin;
