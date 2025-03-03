import { create } from "zustand";

type DashboardState = {
  isSideBarShrink: boolean;
  isNavOpen: boolean;
  setIsSideBarShrink: (value: boolean) => void;
  setIsNavOpen: (value: boolean) => void;
};

export const useDashboardStore = create<DashboardState>((set) => ({
  isSideBarShrink: false,
  isNavOpen: false,
  setIsSideBarShrink: (value) => set({ isSideBarShrink: value }),
  setIsNavOpen: (value) => set({ isNavOpen: value }),
}));
