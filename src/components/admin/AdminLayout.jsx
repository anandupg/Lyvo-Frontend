import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import AdminFooter from './AdminFooter';

const AdminLayout = ({ children, showSidebar = true }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - Fixed position on desktop, overlay on mobile */}
      {showSidebar && (
        <div className={`
          fixed lg:fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <AdminSidebar onClose={closeSidebar} />
        </div>
      )}
      
      {/* Main Content Area - With left margin to account for fixed sidebar */}
      <div className={`flex-1 flex flex-col ${showSidebar ? 'lg:ml-64' : ''}`}>
        {/* Top Navbar - Fixed at top */}
        <div className="sticky top-0 z-30 bg-white">
          <AdminNavbar onMenuClick={toggleSidebar} />
        </div>
        
        {/* Page Content - Scrollable */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
        
        {/* Footer */}
        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminLayout; 