import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="text-2xl font-bold tracking-tighter">ARTIST</div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("music")}
              className="text-sm font-medium hover:text-gray-medium transition-colors"
            >
              MUSIC
            </button>
            <button
              onClick={() => scrollToSection("videos")}
              className="text-sm font-medium hover:text-gray-medium transition-colors"
            >
              VIDEOS
            </button>
            <button
              onClick={() => scrollToSection("tours")}
              className="text-sm font-medium hover:text-gray-medium transition-colors"
            >
              TOURS
            </button>
            <button
              onClick={() => scrollToSection("shop")}
              className="text-sm font-medium hover:text-gray-medium transition-colors"
            >
              SHOP
            </button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={() => scrollToSection("music")}
              className="block w-full text-left px-3 py-2 text-base font-medium hover:bg-muted transition-colors"
            >
              MUSIC
            </button>
            <button
              onClick={() => scrollToSection("videos")}
              className="block w-full text-left px-3 py-2 text-base font-medium hover:bg-muted transition-colors"
            >
              VIDEOS
            </button>
            <button
              onClick={() => scrollToSection("tours")}
              className="block w-full text-left px-3 py-2 text-base font-medium hover:bg-muted transition-colors"
            >
              TOURS
            </button>
            <button
              onClick={() => scrollToSection("shop")}
              className="block w-full text-left px-3 py-2 text-base font-medium hover:bg-muted transition-colors"
            >
              SHOP
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
