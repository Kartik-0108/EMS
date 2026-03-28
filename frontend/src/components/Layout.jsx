import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="app-shell">
      <div className="app-grid">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col lg:pl-80">
          <Navbar />
          <main className="flex-1 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">{children || <Outlet />}</div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
