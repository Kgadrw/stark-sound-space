import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

const Admin = () => {
  return (
    <div className="min-h-screen bg-black">
      <Sidebar variant="admin" />
      <div 
        className="md:ml-64 min-h-screen pt-16 md:pt-0"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <div className="px-4 sm:px-6 py-6 md:py-10 space-y-6 md:space-y-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Admin;
