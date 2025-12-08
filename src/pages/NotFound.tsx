import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Don't log sensitive route information
    if (process.env.NODE_ENV === 'development') {
      console.error("404 Error: Route not found");
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black relative overflow-hidden">
      <div className="relative z-10 text-center">
        <h1 className="mb-4 text-4xl font-bold text-white">404</h1>
        <p className="mb-4 text-xl text-white/70">Oops! Page not found</p>
        <a href="/" className="text-white underline hover:text-white/90">
          Return to Home
        </a>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
