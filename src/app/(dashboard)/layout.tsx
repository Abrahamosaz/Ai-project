"use client";

import Navbar from "@/components/dashboard/Navbar";
import SideBar from "@/components/dashboard/Sidebar";
import { createContext, useState } from "react";
import { useWindowSize } from "../hooks/useWindowSize";

type DashboardContextType = {
  isSideBarShrink: boolean;
  setIsSideBarShrink: (value: boolean) => void;
  isNavOpen: boolean;
  setIsNavOpen: (value: boolean) => void;
};

// Create context with a better initial value
export const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const width = useWindowSize();
  const [isSideBarShrink, setIsSideBarShrink] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <DashboardContext.Provider
      value={{
        isSideBarShrink: isSideBarShrink,
        setIsSideBarShrink: setIsSideBarShrink,
        isNavOpen: isNavOpen,
        setIsNavOpen: setIsNavOpen,
      }}
    >
      <Navbar />

      {width! > 768 ? (
        <div className="flex h-screen">
          <SideBar />
          <div className="w-full bg-[#FAFAFA] px-5 py-10">{children}</div>
        </div>
      ) : (
        <>
          {isNavOpen ? (
            <SideBar />
          ) : (
            <div className="w-full bg-[#FAFAFA] px-5 py-10">{children}</div>
          )}
        </>
      )}
    </DashboardContext.Provider>
  );
}
