import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Admin = () => {
  return (
    <>
      <Navbar variant="admin" />
      <div 
        className="min-h-screen bg-black pt-16"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <div className="px-6 py-10 space-y-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Admin;
