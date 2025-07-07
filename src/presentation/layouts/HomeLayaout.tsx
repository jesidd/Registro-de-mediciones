import { Outlet } from "react-router-dom";
import Sidebar from "../components/SideBar";
import { useState } from "react";

export default function HomeLayaout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto">
        {<Outlet />}
      </main> 
      </div>
    </>
  );
}
