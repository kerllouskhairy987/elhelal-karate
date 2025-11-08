"use client";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import Header from "../header";
import Sidebar from "../sidepar/Sidebar";
import { JWTPayload } from "@/types";
interface LayoutProps {
  children: React.ReactNode;
  user: JWTPayload | null;
}

export default function Layout({ children, user }: LayoutProps) {
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
            user={user}
          />

          {/* Sidebar */}
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            isOpen={sidebarOpen}
            sidebarWidth={sidebarWidth}
            role={user?.role}
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
