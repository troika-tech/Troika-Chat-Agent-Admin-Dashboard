// src/components/Layout.jsx
import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./UserSidebar";

export default function Layout({ children, chatbotId  }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex bg-gray-900">
      <Sidebar chatbotId={chatbotId} isOpen={sidebarOpen} onClose={handleSidebarClose}/>
      <div className="flex flex-col flex-1 min-h-screen md:ml-64 bg-gray-900">
        <Header onMenuClick={handleMenuClick} />
        <main className="p-4 md:p-6 bg-white">{children}</main>
      </div>
    </div>
  );
}
