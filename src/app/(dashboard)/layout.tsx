"use client";

import Navbar from "@/components/dashboard/Navbar";
import SideBar from "@/components/dashboard/Sidebar";
import { useDashboardStore } from "@/store/dashboard.store";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isNavOpen } = useDashboardStore();

  return (
    <>
      <Navbar />
      <div className="flex max-md:hidden">
        <SideBar />
        <div className="w-full bg-[#FAFAFA] px-4 py-8">{children}</div>
      </div>
      <div className="md:hidden">
        {isNavOpen ? (
          <SideBar />
        ) : (
          <div className="w-full bg-[#FAFAFA] px-4 py-">{children}</div>
        )}
      </div>
    </>
  );
}
