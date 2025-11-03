"use client";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import Header from "../header";
import Sidebar from "../sidepar/Sidebar";
interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = 238;
  const navbarHeight = 73;
  const pathname = usePathname();
  const showFullLayout = pathname !== "/login";

  return (
    <div className="min-h-screen ">
      {showFullLayout && (
        <>
          {/* Fixed Navbar */}
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            sidebarWidth={sidebarWidth}
          />

          {/* Sidebar */}
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            isOpen={sidebarOpen}
            sidebarWidth={sidebarWidth}
          />
        </>
      )}
      <main
        className={`transition-all duration-300 min-h-screen ${
          showFullLayout ? "" : "pt-0 mr-0"
        }`}
        style={{
          marginRight: showFullLayout
            ? `${sidebarOpen ? sidebarWidth : 64}px`
            : "0px",
          paddingTop: showFullLayout ? `${navbarHeight}px` : "0px",
        }}
      >
        <div className="h-full">{children}</div>
      </main>
    </div>
  );
}
