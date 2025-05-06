import { ReactNode, useState } from "react";
import Navbar from "./UserNavbar";
import Sidebar from "./UserSidebar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex">
      {/* Sidebar - Controlled by Parent */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1">
        {/* Navbar - Controls Sidebar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <main className="p-4 pt-20">{children}</main>
      </div>
    </div>
  );
}
