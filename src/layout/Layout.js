import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header"; // Import the Header component
import { useState } from "react";

const Layout = () => {

  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <Header toggleExpand={toggleExpand} isExpanded={isExpanded} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isExpanded={isExpanded} />

        {/* Main Content Area */}
        <main className="flex-1  overflow-y-scroll overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
