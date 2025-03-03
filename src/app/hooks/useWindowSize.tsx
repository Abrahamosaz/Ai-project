"use client";

import { useState, useLayoutEffect } from "react";

export const useWindowSize = () => {
  // Initialize with `undefined` to avoid hydration mismatch
  const [width, setWidth] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    // Ensure `window` is available only on the client side
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // Set initial width
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
};
