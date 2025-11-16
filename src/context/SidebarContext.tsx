import { createContext, useContext, useState, ReactNode } from "react";

interface SidebarContextType {
  isHidden: boolean;
  setIsHidden: (hidden: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isHidden, setIsHidden] = useState(false);

  return (
    <SidebarContext.Provider value={{ isHidden, setIsHidden }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

