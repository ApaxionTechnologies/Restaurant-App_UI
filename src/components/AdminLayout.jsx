import React from "react";
import Sidebar from "./Sidebar";
import HomeHeader from "./HomeHeader";
import "./AdminLayout.css";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <div className="sidebar-wrap">
        <div className="sidebar-scale">
          <Sidebar />
        </div>
      </div>

      <div className="main-wrap">
        <HomeHeader />
        <main className="content-area">
          <div className="content-inner">
            {children /* page content goes here */}
          </div>
        </main>
      </div>
    </div>
  );
}
