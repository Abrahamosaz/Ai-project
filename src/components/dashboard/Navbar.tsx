"use client";

import React, { useState } from "react";

import { MdMenu } from "react-icons/md";
import { BsPersonCircle } from "react-icons/bs";
import { useGetDashboardContext } from "@/app/hooks/useContext";
import { useWindowSize } from "@/app/hooks/useWindowSize";

const Navbar = () => {
  const { isSideBarShrink, setIsSideBarShrink, isNavOpen, setIsNavOpen } =
    useGetDashboardContext();

  const width = useWindowSize();

  return (
    <div className="bg-primary py-5 w-full z-10">
      {/* left  section */}

      <div className="container w-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          {width! > 768 ? (
            <MdMenu
              onClick={() => setIsSideBarShrink(!isSideBarShrink)}
              className="text-white h-6 w-6 cursor-pointer"
            />
          ) : (
            <MdMenu
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="text-white h-6 w-6 cursor-pointer"
            />
          )}

          <h1 className="text-2xl font-bold text-white">Automatisch-clone</h1>
        </div>

        {/* right section */}
        <BsPersonCircle className="text-white h-6 w-6" />
      </div>
    </div>
  );
};

export default Navbar;
