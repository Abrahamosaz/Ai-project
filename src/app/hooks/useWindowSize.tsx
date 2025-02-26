"use client";

import { useState, useLayoutEffect } from "react";

export const useWindowSize = () => {
  // Initialize with undefined to avoid hydration mismatch
  const [width, setWidth] = useState<number>(window.innerWidth);

  useLayoutEffect(() => {
    // Update width only after component mounts on client
    setWidth(window.innerWidth);

    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return width;
};
